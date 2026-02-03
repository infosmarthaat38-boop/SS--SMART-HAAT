
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
        <div className="py-4 flex flex-col space-y-4">
          {/* TOP ROW: LOGO + LINKS */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-md font-headline font-black text-white leading-none uppercase tracking-tighter">
                  SS SMART HAAT
                </h1>
                <span className="text-[7px] text-white/90 font-bold uppercase tracking-[0.3em] mt-0.5">PREMIUM STORE</span>
              </div>
            </Link>

            <ul className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white">
              <li><Link href="/" className="hover:opacity-70 transition-opacity">HOME</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">SHOP</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">CATEGORY</Link></li>
              <li><Link href="/admin" className="hover:opacity-70 transition-opacity">ADMIN PANEL</Link></li>
              <li><Link href="#" className="hover:opacity-70 transition-opacity">SIGN UP</Link></li>
            </ul>
          </div>

          {/* BOTTOM ROW: SEARCH BAR & CART */}
          <div className="flex items-center gap-4">
            <div className="flex-grow relative group">
              <Input 
                type="search" 
                placeholder="SEARCH PREMIUM PRODUCTS..." 
                className="w-full bg-black/10 border-white/20 h-10 pl-10 pr-28 focus-visible:ring-black focus-visible:bg-black/20 transition-all rounded-none text-xs text-white uppercase placeholder:text-white/70 font-bold"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white" />
              <Button className="absolute right-0 top-0 h-10 rounded-none px-6 bg-black text-white hover:bg-black/90 font-black text-[10px] uppercase border-l border-white/10">
                SEARCH
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-none hover:bg-black/10 text-white group">
                  <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[8px] font-black rounded-none flex items-center justify-center border border-orange-600">
                    0
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white p-2 rounded-none shadow-2xl">
                <DropdownMenuItem className="h-10 focus:bg-orange-600 focus:text-white cursor-pointer rounded-none font-black text-[10px] uppercase tracking-widest px-4">
                  <Link href="#" className="w-full">MY SHOPPING CART</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="h-10 focus:bg-orange-600 focus:text-white cursor-pointer rounded-none font-black text-[10px] uppercase tracking-widest px-4 mt-1">
                  <Link href="/admin" className="w-full text-xs">ADMIN DASHBOARD</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
