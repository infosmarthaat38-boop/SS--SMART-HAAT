
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Terminal, 
  Info, 
  BookOpen,
  Github,
  Zap,
  ShieldCheck,
  User,
  Lock,
  Save,
  Loader2,
  Smartphone,
  RotateCcw,
  ExternalLink
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

  const [adminData, setAdminData] = useState({
    adminUsername: '',
    adminPassword: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (settings) {
      setAdminData({
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
    }
    // Set preview URL to the current origin
    setPreviewUrl(window.location.origin);
  }, [settings]);

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setDocumentNonBlocking(settingsRef, adminData, { merge: true });
    toast({
      title: "SECURITY CONFIGURATION UPDATED",
      description: "ADMIN ACCESS CREDENTIALS HAVE BEEN SUCCESSFULLY SYNCED.",
    });
  };

  const CodeBlock = ({ title, commands, explanation }: { title: string, commands: string[], explanation: string }) => (
    <div className="space-y-6 mb-12 group p-6 border border-white/5 bg-white/[0.01]">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-5 w-1.5 bg-orange-600" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <BookOpen className="h-4 w-4 text-orange-600 shrink-0 mt-1" />
          <p className="text-[11px] text-white/70 uppercase leading-relaxed font-bold">
            {explanation}
          </p>
        </div>
      </div>

      <div className="bg-black/90 border border-white/10 p-6 font-mono text-[11px] text-green-400 space-y-3 relative overflow-hidden group-hover:border-orange-600/30 transition-all shadow-inner">
        <div className="absolute top-0 right-0 p-2 bg-white/5 text-[8px] font-black text-white/20 uppercase tracking-widest">COMMAND TERMINAL</div>
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
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Operations & Security</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYSTEM SETTINGS</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT COLUMN: SECURITY & PUBLISH */}
            <div className="space-y-12">
              <Card className="bg-card border-orange-600/20 rounded-none shadow-2xl overflow-hidden">
                <CardHeader className="bg-orange-600/5 border-b border-white/5 p-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> ADMIN ACCESS CONFIGURATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSaveAdmin} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                          <User className="h-3 w-3" /> ADMIN USERNAME
                        </label>
                        <Input 
                          value={adminData.adminUsername}
                          onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})}
                          placeholder="E.G. ADMIN"
                          className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                          <Lock className="h-3 w-3" /> ADMIN PASSWORD
                        </label>
                        <Input 
                          type="text"
                          value={adminData.adminPassword}
                          onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})}
                          placeholder="E.G. 4321"
                          className="bg-black/50 border-white/10 rounded-none h-14 text-sm font-black text-white"
                        />
                      </div>
                    </div>
                    
                    <p className="text-[8px] text-orange-600 font-black uppercase tracking-[0.2em] italic">
                      * এই ইউজারনেম এবং পাসওয়ার্ড দিয়ে ভবিষ্যতে এডমিন প্যানেলে প্রবেশ করতে হবে।
                    </p>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 font-black uppercase tracking-[0.2em] rounded-none shadow-2xl shadow-orange-600/10 text-[10px]">
                      <Save className="mr-3 h-4 w-4" /> UPDATE CREDENTIALS
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
                <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> পাবলিশিং নির্দেশিকা
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                   <CodeBlock 
                    title="১. গিটহাব পাবলিশ"
                    explanation="আপনার পিসির ফোল্ডারে এই কমান্ডগুলো দিন।"
                    commands={[
                      'git init',
                      'git add .',
                      'git commit -m "Live"',
                      'git push origin main'
                    ]}
                  />
                  <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-14">
                    <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer"><Zap className="mr-2 h-4 w-4 text-orange-600" /> DEPLOY TO VERCEL</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: MOBILE PREVIEW (NEW FEATURE) */}
            <div className="space-y-6">
              <Card className="bg-card border-[#01a3a4]/20 rounded-none shadow-2xl overflow-hidden h-full">
                <CardHeader className="bg-[#01a3a4]/5 border-b border-white/5 p-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> MOBILE INTERFACE PREVIEW
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-[#01a3a4] hover:bg-[#01a3a4]/10 rounded-none"
                      onClick={() => setPreviewUrl(previewUrl + '?t=' + Date.now())}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-[#01a3a4] hover:bg-[#01a3a4]/10 rounded-none">
                      <a href="/" target="_blank"><ExternalLink className="h-4 w-4" /></a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 flex justify-center bg-black/40">
                  <div className="relative mx-auto border-[8px] border-white/10 rounded-[3rem] w-[320px] h-[600px] shadow-2xl overflow-hidden bg-black ring-1 ring-white/5">
                    {/* PHONE NOTCH */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/10 rounded-b-2xl z-20"></div>
                    
                    {/* IFRAME FOR ACTUAL LIVE PREVIEW */}
                    {previewUrl && (
                      <iframe 
                        src={previewUrl} 
                        className="w-full h-full border-none pt-2"
                        title="Mobile Preview"
                      />
                    )}

                    {!previewUrl && (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 text-[#01a3a4] animate-spin" />
                        <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">Loading Live Preview...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="p-6 bg-black border-t border-white/5">
                  <p className="text-[10px] font-black text-white/40 uppercase text-center leading-relaxed">
                    এই প্রিভিউটি আপনার মোবাইল ভিউ সিমুলেট করছে। <br/>
                    এখানে আপনি আপনার ওয়েবসাইটের মোবাইল রেসপন্সিভনেস এবং স্পিড পরীক্ষা করতে পারবেন।
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
