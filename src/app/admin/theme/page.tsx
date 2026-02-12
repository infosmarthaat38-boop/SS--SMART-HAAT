
"use client";

import React, { useState, useEffect } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Palette, 
  Save, 
  Loader2, 
  Undo2, 
  Monitor, 
  Smartphone,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AdminTheme() {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings, isLoading } = useDoc(settingsRef);

  const [colors, setColors] = useState({
    themePrimaryColor: '#01a3a4',
    themeBackgroundColor: '#000000',
    themeButtonColor: '#01a3a4'
  });

  useEffect(() => {
    if (settings) {
      setColors({
        themePrimaryColor: settings.themePrimaryColor || '#01a3a4',
        themeBackgroundColor: settings.themeBackgroundColor || '#000000',
        themeButtonColor: settings.themeButtonColor || '#01a3a4'
      });
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsRef) return;

    setDocumentNonBlocking(settingsRef, colors, { merge: true });
    toast({
      title: "THEME UPDATED",
      description: "SITE COLORS ARE NOW LIVE ACROSS ALL DEVICES.",
    });
  };

  const resetToDefault = () => {
    setColors({
      themePrimaryColor: '#01a3a4',
      themeBackgroundColor: '#000000',
      themeButtonColor: '#01a3a4'
    });
    toast({
      title: "PRESET LOADED",
      description: "SYSTEM DEFAULTS HAVE BEEN APPLIED TO THE BOARD.",
    });
  };

  if (isLoading || !db) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Visual Identity</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">THEME CONTROL</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CONTROL PANEL */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Palette className="h-4 w-4" /> MASTER COLOR BOARD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSave} className="space-y-8">
                  
                  <div className="space-y-6">
                    {/* PRIMARY COLOR */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex justify-between">
                        <span>Theme Primary Color</span>
                        <span className="text-primary font-mono">{colors.themePrimaryColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themePrimaryColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themePrimaryColor} 
                            onChange={(e) => setColors({...colors, themePrimaryColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themePrimaryColor} 
                          onChange={(e) => setColors({...colors, themePrimaryColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-white uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <p className="text-[8px] text-white/30 uppercase font-black">Controls: Links, Active Icons, Accents, and System Highlights.</p>
                    </div>

                    {/* BACKGROUND COLOR */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex justify-between">
                        <span>Template Background</span>
                        <span className="text-primary font-mono">{colors.themeBackgroundColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themeBackgroundColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themeBackgroundColor} 
                            onChange={(e) => setColors({...colors, themeBackgroundColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themeBackgroundColor} 
                          onChange={(e) => setColors({...colors, themeBackgroundColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-white uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <p className="text-[8px] text-white/30 uppercase font-black">Controls: Global background and Card base colors.</p>
                    </div>

                    {/* BUTTON COLOR */}
                    <div className="space-y-3 p-5 bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex justify-between">
                        <span>Action Button Color</span>
                        <span className="text-primary font-mono">{colors.themeButtonColor}</span>
                      </label>
                      <div className="flex gap-4">
                        <div 
                          className="w-14 h-14 border border-white/20 relative cursor-pointer overflow-hidden"
                          style={{ backgroundColor: colors.themeButtonColor }}
                        >
                          <input 
                            type="color" 
                            value={colors.themeButtonColor} 
                            onChange={(e) => setColors({...colors, themeButtonColor: e.target.value})}
                            className="absolute inset-0 opacity-0 cursor-pointer scale-[3]"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={colors.themeButtonColor} 
                          onChange={(e) => setColors({...colors, themeButtonColor: e.target.value.toUpperCase()})}
                          className="flex-grow bg-black border border-white/10 h-14 px-4 text-sm font-mono text-white uppercase outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <p className="text-[8px] text-white/30 uppercase font-black">Controls: "অর্ডার করুন" (ORDER NOW) button color.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-white hover:text-black text-white h-16 font-black uppercase rounded-none text-xs tracking-[0.2em] shadow-2xl transition-all">
                      <Save className="mr-2 h-5 w-5" /> SYNC THEME SETTINGS
                    </Button>
                    <button 
                      type="button" 
                      onClick={resetToDefault} 
                      className="w-full text-white/20 hover:text-primary transition-colors py-2 font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-2"
                    >
                      <Undo2 className="h-3 w-3" /> RESET TO SYSTEM DEFAULTS
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* LIVE SIMULATOR & PREVIEW PLATE */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden h-full">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> LIVE INTERACTIVE SIMULATOR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center bg-[#050505] min-h-[700px] relative">
                
                {/* DECORATIVE ELEMENTS */}
                <div className="absolute top-10 right-10 flex flex-col gap-2">
                  <div className="w-20 h-1 bg-primary opacity-20" />
                  <div className="w-12 h-1 bg-primary opacity-10" />
                </div>

                {/* PHONE FRAME SIMULATOR */}
                <div 
                  className="w-full max-w-[320px] aspect-[9/19] border-[12px] border-[#1a1a1a] rounded-[45px] relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-colors duration-700"
                  style={{ backgroundColor: colors.themeBackgroundColor }}
                >
                  {/* NOTCH */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-30 flex items-center justify-center">
                    <div className="w-10 h-1 bg-white/5 rounded-full" />
                  </div>
                  
                  {/* SIMULATED CONTENT */}
                  <div className="flex-grow flex flex-col">
                    {/* Header */}
                    <div className="h-14 bg-black border-b border-white/5 flex items-center px-6 gap-3 mt-4">
                      <div className="w-6 h-6 border border-white/20 flex items-center justify-center">
                        <span style={{ color: colors.themePrimaryColor }} className="text-[10px] font-black">SS</span>
                      </div>
                      <div className="flex-grow h-2 bg-white/5 rounded-full" />
                      <div className="w-4 h-4 bg-white/10 rounded-full" />
                    </div>

                    {/* Banner */}
                    <div className="h-32 bg-white/5 m-4 border border-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 space-y-1">
                        <div className="h-1.5 w-16 bg-white/20" />
                        <div className="h-3 w-24" style={{ backgroundColor: colors.themePrimaryColor }} />
                      </div>
                    </div>

                    {/* Product Card Simulation */}
                    <div className="p-4 space-y-4">
                      <div className="aspect-square w-full border border-white/10 relative group bg-black/40">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Layers className="h-10 w-10 text-white/5" />
                         </div>
                         <div 
                          className="absolute bottom-2 right-2 px-3 py-1 text-[9px] font-black text-white shadow-xl"
                          style={{ backgroundColor: colors.themeButtonColor }}
                         >
                          -50%
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-2.5 w-3/4 bg-white/10" />
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-black" style={{ color: colors.themePrimaryColor }}>৳ 2,450</div>
                          <div className="h-1.5 w-10 bg-white/5" />
                        </div>
                      </div>

                      <button 
                        className="w-full h-12 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95"
                        style={{ backgroundColor: colors.themeButtonColor }}
                      >
                        অর্ডার করুন
                      </button>
                    </div>
                  </div>

                  {/* BOTTOM HOME BAR */}
                  <div className="h-6 bg-transparent flex items-center justify-center shrink-0">
                    <div className="w-24 h-1 bg-white/20 rounded-full" />
                  </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themePrimaryColor }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themeBackgroundColor }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.themeButtonColor }} />
                  </div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> REAL-TIME VISUALIZATION
                  </p>
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
