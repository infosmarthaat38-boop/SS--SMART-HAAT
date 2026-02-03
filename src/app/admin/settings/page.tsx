
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
  Loader2
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

  useEffect(() => {
    if (settings) {
      setAdminData({
        adminUsername: settings.adminUsername || 'ADMIN',
        adminPassword: settings.adminPassword || '4321'
      });
    }
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

        <div className="max-w-4xl mx-auto space-y-12">
          {/* SECURITY CONFIGURATION */}
          <Card className="bg-card border-orange-600/20 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-orange-600/5 border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> ADMIN ACCESS CONFIGURATION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSaveAdmin} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* PUBLISH GUIDE */}
          <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                <Terminal className="h-4 w-4" /> ওয়েবসাইট পাবলিশিং পূর্ণাঙ্গ নির্দেশিকা
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-orange-600/5 border border-orange-600/20 p-6 mb-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-orange-600" />
                  <p className="text-[12px] font-black text-white uppercase tracking-widest">কিভাবে টার্মিনাল ব্যবহার করবেন?</p>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed uppercase font-bold">
                  আপনার পিসির প্রজেক্ট ফোল্ডারের ভেতরে গিয়ে টার্মিনাল ওপেন করুন। এরপর নিচের ধাপগুলো একে একে সম্পন্ন করুন।
                </p>
              </div>

              <CodeBlock 
                title="১. গিটহাব (GITHUB VERSION CONTROL)"
                explanation="প্রথমে গিটহাবে একটি নতুন রিপোজিটরি তৈরি করুন এবং নিচের কমান্ডগুলো রান করুন।"
                commands={[
                  'git init',
                  'git add .',
                  'git commit -m "Initial Build"',
                  'git branch -M main',
                  'git remote add origin [YOUR_GITHUB_REPO_URL]',
                  'git push -u origin main'
                ]}
              />

              <CodeBlock 
                title="২. ভার্সেল (VERCEL DEPLOYMENT)"
                explanation="ভার্সেল ব্যবহার করে সরাসরি টার্মিনাল থেকে সাইট লাইভ করতে পারেন।"
                commands={[
                  'npm install -g vercel',
                  'vercel login',
                  'vercel --prod'
                ]}
              />

              <div className="pt-8 border-t border-white/5">
                 <div className="flex flex-col md:flex-row gap-4">
                  <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-14">
                    <a href="https://github.com/new" target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-4 w-4 text-orange-600" /> CREATE NEW REPO</a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none uppercase text-[9px] font-black h-14">
                    <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer"><Zap className="mr-2 h-4 w-4 text-orange-600" /> VERCEL DASHBOARD</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
