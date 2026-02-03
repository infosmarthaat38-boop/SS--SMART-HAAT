"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        {/* Row 1: Top Navigation Links (More compact) */}
        <div className="h-8 flex items-center justify-center border-b border-primary/5">
          <ul className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-all duration-300">Home</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-all duration-300">Shop</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-all duration-300">Category</Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-primary transition-all duration-300">Admin Panel</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-all duration-300">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Row 2: Logo, Search, and Icons (Smaller and aligned) */}
        <div className="h-14 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-headline font-bold text-primary leading-none uppercase tracking-tight">
                SS SMART HAAT
              </h1>
              <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-[0.15em] mt-0.5">Premium Store</span>
            </div>
          </Link>

          <div className="flex-grow max-w-lg relative group">
            <Input 
              type="search" 
              placeholder="Search in Smart Haat..." 
              className="w-full bg-secondary/50 border-none h-9 pl-10 focus-visible:ring-primary focus-visible:bg-secondary transition-all rounded-full text-xs"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Button className="absolute right-0 top-0 h-9 rounded-r-full px-6 bg-primary text-background hover:bg-primary/90 font-bold text-xs">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-primary/10">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-background text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
