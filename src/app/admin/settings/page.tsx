
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Sparkles, 
  Loader2, 
  MessageCircle,
  Github,
  CloudUpload,
  Zap,
  ExternalLink,
  Code,
  Terminal,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    descriptionBengali: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    whatsappUrl: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        descriptionBengali: settings.descriptionBengali || '',
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        twitterUrl: settings.twitterUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        whatsappUrl: settings.whatsappUrl || ''
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, formData, { merge: true });
    toast({
      title: "SETTINGS UPDATED",
      description: "SITE CONFIGURATION HAS BEEN SUCCESSFULLY SAVED.",
    });
  };

  const CodeBlock = ({ title, commands, description }: { title: string, commands: string[], description: string }) => (
    <div className="space-y-4 mb-10 group">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-1 bg-orange-600" />
        <h3 className="text-[12px] font-black text-white uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-[11px] text-muted-foreground uppercase leading-relaxed mb-4">{description}</p>
      <div className="bg-black/90 border border-white/10 p-6 font-mono text-[11px] text-green-400 space-y-3 relative overflow-hidden group-hover:border-orange-600/30 transition-all">
        <div className="absolute top-0 right-0 p-2 bg-white/5 text-[8px] font-black text-white/20 uppercase tracking-widest">TERMINAL</div>
        {commands.map((cmd, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-orange-600 select-none">$</span>
            <span className="break-all">{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Global Configuration</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SITE SETTINGS</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: CONTACT & BRAND FORM */}
          <div className="lg:col-span-6 space-y-8">
            <form onSubmit={handleSave} className="space-y-8">
              <Card className="bg-card border-white/5 rounded-none shadow-2xl">
                <CardHeader className="border-b border-white/5 p-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                    <Globe className="h-4 w-4" /> BRAND & CONTACT INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <Mail className="h-3 w-3" /> OFFICIAL EMAIL
                    </label>
                    <Input 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value.toUpperCase()})}
                      placeholder="INFO@SSSMARTHAAT.COM"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <Phone className="h-3 w-3" /> HELPLINE NUMBER
                    </label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+880 1XXX XXXXXX"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> CORPORATE ADDRESS
                    </label>
                    <Input 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value.toUpperCase()})}
                      placeholder="BANANI, DHAKA, BANGLADESH"
                      className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                      <Sparkles className="h-3 w-3" /> COMPANY BENGALI PROFILE
                    </label>
                    <Textarea 
                      value={formData.descriptionBengali}
                      onChange={(e) => setFormData({...formData, descriptionBengali: e.target.value})}
                      placeholder="এসএস স্মার্ট হাট — বাংলাদেশের প্রিমিয়াম ফ্যাশন এবং লাইফস্টাইল মার্কেটপ্লেস..."
                      className="bg-black/50 border-white/10 rounded-none text-sm min-h-[150px] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">SOCIAL MEDIA CHANNELS</CardTitle>
                    <div className="grid grid-cols-1 gap-4">
                       <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Facebook className="h-3 w-3" /> FACEBOOK</label>
                        <Input value={formData.facebookUrl} onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><Instagram className="h-3 w-3" /> INSTAGRAM</label>
                        <Input value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})} className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2"><MessageCircle className="h-3 w-3" /> WHATSAPP</label>
                        <Input value={formData.whatsappUrl} onChange={(e) => setFormData({...formData, whatsappUrl: e.target.value})} placeholder="HTTPS://WA.ME/8801XXXXXXXXX" className="bg-black/50 border-white/10 rounded-none text-[10px]" />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-16 font-black uppercase tracking-[0.2em] rounded-none shadow-2xl shadow-orange-600/10 text-xs mt-6">
                    <Save className="mr-3 h-5 w-5" /> SAVE ALL SETTINGS
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* RIGHT COLUMN: PUBLISHING GUIDE */}
          <div className="lg:col-span-6">
            <Card className="bg-card border-orange-600/20 rounded-none shadow-2xl overflow-hidden h-fit sticky top-24">
              <CardHeader className="bg-orange-600/10 border-b border-orange-600/20 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> ওয়েবসাইট পাবলিশিং গাইড (STEP-BY-STEP GUIDE)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-2">
                
                <div className="bg-orange-600/5 border border-orange-600/20 p-6 mb-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-orange-600" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">কিভাবে শুরু করবেন?</p>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed uppercase">
                    নিচের কমান্ডগুলো আপনার পিসি বা ল্যাপটপের টার্মিনালে (Terminal/CMD) একে একে রান করে আপনার ওয়েবসাইটটি অনলাইনে পাবলিশ করতে পারবেন। প্রতিটি সেকশনের কাজ বাংলায় দেওয়া হয়েছে।
                  </p>
                </div>

                {/* GITHUB */}
                <CodeBlock 
                  title="১. গিটহাবে কোড আপলোড (GITHUB PUSH)"
                  description="আপনার ওয়েবসাইটটি গিটহাবে সেভ করতে নিচের কোডগুলো ব্যবহার করুন। প্রথমে গিটহাবে একটি নতুন রিপোজিটরি তৈরি করে নিন।"
                  commands={[
                    'git init (গিট শুরু করা)',
                    'git add . (সব ফাইল সিলেক্ট করা)',
                    'git commit -m "Site Update" (পরিবর্তনগুলো সেভ করা)',
                    'git branch -M main (ব্রাঞ্চ সেট করা)',
                    'git remote add origin [আপনার-গিটহাব-লিঙ্ক]',
                    'git push -u origin main (কোড পাবলিশ করা)'
                  ]}
                />

                {/* VERCEL */}
                <CodeBlock 
                  title="২. ভার্সেল ডেপ্লয়মেন্ট (VERCEL DEPLOY)"
                  description="নেক্সট-জেএস সাইটের জন্য ভার্সেল সবথেকে ফাস্ট। টার্মিনাল থেকে সরাসরি লাইভ করতে নিচের কমান্ডগুলো দিন।"
                  commands={[
                    'npm install -g vercel (ভার্সেল টুলস ইন্সটল)',
                    'vercel login (ভার্সেল অ্যাকাউন্টে লগইন)',
                    'vercel --prod (সরাসরি প্রোডাকশনে পাবলিশ)'
                  ]}
                />

                {/* NETLIFY */}
                <CodeBlock 
                  title="৩. নেটলিফাই হোস্টিং (NETLIFY DEPLOY)"
                  description="নেটলিফায়ে সাইট লাইভ করতে সিএলআই (CLI) ব্যবহার করুন।"
                  commands={[
                    'npm install netlify-cli -g (ইন্সটল করা)',
                    'netlify login (অ্যাকসেস নেওয়া)',
                    'npm run build (সাইটটি তৈরির উপযোগী করা)',
                    'netlify deploy --prod (পাবলিশ করা)'
                  ]}
                />

                {/* FIREBASE */}
                <CodeBlock 
                  title="৪. ফায়ারবেস হোস্টিং (FIREBASE CLI)"
                  description="ফায়ারবেস হোস্টিং ব্যবহার করলে আপনার সাইট ফায়ারবেসের নিজস্ব ডোমেইনে থাকবে।"
                  commands={[
                    'npm install -g firebase-tools (টুলস ইন্সটল)',
                    'firebase login (গুগল দিয়ে লগইন)',
                    'firebase init (হোস্টিং সেটআপ শুরু)',
                    'npm run build (বিল্ড তৈরি করা)',
                    'firebase deploy (পাবলিশ সম্পন্ন করা)'
                  ]}
                />

                <div className="pt-6 border-t border-white/5 mt-10">
                   <div className="flex flex-col md:flex-row gap-4">
                    <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-12">
                      <a href="https://github.com/new" target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-4 w-4 text-orange-600" /> NEW REPOSITORY</a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-12">
                      <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer"><Zap className="mr-2 h-4 w-4 text-orange-600" /> VERCEL CONSOLE</a>
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
