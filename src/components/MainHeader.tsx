
"use client";

import React from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Radio, MapPin } from 'lucide-react';

/**
 * MainHeader - Combines Navbar and Live Status Bar with a fixed position.
 * Optimized for maximum clarity and visibility.
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
          <div className="bg-black border-b border-[#01a3a4]/20 h-[28px] md:h-[34px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full">
            <div className="flex items-center gap-8 animate-marquee w-full px-4">
              <div className="flex items-center gap-3 text-[11px] md:text-[15px] font-black text-[#01a3a4] uppercase tracking-widest shrink-0 drop-shadow-[0_0_8px_rgba(1,163,164,0.3)]">
                <Radio className="h-3.5 w-3.5 animate-pulse text-[#01a3a4]" /> {liveLabel}
              </div>
              <p 
                style={{ color: broadcastColor }}
                className="text-[12px] md:text-[18px] font-black uppercase tracking-[0.15em] flex items-center gap-8 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {settings.liveStatus} <span className="text-[#01a3a4]/40 scale-125">||</span> 
                <span className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4 text-[#01a3a4]" /> <span className="tracking-tighter">HUB:</span> {hubLocation}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className={settings?.liveStatus ? "h-[92px] md:h-[98px]" : "h-[64px]"} />
    </>
  );
}
