
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
  CheckCircle2, 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  Ruler, 
  PartyPopper,
  Send,
  MessageCircle,
  Hash
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';

interface OrderModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const db = useFirestore();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [isActualMobile, setIsActualMobile] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  const [chatSessionId] = useState(() => 'chat_' + Math.random().toString(36).substring(2, 11));
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    selectedSize: '',
    quantity: 1
  });

  // Auto-close success modal after exactly 3 seconds
  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

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
        setFormData({ name: '', phone: '', address: '', selectedSize: '', quantity: 1 });
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [product, isOpen]);

  const messagesQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'messages'),
      where('orderId', '==', chatSessionId)
    );
  }, [db, chatSessionId]);

  const { data: rawChatHistory, isLoading: isChatLoading } = useCollection(messagesQuery);

  const chatHistory = React.useMemo(() => {
    if (!rawChatHistory) return [];
    return [...rawChatHistory].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [rawChatHistory]);

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    // We transition instantly to SUCCESS to provide a super fast experience
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
      chatId: chatSessionId,
      createdAt: new Date().toISOString()
    };

    // Initiate writes without awaiting to ensure instant UI response
    addDocumentNonBlocking(collection(db, 'orders'), orderData);
    
    // Stock update logic initiated in background
    const productRef = doc(db, 'products', product.id);
    if (product.sizeStock && formData.selectedSize) {
      const currentSizeQty = product.sizeStock[formData.selectedSize] || 0;
      const newSizeStock = { 
        ...product.sizeStock, 
        [formData.selectedSize]: Math.max(0, currentSizeQty - formData.quantity) 
      };
      updateDocumentNonBlocking(productRef, {
        sizeStock: newSizeStock,
        stockQuantity: Math.max(0, (product.stockQuantity || 0) - formData.quantity)
      });
    } else {
      updateDocumentNonBlocking(productRef, {
        stockQuantity: Math.max(0, (product.stockQuantity || 0) - formData.quantity)
      });
    }

    setStep('SUCCESS');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    addDocumentNonBlocking(collection(db, 'messages'), {
      orderId: chatSessionId,
      customerName: formData.name || 'GUEST',
      text: chatMessage,
      sender: 'CUSTOMER',
      createdAt: new Date().toISOString()
    });

    setChatMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn(
        "p-0 bg-white border-none rounded-none overflow-hidden gap-0 shadow-2xl transition-all duration-300",
        step === 'SUCCESS' ? "max-w-[320px]" : "max-w-[1100px]"
      )}>
        <div className={cn(
          "flex flex-col md:flex-row h-full overflow-hidden",
          step === 'SUCCESS' ? "min-h-[300px]" : "max-h-[90vh] min-h-[600px]"
        )}>
          
          <div className={cn(
            "flex flex-col md:flex-row bg-white transition-all duration-300",
            step === 'SUCCESS' ? 'w-full' : 'w-full md:w-2/3'
          )}>
            {step === 'FORM' ? (
              <>
                {!isActualMobile && (
                  <div className="relative w-2/5 aspect-[4/5] bg-gray-50 border-r border-gray-100">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                      sizes="400px"
                      quality={75}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{product.name}</h2>
                      <div className="text-[22px] font-black text-[#01a3a4] flex items-baseline tracking-tighter mt-1">
                        <span className="text-[11px] font-normal mr-1 translate-y-[-4px] text-white/50">৳</span>
                        {product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className={cn(
                  "p-8 space-y-6 bg-white overflow-y-auto border-r border-gray-100",
                  isActualMobile ? 'w-full' : 'w-3/5'
                )}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1 bg-[#01a3a4]" />
                      <DialogTitle className="text-2xl font-black text-black uppercase tracking-tighter leading-none font-headline">ORDER CONFIRM</DialogTitle>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Ruler className="h-3 w-3 text-[#01a3a4]" /> SIZE
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {product?.sizes?.length > 0 ? product.sizes.map((size: string) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setFormData({...formData, selectedSize: size})}
                              className={cn(
                                "px-3 py-1.5 border text-[9px] font-black uppercase transition-all",
                                formData.selectedSize === size 
                                  ? 'bg-[#01a3a4] border-[#01a3a4] text-white' 
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#01a3a4]'
                              )}
                            >
                              {size}
                            </button>
                          )) : (
                            <span className="text-[8px] font-black text-gray-400 uppercase">N/A</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Hash className="h-3 w-3 text-[#01a3a4]" /> QTY
                        </label>
                        <input 
                          type="number"
                          min="1"
                          required
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-none h-9 px-3 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <User className="h-3 w-3 text-[#01a3a4]" /> NAME
                        </label>
                        <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="FULL NAME"
                          className="w-full bg-gray-50 border border-gray-200 rounded-none h-11 px-3 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-[#01a3a4]" /> PHONE
                        </label>
                        <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="01XXXXXXXXX"
                          className="w-full bg-gray-50 border border-gray-200 rounded-none h-11 px-3 text-[12px] font-black tracking-widest focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-[#01a3a4]" /> ADDRESS
                        </label>
                        <textarea 
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="AREA & CITY"
                          className="w-full bg-gray-50 border border-gray-200 rounded-none p-3 text-[12px] font-black uppercase tracking-widest min-h-[80px] focus:outline-none focus:border-[#01a3a4] focus:bg-white text-black"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#01a3a4] hover:bg-black text-white h-10 font-black uppercase tracking-[0.3em] rounded-none shadow-xl text-[10px] border-none"
                    >
                      অর্ডার নিশ্চিত করুন
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="w-full p-6 text-center space-y-4 flex flex-col justify-center bg-white border-2 border-[#01a3a4] items-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#01a3a4]/5 rounded-full flex items-center justify-center mx-auto mb-2 border-[2px] border-[#01a3a4]">
                    <CheckCircle2 className="h-8 w-8 text-[#01a3a4]" />
                  </div>
                  <PartyPopper className="absolute -top-1 right-[35%] h-6 w-6 text-[#01a3a4] animate-bounce" />
                </div>

                <div className="space-y-3">
                  <DialogTitle className="text-3xl font-black text-black uppercase tracking-tighter leading-none font-headline">
                    THANK YOU
                  </DialogTitle>
                  <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">অর্ডার সফল হয়েছে</p>
                  
                  <div className="py-3 border-y border-gray-50">
                    <p className="text-[13px] font-bold text-black font-headline leading-tight">
                      আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                    </p>
                  </div>

                  <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest">স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে...</p>
                </div>
              </div>
            )}
          </div>

          {step === 'FORM' && (
            <div className="w-full md:w-1/3 flex flex-col bg-gray-50 min-h-[500px] md:min-h-0 border-l border-gray-100">
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-[#01a3a4]" />
                  <h3 className="text-[9px] font-black text-black uppercase tracking-widest">LIVE SUPPORT</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[7px] font-black text-gray-400 uppercase">ONLINE</span>
                </div>
              </div>

              <div 
                ref={chatScrollContainerRef}
                className="flex-grow overflow-y-auto p-4 space-y-3"
              >
                {isChatLoading && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin text-[#01a3a4]" />
                  </div>
                )}
                
                {chatHistory.length === 0 && !isChatLoading && (
                  <div className="text-center py-6 opacity-40">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-relaxed px-4">
                      FEEL FREE TO SEND US A MESSAGE.
                    </p>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      "max-w-[85%] p-3 text-[10px] font-bold leading-tight",
                      msg.sender === 'CUSTOMER' 
                        ? 'bg-[#01a3a4] text-white rounded-l-lg rounded-tr-lg shadow-sm' 
                        : 'bg-white border border-gray-200 text-black rounded-r-lg rounded-tl-lg shadow-sm'
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="MESSAGE..."
                  className="flex-grow bg-gray-50 border border-gray-200 h-10 px-3 text-[10px] font-black uppercase text-black focus:outline-none focus:border-[#01a3a4]"
                />
                <Button type="submit" size="icon" className="h-10 w-10 bg-[#01a3a4] hover:bg-black rounded-none shrink-0 border-none">
                  <Send className="h-3.5 w-3.5 text-white" />
                </Button>
              </form>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
