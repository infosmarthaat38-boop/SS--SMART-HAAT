
"use client";

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { products } from '@/lib/products';
import { Badge } from '@/components/ui/badge';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-black text-white uppercase">PRODUCT NOT FOUND</h1>
            <Button className="rounded-none bg-orange-600 uppercase" onClick={() => router.push('/')}>RETURN TO SHOP</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-8 rounded-none uppercase text-white hover:bg-white/5" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO COLLECTION
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery - Optimized */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-none overflow-hidden bg-card border border-white/5">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Info Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="rounded-none uppercase tracking-widest text-[10px] bg-orange-600/10 text-orange-600 border-none">{product.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-black font-headline text-white leading-tight uppercase">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-black text-orange-600 uppercase">৳{product.price.toFixed(2)}</p>
                  <p className="text-lg text-muted-foreground line-through font-bold">৳{product.originalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none text-muted-foreground uppercase leading-relaxed">
                <p className="text-sm font-medium">{product.description}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="flex-grow h-12 rounded-none text-sm font-black bg-orange-600 hover:bg-orange-700 uppercase">
                  <ShoppingCart className="mr-2 h-5 w-5" /> ORDER NOW
                </Button>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-12 w-12 rounded-none border-white/10 text-white hover:bg-white/5">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-12 w-12 rounded-none border-white/10 text-white hover:bg-white/5">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>FAST DELIVERY</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>AUTHENTIC PRODUCT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
