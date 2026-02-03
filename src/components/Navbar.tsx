
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
    <nav className="sticky top-0 z-50 w-full bg-orange-600 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="py-2 flex flex-col space-y-2">
          {/* TOP ROW: LOGO + LINKS */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-headline font-black text-white leading-none uppercase tracking-tighter">
                  SS SMART HAAT
                </h1>
                <span className="text-[6px] text-white/90 font-bold uppercase tracking-[0.2em] mt-0.5">PREMIUM STORE</span>
              </div>
            </Link>

            <ul className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white">
              <li><Link href="/" className="hover:opacity-70 transition-opacity">HOME</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">SHOP</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">CATEGORY</Link></li>
              <li><Link href="/admin" className="hover:opacity-70 transition-opacity">ADMIN PANEL</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">SIGN UP</Link></li>
            </ul>
          </div>

          {/* BOTTOM ROW: SEARCH BAR & CART */}
          <div className="flex items-center gap-3">
            <div className="flex-grow relative group">
              <Input 
                type="search" 
                placeholder="SEARCH PREMIUM PRODUCTS..." 
                className="w-full bg-black/10 border-white/20 h-8 pl-10 pr-24 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-[10px] text-white uppercase placeholder:text-white/70 font-bold"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white" />
              <Button className="absolute right-0 top-0 h-8 rounded-none px-4 bg-black text-white hover:bg-black/90 font-black text-[9px] uppercase border-l border-white/10">
                SEARCH
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-none hover:bg-black/10 text-white group">
                  <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-black text-white text-[7px] font-black rounded-none flex items-center justify-center border border-orange-600">
                    0
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black border-white/10 text-white p-1 rounded-none shadow-2xl">
                <DropdownMenuItem className="h-8 focus:bg-orange-600 focus:text-white cursor-pointer rounded-none font-black text-[9px] uppercase tracking-widest px-3">
                  <Link href="#" className="w-full">MY SHOPPING CART</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
