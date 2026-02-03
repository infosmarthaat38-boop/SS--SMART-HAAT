"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between gap-12">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
              <ShoppingBag className="h-6 w-6 text-black" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-md font-headline font-bold text-primary leading-none uppercase tracking-tight">
                SS SMART HAAT
              </h1>
              <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5">PREMIUM STORE</span>
            </div>
          </Link>

          {/* SEARCH BAR & LINKS */}
          <div className="flex-grow flex items-center gap-8">
            <div className="flex-grow relative group">
              <Input 
                type="search" 
                placeholder="SEARCH PREMIUM PRODUCTS..." 
                className="w-full bg-white/5 border-white/10 h-11 pl-11 pr-24 focus-visible:ring-primary focus-visible:bg-white/10 transition-all rounded-full text-xs text-white uppercase"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Button className="absolute right-0 top-0 h-11 rounded-r-full px-8 bg-primary text-black hover:bg-primary/90 font-bold text-[10px] uppercase">
                SEARCH
              </Button>
            </div>

            <ul className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
              <li><Link href="/" className="hover:text-primary transition-colors">HOME</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">SHOP</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">CATEGORY</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">ADMIN PANEL</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">SIGN UP</Link></li>
            </ul>
          </div>

          {/* USER ICONS */}
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/5">
              <User className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-white/5">
              <ShoppingBag className="h-5 w-5 text-muted-foreground hover:text-primary" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-black text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-black">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
