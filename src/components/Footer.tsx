import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-xl font-bold font-headline text-primary tracking-tight uppercase">SS SMART HAAT</h3>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed uppercase">
              YOUR CURATED DESTINATION FOR SMART FASHION AND MODERN MARKETPLACE ESSENTIALS. REDEFINING ELEGANCE THROUGH SIMPLICITY AND LUXURY.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.2em] text-primary">SHOPPING</h4>
            <ul className="space-y-4 text-[10px] text-muted-foreground font-bold uppercase">
              <li><Link href="#" className="hover:text-foreground transition-colors">CLOTHING STORE</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">TRENDING SHOES</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">ACCESSORIES</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">SALE ITEMS</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.2em] text-primary">COMPANY</h4>
            <ul className="space-y-4 text-[10px] text-muted-foreground font-bold uppercase">
              <li><Link href="#" className="hover:text-foreground transition-colors">OUR STORY</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">CAREERS</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">AFFILIATE PROGRAM</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">SUSTAINABILITY</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.2em] text-primary">CUSTOMER CARE</h4>
            <ul className="space-y-4 text-[10px] text-muted-foreground font-bold uppercase">
              <li><Link href="#" className="hover:text-foreground transition-colors">HELP CENTER</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">TRACK ORDER</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">RETURNS & EXCHANGES</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">CONTACT US</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="h-px bg-white/5 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
          <p>© 2024 SS SMART HAAT. ELEVATING DHAKA'S LIFESTYLE.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="hover:text-primary transition-colors">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
