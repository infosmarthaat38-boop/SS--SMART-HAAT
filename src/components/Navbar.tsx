
"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-orange-600 shadow-lg border-b border-black/10">
      <div className="container mx-auto px-4">
        {/* TOP ROW: BRANDING AND MAIN LINKS */}
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-headline font-black text-white leading-none uppercase tracking-tighter">
                SS SMART HAAT
              </h1>
              <span className="text-[7px] text-white/90 font-bold uppercase tracking-[0.3em] mt-0.5">PREMIUM STORE</span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white">
            <li><Link href="/" className="hover:text-black transition-colors">HOME</Link></li>
            <li><Link href="#" className="hover:text-black transition-colors">SHOP</Link></li>
            <li><Link href="#" className="hover:text-black transition-colors">CATEGORY</Link></li>
            <li><Link href="#" className="hover:text-black transition-colors">SIGN UP</Link></li>
          </ul>
        </div>

        {/* BOTTOM ROW: SEARCH BAR & CART */}
        <div className="flex items-center justify-between gap-4 pb-2">
          <div className="flex-grow max-w-2xl relative group">
            <Input 
              type="search" 
              placeholder="SEARCH PREMIUM PRODUCTS..." 
              className="w-full bg-black/10 border-white/20 h-8 pl-10 pr-24 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-[10px] text-white uppercase placeholder:text-white/70 font-bold"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
            <Button className="absolute right-0 top-0 h-8 rounded-none px-4 bg-black text-white hover:bg-black/90 font-black text-[10px] uppercase border-l border-white/10">
              SEARCH
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-none hover:bg-black/10 text-white group">
                  <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-black rounded-none flex items-center justify-center border border-orange-600">
                    0
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 text-white p-2 rounded-none shadow-2xl">
                <DropdownMenuItem className="h-10 focus:bg-orange-600 focus:text-white cursor-pointer rounded-none font-black text-[10px] uppercase tracking-widest px-4">
                  <Link href="#" className="w-full text-center">SHOPPING CART</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
