
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Lock, 
  Save, 
  Loader2,
  Terminal,
  ExternalLink,
  Github,
  Zap,
  ShieldAlert,
  ChevronRight
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
      title: "SECURITY UPDATED",
      description: "ADMIN CREDENTIALS HAVE BEEN SUCCESSFULLY CHANGED.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-[#01a3a4]" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Security Operations</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">SYSTEM SETTINGS</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> ADMIN AUTHENTICATION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSaveAdmin} className="space-y-8">
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 mb-6 flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0" />
                  <p className="text-[9px] font-black text-orange-500 uppercase leading-relaxed tracking-widest">
                    CAUTION: UPDATING THESE CREDENTIALS WILL REQUIRE YOU TO RE-LOGIN ON ALL SESSIONS.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><User className="h-3 w-3" /> USERNAME</label>
                    <Input 
                      value={adminData.adminUsername}
                      onChange={(e) => setAdminData({...adminData, adminUsername: e.target.value})}
                      className="bg-black border-white/10 rounded-none h-14 text-sm font-black text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2"><Lock className="h-3 w-3" /> ACCESS PASSWORD</label>
                    <Input 
                      value={adminData.adminPassword}
                      onChange={(e) => setAdminData({...adminData, adminPassword: e.target.value})}
                      type="text"
                      className="bg-black border-white/10 rounded-none h-14 text-sm font-black text-white"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-14 font-black uppercase tracking-widest rounded-none text-[10px] transition-all border-none">
                  <Save className="mr-3 h-4 w-4" /> UPDATE SECURITY
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                <Terminal className="h-4 w-4" /> ডেপ্লয়মেন্ট গাইড (স্টেপ-বাই-স্টেপ)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                  <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">১</div>
                  <p className="text-[10px] font-black text-white uppercase leading-relaxed">গিটহাবে (GitHub) আপনার সব পরিবর্তন সেভ বা 'Commit' করুন।</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                  <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">২</div>
                  <p className="text-[10px] font-black text-white uppercase leading-relaxed">'Main' ব্রাঞ্চে কোড পুশ (Push) করুন।</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5">
                  <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">৩</div>
                  <p className="text-[10px] font-black text-white uppercase leading-relaxed">Vercel বা Firebase ড্যাশবোর্ডে গিয়ে বিল্ড প্রসেস চেক করুন।</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#01a3a4]/10 border border-[#01a3a4]/20">
                  <div className="h-6 w-6 rounded-full bg-[#01a3a4] text-white flex items-center justify-center text-[10px] font-black shrink-0">৪</div>
                  <p className="text-[10px] font-black text-[#01a3a4] uppercase leading-relaxed">বিল্ড শেষ হলে আপনার সাইট অটোমেটিক আপডেট হয়ে যাবে।</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/5">
                <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white hover:text-black h-12 font-black uppercase tracking-widest text-[9px] rounded-none">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> ওপেন গিটহাব (GITHUB)
                  </a>
                </Button>
                <Button asChild className="w-full bg-[#01a3a4] text-white hover:bg-white hover:text-black h-12 font-black uppercase tracking-widest text-[9px] rounded-none border-none">
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> ওপেন কন্ট্রোল প্যানেল
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
