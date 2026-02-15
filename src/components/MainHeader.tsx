"use client";

import React, { memo } from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { MapPin } from 'lucide-react';

/**
 * MainHeader - ROBUST LOCK.
 * Optimized for zero layout shift and 100% speed.
 */
export const MainHeader = memo(() => {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';
  const statusColor = settings?.statusColor || '#FFFFFF';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[120] bg-black gpu-accelerated shadow-2xl border-b border-white/5">
        <div className="px-2 md:px-12">
          <div className="overflow-hidden">
            <div className="bg-[#01a3a4]">
              <Navbar />
            </div>
            
            {settings?.liveStatus && (
              <div className="h-[24px] md:h-[32px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full bg-black">
                <div className="flex items-center gap-10 animate-marquee w-full px-4">
                  <div 
                    style={{ color: statusColor }}
                    className="flex items-center gap-2 text-[9px] md:text-[13px] font-bold uppercase tracking-[0.3em] shrink-0"
                  >
                    <div 
                      className="h-1.5 w-1.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
                    /> 
                    {settings.liveStatusLabel || 'LIVE STATUS:'}
                  </div>
                  <p 
                    style={{ color: statusColor }}
                    className="text-[9px] md:text-[13px] font-bold uppercase tracking-[0.2em] flex items-center gap-5 shrink-0"
                  >
                    {settings.liveStatus} 
                    <span className="opacity-40" style={{ color: statusColor }}>|</span> 
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" style={{ color: statusColor }} /> 
                      <span className="font-black">HUB:</span> {hubLocation}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={settings?.liveStatus ? "h-[68px] md:h-[80px]" : "h-[44px] md:h-[48px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';