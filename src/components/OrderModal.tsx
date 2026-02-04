
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  Ruler, 
  Sparkles, 
  PartyPopper,
  Send,
  MessageCircle
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
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
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: ''
  });

  // Fetch messages for the current order in real-time
  const messagesQuery = useMemoFirebase(() => {
    if (!currentOrderId) return null;
    return query(
      collection(db, 'messages'),
      where('orderId', '==', currentOrderId),
      orderBy('createdAt', 'asc')
    );
  }, [db, currentOrderId]);

  const { data: chatHistory } = useCollection(messagesQuery);

  useEffect(() => {
    const userAgent = typeof window !== 'undefined' ? (navigator.userAgent || navigator.vendor || (window as any).opera) : '';
    if (/android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
      setIsActualMobile(true);
    }

    if (product?.sizes?.length > 0 && !formData.selectedSize) {
      setFormData(prev => ({ ...prev, selectedSize: product.sizes[0] }));
    }

    if (!isOpen) {
      const resetTimer = setTimeout(() => {
        setStep('FORM');
        setFormData({ name: '', phone: '', address: '', selectedSize: '' });
        setCurrentOrderId(null);
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [product, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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

    const docPromise = addDocumentNonBlocking(collection(db, 'orders'), orderData);
    docPromise?.then((docRef) => {
      if (docRef) setCurrentOrderId(docRef.id);
    });
    
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !currentOrderId) return;

    addDocumentNonBlocking(collection(db, 'messages'), {
      orderId: currentOrderId,
      customerName: formData.name,
      text: chatMessage,
      sender: 'CUSTOMER',
      createdAt: new Date().toISOString()
    });

    setChatMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={`max-w-4xl p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-500 ${step === 'SUCCESS' ? 'max-w-3xl' : 'max-w-4xl'}`}>
        {step === 'FORM' ? (
          <div className="flex flex-row h-full max-h-[95vh]">
            {!isActualMobile && (
              <div className="relative w-5/12 aspect-[4/5] bg-gray-100 border-r border-gray-100 overflow-hidden">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  sizes="400px"
                  quality={75}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ITEM ARCHIVE</p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">{product.name}</h2>
                  <div className="text-3xl font-black text-[#01a3a4] flex items-baseline tracking-tighter">
                    <span className="text-[0.45em] font-normal mr-1 translate-y-[-0.1em]">৳</span>
                    {product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className={`${isActualMobile ? 'w-full' : 'w-7/12'} p-12 space-y-10 bg-white overflow-y-auto`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-2 bg-[#01a3a4]" />
                  <DialogTitle className="text-4xl font-black text-black uppercase tracking-tighter leading-none font-headline">CONFIRM ORDER</DialogTitle>
                </div>
                <DialogDescription className="text-[11px] text-[#01a3a4] uppercase font-black tracking-[0.3em] leading-relaxed">
                  PLEASE ENTER ACCURATE DELIVERY INFORMATION
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {product?.sizes && product.sizes.length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
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
                              ? 'bg-[#01a3a4] border-[#01a3a4] text-white shadow-lg' 
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-[#01a3a4] hover:text-[#01a3a4]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-[#01a3a4] transition-colors">
                      <div className="p-2 bg-gray-50 border border-gray-100 group-focus-within:border-[#01a3a4] transition-colors"><User className="h-3 w-3" /></div>
                      FULL NAME
                    </label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ENTER YOUR FULL NAME"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-14 px-5 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-[#01a3a4] transition-colors">
                      <div className="p-2 bg-gray-50 border border-gray-100 group-focus-within:border-[#01a3a4] transition-colors"><Phone className="h-3 w-3" /></div>
                      CONTACT NUMBER
                    </label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="E.G. 017XXXXXXXX"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-none h-14 px-5 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-3 group-focus-within:text-[#01a3a4] transition-colors">
                      <div className="p-2 bg-gray-50 border border-gray-100 group-focus-within:border-[#01a3a4] transition-colors"><MapPin className="h-3 w-3" /></div>
                      DELIVERY ADDRESS
                    </label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="HOUSE, ROAD, AREA, CITY..."
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-none p-5 text-[12px] font-black uppercase tracking-widest min-h-[120px] focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black placeholder:text-gray-400 transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <Button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-[#01a3a4] hover:bg-black text-white h-16 font-black uppercase tracking-[0.4em] rounded-none shadow-xl text-[13px] transition-all duration-500 border-none"
                >
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "CONFIRM ORDER"}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full max-h-[95vh] bg-white">
            {/* SUCCESS MESSAGE AREA */}
            <div className="w-full md:w-1/2 p-12 text-center space-y-10 border-r border-gray-100">
               <div className="relative">
                <div className="w-32 h-32 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-8 border-[4px] border-[#01a3a4] shadow-xl">
                  <CheckCircle2 className="h-16 w-16 text-[#01a3a4]" />
                </div>
                <PartyPopper className="absolute -top-4 right-1/4 h-10 w-10 text-[#01a3a4] animate-bounce" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-[#01a3a4] uppercase tracking-[0.6em]">VERIFIED</p>
                  <DialogTitle className="text-4xl font-black text-black uppercase tracking-tighter leading-none font-headline">
                    THANK YOU FOR YOUR ORDER
                  </DialogTitle>
                </div>
                
                <p className="text-[20px] font-bold text-black leading-relaxed italic font-headline py-6 border-y border-gray-50">
                  আমাদের একজন প্রতিনিধি যত দ্রুত সম্ভব যোগাযোগ করবে।
                </p>

                <Button onClick={onClose} className="w-full bg-black hover:bg-[#01a3a4] text-white font-black uppercase h-14 rounded-none text-[14px] tracking-[0.3em] transition-all">
                  DONE
                </Button>
              </div>
            </div>

            {/* REAL-TIME CHAT AREA */}
            <div className="w-full md:w-1/2 flex flex-col bg-gray-50 h-[600px] md:h-auto">
              <div className="p-6 bg-white border-b border-gray-100 flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-[#01a3a4]" />
                <h3 className="text-[12px] font-black text-black uppercase tracking-widest">LIVE CUSTOMER SUPPORT</h3>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {chatHistory?.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                      আমাদের সাথে সরাসরি কথা বলতে নিচে মেসেজ দিন।
                    </p>
                  </div>
                )}
                {chatHistory?.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 text-[11px] font-medium leading-relaxed ${
                      msg.sender === 'CUSTOMER' 
                        ? 'bg-[#01a3a4] text-white rounded-l-2xl rounded-tr-2xl' 
                        : 'bg-white border border-gray-200 text-black rounded-r-2xl rounded-tl-2xl shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase mt-1 px-1">
                      {msg.sender === 'CUSTOMER' ? 'YOU' : 'SS SMART HAAT'} • {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="TYPE YOUR MESSAGE..."
                  className="flex-grow bg-gray-50 border border-gray-200 h-12 px-4 text-[11px] font-black uppercase focus:outline-none focus:border-[#01a3a4] transition-all"
                />
                <Button type="submit" size="icon" className="h-12 w-12 bg-[#01a3a4] hover:bg-black rounded-none">
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
