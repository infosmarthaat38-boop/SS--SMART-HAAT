
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  User, 
  Clock, 
  Search,
  Loader2,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';

/**
 * AdminMessages - একটি প্রফেশনাল চ্যাট সেন্টার।
 * এখান থেকে কাস্টমারদের মেসেজ দেখা এবং রিয়েল-টাইমে রিপ্লাই দেওয়া যায়।
 */
export default function AdminMessages() {
  const db = useFirestore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // সব মেসেজ নিয়ে আসা
  const allMessagesQuery = useMemoFirebase(() => collection(db, 'messages'), [db]);
  const { data: rawAllMessages, isLoading } = useCollection(allMessagesQuery);

  // ইউনিক চ্যাট লিস্ট তৈরি করা (প্রতিটি কাস্টমারের জন্য একটি লিস্ট আইটেম)
  const uniqueChats = React.useMemo(() => {
    if (!rawAllMessages) return [];
    const seen = new Map();
    
    rawAllMessages.forEach(msg => {
      const existing = seen.get(msg.orderId);
      // সর্বশেষ মেসেজটি দেখানোর জন্য সর্টিং লজিক
      if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
        seen.set(msg.orderId, msg);
      }
    });

    return Array.from(seen.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rawAllMessages]);

  // সিলেক্ট করা কাস্টমারের সব মেসেজ ফিল্টার করা
  const chatQuery = useMemoFirebase(() => {
    if (!selectedOrderId) return null;
    return query(
      collection(db, 'messages'),
      where('orderId', '==', selectedOrderId)
    );
  }, [db, selectedOrderId]);

  const { data: rawActiveChat } = useCollection(chatQuery);

  // মেসেজগুলো সময়ের ক্রমানুসারে সাজানো
  const activeChat = React.useMemo(() => {
    if (!rawActiveChat) return [];
    return [...rawActiveChat].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [rawActiveChat]);

  // নতুন মেসেজ আসলে অটোমেটিক নিচে স্ক্রল করা
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

  // রিপ্লাই পাঠানোর ফাংশন
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedOrderId) return;

    addDocumentNonBlocking(collection(db, 'messages'), {
      orderId: selectedOrderId,
      text: replyText.toUpperCase(), // ব্র্যান্ড স্টাইল অনুযায়ী বড় হাতের অক্ষর
      sender: 'ADMIN',
      createdAt: new Date().toISOString()
    });

    setReplyText('');
  };

  const selectedChatInfo = uniqueChats.find(c => c.orderId === selectedOrderId);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Customer Support Terminal</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">LIVE MESSAGE CENTER</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[700px]">
          {/* চ্যাট লিস্ট (বামপাশে) */}
          <Card className="col-span-4 bg-card border-white/5 rounded-none overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
               <div className="relative">
                 <Input placeholder="SEARCH CUSTOMERS..." className="bg-black border-white/10 rounded-none h-12 pl-10 text-[10px] font-black uppercase placeholder:text-white/20" />
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#01a3a4]" />
               </div>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-8 w-8 text-[#01a3a4] animate-spin" />
                  <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">ACCESSING ENCRYPTED DATA...</p>
                </div>
              ) : uniqueChats.length === 0 ? (
                <div className="text-center py-20 px-10">
                  <MessageSquare className="h-10 w-10 text-white/5 mx-auto mb-4" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">NO INCOMING MESSAGES DETECTED IN THE ARCHIVE.</p>
                </div>
              ) : uniqueChats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedOrderId(chat.orderId)}
                  className={`p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] group ${selectedOrderId === chat.orderId ? 'bg-[#01a3a4]/10 border-l-4 border-l-[#01a3a4]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{chat.customerName || 'GUEST USER'}</h3>
                    <span className="text-[8px] font-mono text-white/40">{new Date(chat.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[11px] text-white/60 line-clamp-1 italic uppercase tracking-tight">"{chat.text}"</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-white/5 border-white/10 text-[7px] font-black h-4 px-1 rounded-none uppercase text-[#01a3a4]">SESSION: {chat.orderId.slice(0, 10)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* চ্যাট উইন্ডো (ডানপাশে) */}
          <Card className="col-span-8 bg-card border-white/5 rounded-none flex flex-col overflow-hidden shadow-2xl relative">
            {selectedOrderId ? (
              <>
                {/* হেডার */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#01a3a4]/10 flex items-center justify-center border border-[#01a3a4]/20">
                      <User className="h-6 w-6 text-[#01a3a4]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tighter">{selectedChatInfo?.customerName || 'GUEST CUSTOMER'}</h2>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                          <div className="h-2 w-2 bg-green-500 rounded-full" /> LIVE CONNECTION
                        </span>
                        <span className="text-[9px] font-mono text-white/30 uppercase">ID: #{selectedOrderId}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-none border-white/10 text-white font-black text-[9px] uppercase hover:bg-white/5">
                    VIEW ORDER DETAILS
                  </Button>
                </div>

                {/* চ্যাট বডি */}
                <div className="flex-grow overflow-y-auto p-10 space-y-8 bg-black/40 custom-scrollbar">
                  {activeChat?.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                      <div className={`max-w-[75%] space-y-2`}>
                        <div className={`p-5 text-[12px] font-bold leading-relaxed shadow-2xl tracking-wide ${
                          msg.sender === 'ADMIN' 
                            ? 'bg-[#01a3a4] text-white rounded-l-2xl rounded-tr-2xl' 
                            : 'bg-white text-black rounded-r-2xl rounded-tl-2xl'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-2 px-2 ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="h-2.5 w-2.5 text-white/20" />
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                            {msg.sender === 'ADMIN' ? 'SENT' : 'RECEIVED'} • {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* চ্যাট ইনপুট */}
                <form onSubmit={handleSendReply} className="p-6 bg-black border-t border-white/5 flex gap-4">
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="TYPE YOUR RESPONSE HERE..." 
                    className="flex-grow bg-white/5 border-white/10 h-16 rounded-none text-[12px] font-black uppercase px-6 tracking-widest focus-visible:ring-[#01a3a4] transition-all"
                  />
                  <Button type="submit" className="h-16 w-32 bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black rounded-none shadow-2xl transition-all uppercase tracking-widest text-[11px]">
                    <Send className="mr-2 h-4 w-4" /> SEND
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center space-y-8 p-20 text-center">
                <div className="w-32 h-32 bg-[#01a3a4]/5 flex items-center justify-center border border-[#01a3a4]/10 rounded-full animate-pulse">
                  <MessageSquare className="h-12 w-12 text-[#01a3a4]/40" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">SELECT A COMMUNICATION</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] max-w-sm mx-auto leading-relaxed">
                    PICK A CUSTOMER FROM THE SIDEBAR TO START ENGAGING IN REAL-TIME BUSINESS COMMUNICATION.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
