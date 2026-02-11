
"use client";

import React from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Radio, MapPin } from 'lucide-react';

/**
 * MainHeader - Combines Navbar and Live Status Bar with a fixed position.
 * Updated branding to BEST HAAT.
 */
export function MainHeader() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const broadcastColor = settings?.statusColor || '#ffffff';
  const liveLabel = settings?.liveStatusLabel || 'LIVE STATUS:';
  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[120] shadow-2xl bg-black">
        <Navbar />
        {settings?.liveStatus && (
          <div className="bg-black border-b border-[#01a3a4]/20 h-[24px] md:h-[28px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full">
            <div className="flex items-center gap-6 animate-marquee w-full px-4">
              <div className="flex items-center gap-3 text-[10px] md:text-[13px] font-black text-[#01a3a4] uppercase tracking-widest shrink-0">
                <Radio className="h-3 w-3 animate-pulse text-[#01a3a4]" /> {liveLabel}
              </div>
              <p 
                style={{ color: broadcastColor }}
                className="text-[10px] md:text-[14px] font-black uppercase tracking-[0.2em] flex items-center gap-6 shrink-0"
              >
                {settings.liveStatus} <span className="text-[#01a3a4]/40">||</span> 
                <span className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-3 w-3 text-[#01a3a4]" /> HUB: {hubLocation}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className={settings?.liveStatus ? "h-[88px] md:h-[92px]" : "h-[64px]"} />
    </>
  );
}
