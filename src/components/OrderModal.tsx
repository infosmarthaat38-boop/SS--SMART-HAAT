
"use client";

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Phone, 
  MapPin, 
  User, 
  Ruler, 
  PartyPopper,
  Hash,
  X,
  Truck,
  MessageCircle
} from 'lucide-react';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal = memo(({ product, isOpen, onClose }: OrderModalProps) => {
  const db = useFirestore();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: '',
    quantity: 1
  });

  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'site-config');
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  useEffect(() => {
    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }
    if (!isOpen) {
      setTimeout(() => {
        setStep('FORM');
        setFormData({ name: '', phone: '', address: '', selectedSize: '', quantity: 1 });
      }, 300);
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    const orderData = {
      customerName: formData.name.toUpperCase(),
      customerPhone: formData.phone,
      customerAddress: formData.address.toUpperCase(),
      selectedSize: formData.selectedSize || 'N/A',
      quantity: formData.quantity,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImageUrl: product.imageUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    if (db) {
      addDocumentNonBlocking(collection(db, 'orders'), orderData);
    }
    setStep('SUCCESS');
  };

  const handleWhatsAppChat = () => {
    const rawNumber = settings?.whatsappUrl || settings?.phone || '01700000000';
    let cleanPhone = rawNumber.replace(/[^0-9]/g, "");
    
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '88' + cleanPhone;
    }
    
    const message = `Hello SS SMART HAAT, I want to inquire about: ${product.name} (Price: ৳${product.price})`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn(
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300 fixed z-[150] outline-none",
        "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        step === 'SUCCESS' ? "max-w-[350px] w-[90vw]" : isMobile ? "w-full h-full" : "max-w-[750px] w-[95vw] h-auto"
      )}>
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 z-[200] p-1.5 bg-black text-white hover:bg-[#01a3a4] transition-all border border-white/10 shadow-xl"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col h-full max-h-[90vh] relative no-scrollbar">
          {step === 'FORM' ? (
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {!isMobile && (
                <div className="md:w-[280px] bg-gray-50 border-r border-gray-100 p-5 flex flex-col shrink-0">
                  <div className="relative w-full aspect-square border-2 border-white mb-4 bg-white shadow-lg overflow-hidden group">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      priority 
                    />
                  </div>
                  <div className="w-full space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-black uppercase tracking-tighter leading-tight font-headline line-clamp-2">{product.name}</h3>
                      <div className="text-[#01a3a4] font-black text-lg flex items-baseline">
                        <span className="text-[9px] font-normal mr-0.5 translate-y-[-2px] text-gray-400">৳</span>
                        {product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-gray-100 shadow-sm space-y-1.5">
                       <div className="flex items-center gap-2 text-[#01a3a4] mb-0.5">
                         <Truck className="h-3 w-3" />
                         <span className="text-[7px] font-black uppercase tracking-widest">ডেলিভারি চার্জ</span>
                       </div>
                       <p className="text-[9px] font-black text-black uppercase">ঢাকার ভিতরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeInside || '60'}</span></p>
                       <p className="text-[9px] font-black text-black uppercase">ঢাকার বাহিরে: <span className="text-[#01a3a4]">৳{settings?.deliveryChargeOutside || '120'}</span></p>
                    </div>
                  </div>
                </div>
              )}

              <div className={cn(
                "flex-grow p-5 md:p-7 space-y-4 bg-white overflow-y-auto relative no-scrollbar",
                !isMobile && "md:w-[470px]"
              )}>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-[#01a3a4]" />
                    <DialogTitle className="text-lg md:text-xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER NOW</DialogTitle>
                  </div>
                  <DialogDescription className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">PREMIUM SECURE CHECKOUT</DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Ruler className="h-3 w-3 text-[#01a3a4]" /> SIZE</label>
                      <div className="flex flex-wrap gap-1">
                        {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                          <button key={size} type="button" onClick={() => setFormData({...formData, selectedSize: size})} className={cn("px-2 py-1 border-2 text-[9px] font-black uppercase transition-all min-w-[35px]", formData.selectedSize === size ? 'bg-[#01a3a4] border-[#01a3a4] text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-[#01a3a4]')}>{size}</button>
                        )) : <span className="text-[8px] font-black text-gray-400 uppercase italic">Standard</span>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hash className="h-3 w-3 text-[#01a3a4]" /> QTY</label>
                      <input type="number" min="1" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-9 px-3 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3 text-[#01a3a4]" /> FULL NAME</label>
                      <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="ENTER YOUR NAME" className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-9 px-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Phone className="h-3 w-3 text-[#01a3a4]" /> PHONE NUMBER</label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01XXXXXXXXX" className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-9 px-4 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] text-black" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3 w-3 text-[#01a3a4]" /> ADDRESS</label>
                      <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="HOUSE, ROAD, AREA, CITY" className="w-full bg-gray-50 border-2 border-gray-100 rounded-none p-2 text-[11px] font-black uppercase tracking-widest min-h-[50px] focus:outline-none focus:border-[#01a3a4] text-black shadow-sm no-scrollbar" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <Button type="submit" className="w-full bg-[#01a3a4] hover:bg-black text-white h-11 font-black uppercase tracking-[0.3em] rounded-none shadow-xl text-[12px] border-none transition-all active:scale-95">অর্ডার নিশ্চিত করুন</Button>
                    <button 
                      type="button"
                      onClick={handleWhatsAppChat}
                      className="w-full flex items-center justify-center gap-2 h-9 bg-white border-2 border-green-500 text-green-600 font-black text-[9px] uppercase tracking-widest hover:bg-green-50 transition-all"
                    >
                      <MessageCircle className="h-3 w-3" /> CHAT WITH ADMIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full p-8 text-center space-y-6 flex flex-col justify-center bg-white items-center min-h-[350px]">
              <div className="relative">
                <div className="w-20 h-24 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto border-[4px] border-[#01a3a4] shadow-xl animate-in zoom-in-50 duration-700"><CheckCircle2 className="h-10 w-10 text-[#01a3a4]" /></div>
                <PartyPopper className="absolute -top-4 -right-6 h-10 w-10 text-[#01a3a4] animate-bounce" />
              </div>
              <div className="space-y-4">
                <DialogTitle className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none font-headline">THANK YOU</DialogTitle>
                <div className="h-1 w-16 bg-[#01a3a4] mx-auto rounded-full" />
                <p className="text-[12px] font-black text-[#01a3a4] uppercase tracking-[0.4em]">অর্ডার সফল হয়েছে</p>
                <div className="py-1 px-6"><p className="text-[14px] md:text-[16px] font-bold text-black font-headline leading-relaxed">যত দ্রুত সম্ভব আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে</p></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

OrderModal.displayName = 'OrderModal';
