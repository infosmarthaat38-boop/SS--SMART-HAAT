"use client";

import React, { memo } from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Radio, MapPin } from 'lucide-react';

export const MainHeader = memo(() => {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';

  return (
    <>
      {/* OUTER FULL-WIDTH BLACK CONTAINER */}
      <div className="fixed top-0 left-0 right-0 z-[120] bg-black gpu-accelerated shadow-2xl">
        
        {/* ALIGNMENT CONTAINER (Matches Product Grid Margin) */}
        <div className="px-2 md:px-12">
          
          {/* CONTENT BOX */}
          <div className="overflow-hidden">
            {/* 1. NAVBAR PART (TEAL BACKGROUND) */}
            <div className="bg-[#01a3a4]">
              <Navbar />
            </div>
            
            {/* 2. LIVE STATUS BAR PART (PURE BLACK) */}
            {settings?.liveStatus && (
              <div className="h-[20px] md:h-[24px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full bg-black">
                <div className="flex items-center gap-8 animate-marquee w-full px-4">
                  <div className="flex items-center gap-2 text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] shrink-0 text-white">
                    <div className="h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse" /> {settings.liveStatusLabel || 'LIVE STATUS:'}
                  </div>
                  <p className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.1em] flex items-center gap-4 shrink-0 text-white/90">
                    {settings.liveStatus} <span className="text-white/20">•</span> 
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-2 w-2 text-white/40" /> <span className="opacity-40 font-black">HUB:</span> {hubLocation}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* SPACER TO PREVENT CONTENT OVERLAP */}
      <div className={settings?.liveStatus ? "h-[74px] md:h-[80px]" : "h-[56px] md:h-[58px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';
