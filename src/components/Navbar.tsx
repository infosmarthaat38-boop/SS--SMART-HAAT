"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navItems = [
    { name: 'Collection', path: '#shop' },
    { name: 'Bespoke', path: '#' },
    { name: 'Heritage', path: '#' },
    { name: 'Private Room', path: '#' },
  ];

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-white/10 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Diamond className="h-5 w-5 text-primary" />
            <span className="text-xl font-headline tracking-[0.3em] font-black gold-gradient">SS SMART HAAT</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 pr-4 border-r border-white/10 mr-2">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="relative group hover:text-primary">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full group-hover:animate-ping" />
          </Button>
          
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background border-l border-white/10 p-0">
                <div className="flex flex-col gap-8 p-12 pt-24">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.path}
                      className="text-xl font-headline tracking-widest hover:text-primary transition-colors uppercase"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="h-px bg-white/10 my-4" />
                  <Button className="w-full h-14 rounded-none bg-primary text-background font-black uppercase tracking-[0.3em]">Sign In</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}