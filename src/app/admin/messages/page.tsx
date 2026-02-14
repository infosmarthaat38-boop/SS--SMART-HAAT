"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MainHeader } from '@/components/MainHeader';
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
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function AdminMessages() {
  const db = useFirestore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  const allMessagesQuery = useMemoFirebase(() => collection(db!, 'messages'), [db]);
  const { data: rawAllMessages, isLoading } = useCollection(allMessagesQuery);

  const uniqueChats = React.useMemo(() => {
    if (!rawAllMessages) return [];
    const seen = new Map();
    
    rawAllMessages.forEach(msg => {
      const existing = seen.get(msg.orderId);
      if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
        seen.set(msg.orderId, msg);
      }
    });

    return Array.from(seen.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rawAllMessages]);

  const chatQuery = useMemoFirebase(() => {
    if (!selectedOrderId) return null;
    return query(
      collection(db!, 'messages'),
      where('orderId', '==', selectedOrderId)
    );
  }, [db, selectedOrderId]);

  const { data: rawActiveChat } = useCollection(chatQuery);

  const activeChat = React.useMemo(() => {
    if (!rawActiveChat) return [];
    return [...rawActiveChat].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [rawActiveChat]);

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [activeChat]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedOrderId) return;

    addDocumentNonBlocking(collection(db!, 'messages'), {
      orderId: selectedOrderId,
      text: replyText.toUpperCase(),
      sender: 'ADMIN',
      createdAt: new Date().toISOString()
    });

    setReplyText('');
  };

  const selectedChatInfo = uniqueChats.find(c => c.orderId === selectedOrderId);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      
      <main className="flex-grow container mx-auto px-2 md:px-12 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-10 w-10 border border-white/10">
            <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-[#01a3a4] uppercase tracking-widest">Support Terminal</p>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">LIVE MESSAGE CENTER</h1>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[600px]">
          <Card className="col-span-4 bg-card border-white/5 rounded-none overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
               <div className="relative">
                 <Input placeholder="SEARCH..." className="bg-black border-white/10 rounded-none h-10 pl-9 text-[9px] font-black uppercase placeholder:text-white/20" />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#01a3a4]" />
               </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
                  <p className="text-[7px] font-black text-[#01a3a4] uppercase tracking-widest">LOADING...</p>
                </div>
              ) : uniqueChats.length === 0 ? (
                <div className="text-center py-10 px-6">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">NO MESSAGES</p>
                </div>
              ) : uniqueChats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedOrderId(chat.orderId)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.03] ${selectedOrderId === chat.orderId ? 'bg-[#01a3a4]/10 border-l-4 border-l-[#01a3a4]' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[11px] font-black text-white uppercase tracking-tight">{chat.customerName || 'GUEST'}</h3>
                    <span className="text-[7px] font-mono text-white/40">{new Date(chat.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[10px] text-white/60 line-clamp-1 italic uppercase">"{chat.text}"</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-8 bg-card border-white/5 rounded-none flex flex-col overflow-hidden shadow-2xl">
            {selectedOrderId ? (
              <>
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#01a3a4]/10 flex items-center justify-center border border-[#01a3a4]/20">
                      <User className="h-5 w-5 text-[#01a3a4]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white uppercase tracking-tighter">{selectedChatInfo?.customerName || 'GUEST'}</h2>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">LIVE</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase">#{selectedOrderId.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  ref={chatScrollContainerRef}
                  className="flex-grow overflow-y-auto p-6 space-y-4 bg-black/40"
                >
                  {activeChat?.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                      <div className="max-w-[70%] space-y-1">
                        <div className={`px-4 py-2.5 text-[11px] font-bold leading-snug tracking-wide ${
                          msg.sender === 'ADMIN' 
                            ? 'bg-[#01a3a4] text-white rounded-l-xl rounded-tr-xl' 
                            : 'bg-white text-black rounded-r-xl rounded-tl-xl'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1.5 px-1 ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="h-2 w-2 text-white/20" />
                          <span className="text-[7px] font-black text-white/20 uppercase">
                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendReply} className="p-4 bg-black border-t border-white/5 flex gap-3">
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="RESPONSE..." 
                    className="flex-grow bg-white/5 border-white/10 h-11 rounded-none text-[11px] font-black uppercase px-4 tracking-widest"
                  />
                  <Button type="submit" className="h-11 w-24 bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black rounded-none transition-all uppercase tracking-widest text-[9px] shrink-0">
                    <Send className="mr-1.5 h-3 w-3" /> SEND
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-10 text-center">
                <MessageSquare className="h-10 w-10 text-[#01a3a4]/20" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">SELECT A CHAT</h3>
                <p className="text-[8px] text-white/30 uppercase font-black tracking-[0.3em] max-w-xs leading-relaxed">
                  PICK A CUSTOMER TO START BUSINESS COMMUNICATION.
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
