
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
    <Card className="group overflow-hidden bg-card border-white/5 hover:border-primary/30 transition-all duration-500 rounded-none flex flex-col h-full shadow-lg">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-white/5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-grow space-y-3">
        <div className="space-y-1.5">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-[11px] line-clamp-2 leading-snug group-hover:text-primary transition-colors h-8 text-white uppercase tracking-tight">
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
        
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-primary tracking-tighter">৳{product.price.toFixed(2)}</span>
              <span className="text-[9px] text-muted-foreground line-through font-bold">৳{product.originalPrice.toFixed(2)}</span>
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-orange-500 text-[9px] font-black uppercase tracking-tight mt-0.5">
                {product.discountPercentage}% OFF TODAY
              </span>
            )}
          </div>
          
          <Button className="w-full bg-primary text-black hover:bg-white transition-all font-black text-[9px] h-8 rounded-none uppercase shadow-lg shadow-primary/10 px-2 mt-auto">
            <ShoppingCart className="mr-1.5 h-3 w-3" /> ORDER NOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
