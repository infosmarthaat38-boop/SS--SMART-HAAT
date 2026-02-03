
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden bg-card border-white/5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-2xl flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-white/5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 bg-primary text-black text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
          PREMIUM
        </div>
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-orange-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase z-10">
            {product.discountPercentage}% OFF
          </div>
        )}
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-grow space-y-3">
        <div className="space-y-1">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-[11px] line-clamp-2 leading-snug group-hover:text-primary transition-colors h-8 text-foreground uppercase tracking-tight">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex text-primary">
              <Star className="h-2.5 w-2.5 fill-current" />
            </div>
            <span className="text-[8px] text-muted-foreground font-bold uppercase">(4.9 RATING)</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-white/5 space-y-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground line-through font-bold">৳{product.originalPrice.toFixed(2)}</span>
            <span className="font-black text-lg text-primary tracking-tighter">৳{product.price.toFixed(2)}</span>
          </div>
          
          <Button className="w-full bg-primary text-black hover:bg-white transition-all font-black text-[10px] py-6 rounded-xl uppercase shadow-lg shadow-primary/10 group-hover:shadow-primary/30">
            <ShoppingCart className="mr-2 h-4 w-4" /> ORDER NOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
