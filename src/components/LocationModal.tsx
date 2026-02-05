
"use client";

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { MapPin, Radio, Clock, Store } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings } = useDoc(settingsRef);

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md bg-black border border-[#01a3a4]/30 rounded-none p-10 shadow-2xl">
        <DialogHeader className="space-y-4 text-center">
          <div className="w-16 h-16 bg-[#01a3a4]/10 border border-[#01a3a4]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Store className="h-8 w-8 text-[#01a3a4]" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">STORE STATUS</DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              LIVE UPDATES FROM OUR HUB
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-8 space-y-6">
          <div className="p-6 bg-white/5 border border-white/5 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-[#01a3a4]/10 border border-[#01a3a4]/20 flex items-center justify-center shrink-0">
                <Radio className="h-5 w-5 text-[#01a3a4] animate-pulse" />
              </div>
              <div>
                <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">Operation Status</p>
                <p className="text-[13px] font-black text-white uppercase mt-1 leading-tight">
                  {settings?.liveStatus || 'OPEN & READY TO PROCESS ORDERS'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 pt-6 border-t border-white/5">
              <div className="h-10 w-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-white/60" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Primary Hub</p>
                <p className="text-[13px] font-black text-white uppercase mt-1 leading-tight">
                  {settings?.liveLocation || 'BANANI, DHAKA, BANGLADESH'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-600/5 border border-orange-600/20 text-center">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-relaxed">
              "WE PROVIDE FAST NATIONWIDE DELIVERY FROM OUR CENTRAL HUB."
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
