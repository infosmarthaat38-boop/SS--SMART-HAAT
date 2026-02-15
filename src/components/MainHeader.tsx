
"use client";

import React, { memo } from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { MapPin } from 'lucide-react';

/**
 * MainHeader - Fixed at top.
 * Contains Navbar and Ultra-Slim Black Live Status Bar.
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
      <div className="fixed top-0 left-0 right-0 z-[120] bg-black gpu-accelerated shadow-2xl">
        <div className="px-2 md:px-12">
          {/* Constrained Header Container */}
          <div className="overflow-hidden">
            {/* Navbar with Signature Teal Background */}
            <div className="bg-[#01a3a4]">
              <Navbar />
            </div>
            
            {/* Pure Black Live Status Bar - Enhanced Text Visibility with Dynamic Color */}
            {settings?.liveStatus && (
              <div className="h-[24px] md:h-[32px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full bg-black border-t border-white/5">
                <div className="flex items-center gap-10 animate-marquee w-full px-4">
                  <div className="flex items-center gap-2 text-[9px] md:text-[13px] font-black uppercase tracking-[0.3em] shrink-0 text-white">
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
                    <span className="text-white/20">|</span> 
                    <span className="flex items-center gap-2 text-white">
                      <MapPin className="h-3 w-3 text-white" /> 
                      <span className="font-black opacity-60">HUB:</span> {hubLocation}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Spacer - Adjusted for new bar height */}
      <div className={settings?.liveStatus ? "h-[68px] md:h-[80px]" : "h-[44px] md:h-[48px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';
