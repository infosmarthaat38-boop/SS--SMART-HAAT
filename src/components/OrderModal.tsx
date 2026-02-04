
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingBag, CheckCircle2, Loader2, Phone, MapPin, User, Ruler, Sparkles, PartyPopper } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface OrderModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const db = useFirestore();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [loading, setLoading] = useState(false);
  const [isActualMobile, setIsActualMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: ''
  });

  useEffect(() => {
    // Detect actual mobile devices
    const userAgent = typeof window !== 'undefined' ? (navigator.userAgent || navigator.vendor || (window as any).opera) : '';
    if (/android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
      setIsActualMobile(true);
    }

    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }
  }, [product, isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'SUCCESS') {
      timer = setTimeout(() => {
        handleClose();
      }, 10000); 
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleClose = () => {
    setStep('FORM');
    setFormData({ name: '', phone: '', address: '', selectedSize: '' });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setLoading(true);

    const orderData = {
      customerName: formData.name.toUpperCase(),
      customerPhone: formData.phone,
      customerAddress: formData.address.toUpperCase(),
      selectedSize: formData.selectedSize,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'orders'), orderData);
    
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1200);
  };

  return (
    <>
      <Dialog open={isOpen && step === 'FORM'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-4xl p-0 bg-black border border-white/10 rounded-none overflow-hidden gap-0 shadow-[0_0_50px_rgba(0,0,0,1)]">
          <div className="flex flex-row h-full max-h-[95vh]">
            
            {/* PRODUCT PREVIEW - HIDDEN ON MOBILE */}
            {!isActualMobile && (
              <div className="relative w-5/12 aspect-[4/5] bg-black border-r border-white/5 overflow-hidden">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover opacity-80"
                  sizes="400px"
                  quality={75}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                  <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.4em]">ITEM ARCHIVE</p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{product.name}</h2>
                  <div className="text-3xl font-black text-[#01a3a4] flex items-baseline tracking-tighter">
                    <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                    {product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* ENHANCED FORM AREA */}
            <div className={`${isActualMobile ? 'w-full' : 'w-7/12'} p-12 space-y-10 bg-[#050505] overflow-y-auto`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-2 bg-[#01a3a4] shadow-[0_0_15px_#01a3a4]" />
                  <DialogTitle className="text-4xl font-black text-white uppercase tracking-tighter leading-none font-headline">CONFIRM ORDER</DialogTitle>
                </div>
                <DialogDescription className="text-[11px] text-[#01a3a4] uppercase font-black tracking-[0.3em] leading-relaxed">
                  PLEASE ENTER ACCURATE DELIVERY INFORMATION
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {product?.sizes && product.sizes.length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-[#01a3a4]" /> SELECT SPECIFICATION
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData({...formData, selectedSize: size})}
                          className={`px-6 py-3 border text-[11px] font-black uppercase transition-all duration-300 ${
                            formData.selectedSize === size 
                              ? 'bg-[#01a3a4] border-[#01a3a4] text-white shadow-[0_0_15px_rgba(1,163,164,0.3)]' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-[#01a3a4] hover:text-[#01a3a4]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* FULL NAME INPUT */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-[#01a3a4] transition-colors">
                      <div className="p-2 bg-white/5 border border-white/10 group-focus-within:border-[#01a3a4] transition-colors"><User className="h-3 w-3" /></div>
                      FULL NAME
                    </label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ENTER YOUR FULL NAME"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-none h-14 px-5 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(1,163,164,0.1)] text-white placeholder:text-white/20 transition-all"
                    />
                  </div>

                  {/* CONTACT NUMBER INPUT */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-[#01a3a4] transition-colors">
                      <div className="p-2 bg-white/5 border border-white/10 group-focus-within:border-[#01a3a4] transition-colors"><Phone className="h-3 w-3" /></div>
                      CONTACT NUMBER
                    </label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="E.G. 017XXXXXXXX"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-none h-14 px-5 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(1,163,164,0.1)] text-white placeholder:text-white/20 transition-all"
                    />
                  </div>

                  {/* DELIVERY ADDRESS TEXTAREA */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-[#01a3a4] transition-colors">
                      <div className="p-2 bg-white/5 border border-white/10 group-focus-within:border-[#01a3a4] transition-colors"><MapPin className="h-3 w-3" /></div>
                      DELIVERY ADDRESS
                    </label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="HOUSE, ROAD, AREA, CITY..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-none p-5 text-[12px] font-black uppercase tracking-widest min-h-[120px] focus:outline-none focus:border-[#01a3a4] focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(1,163,164,0.1)] text-white placeholder:text-white/20 transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-16 font-black uppercase tracking-[0.4em] rounded-none shadow-[0_15px_40px_rgba(1,163,164,0.2)] text-[13px] transition-all duration-500 border-none"
                >
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "CONFIRM ORDER"}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* LUXURY SUCCESS MODAL */}
      <Dialog open={isOpen && step === 'SUCCESS'} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent className="max-w-2xl bg-black border-[5px] border-[#01a3a4] rounded-none p-0 overflow-hidden shadow-[0_0_100px_rgba(1,163,164,0.5)] relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#01a3a4] via-white to-[#01a3a4]" />
          <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#01a3a4] via-white to-[#01a3a4]" />
          
          <div className="relative p-16 text-center space-y-12">
            <div className="relative">
              <div className="w-40 h-40 bg-[#01a3a4]/10 rounded-full flex items-center justify-center mx-auto mb-10 border-[4px] border-[#01a3a4] shadow-[0_0_60px_rgba(1,163,164,0.6)] animate-pulse">
                <CheckCircle2 className="h-20 w-20 text-[#01a3a4]" />
              </div>
              <PartyPopper className="absolute -top-6 right-1/4 h-12 w-12 text-[#01a3a4] animate-bounce" />
              <Sparkles className="absolute bottom-0 left-1/4 h-10 w-10 text-[#01a3a4] animate-spin-slow" />
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[13px] font-black text-[#01a3a4] uppercase tracking-[0.8em] animate-pulse">SYSTEM VERIFIED</p>
                <DialogTitle className="text-5xl font-black text-white uppercase tracking-tighter leading-none font-headline">
                  THANK YOU FOR YOUR ORDER
                </DialogTitle>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="h-1.5 w-32 bg-gradient-to-r from-transparent to-[#01a3a4]" />
                <Sparkles className="h-8 w-8 text-[#01a3a4]" />
                <div className="h-1.5 w-32 bg-gradient-to-l from-transparent to-[#01a3a4]" />
              </div>

              <div className="space-y-6">
                <DialogDescription className="text-[24px] font-bold text-white leading-relaxed max-w-lg mx-auto border-y border-white/10 py-10 px-6 italic font-headline">
                  আমাদের একজন প্রতিনিধি যত দ্রুত সম্ভব আপনার সঙ্গে যোগাযোগ করবে।
                </DialogDescription>
                
                <p className="text-[12px] font-black text-[#01a3a4] uppercase tracking-[0.6em] opacity-80">
                  SS SMART HAAT • DHAKA, BANGLADESH
                </p>
              </div>
            </div>

            <Button 
              onClick={handleClose} 
              className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black uppercase h-24 rounded-none text-[20px] tracking-[0.5em] transition-all duration-700 shadow-[0_20px_50px_rgba(1,163,164,0.4)] border-none"
            >
              ঠিক আছে
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
