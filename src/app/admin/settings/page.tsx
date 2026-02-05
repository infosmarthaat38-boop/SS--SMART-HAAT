
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
  Zap
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
    <div className="min-h-screen flex flex-col bg-background">
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
          
          <Card className="bg-card border-white/5 rounded-none shadow-2xl">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> ADMIN AUTHENTICATION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSaveAdmin} className="space-y-8">
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
                <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-14 font-black uppercase tracking-widest rounded-none text-[10px] transition-all">
                  <Save className="mr-3 h-4 w-4" /> UPDATE SECURITY
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 rounded-none shadow-2xl">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                <Terminal className="h-4 w-4" /> DEPLOYMENT HUB
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Github className="h-4 w-4" /> GITHUB UPDATES</h3>
                <div className="bg-black border border-white/10 p-4 font-mono text-[9px] text-green-400 space-y-2">
                  <p>git add .</p>
                  <p>git commit -m "Update Product Logic"</p>
                  <p>git push origin main</p>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Zap className="h-4 w-4 text-orange-500" /> LIVE VERCEL STATUS</h3>
                <Button asChild className="w-full bg-white text-black hover:bg-white/90 h-12 font-black uppercase tracking-widest text-[9px] rounded-none">
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> VERCEL DASHBOARD
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
