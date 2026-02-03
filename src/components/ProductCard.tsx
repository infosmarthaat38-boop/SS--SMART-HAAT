
"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard Component - Optimized for high performance and premium unique aesthetic.
 * Features: Cinematic zoom, category badges, and high-contrast price tags.
 */
export const ProductCard = memo(({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card border-white/5 hover:border-orange-600/50 transition-all duration-500 rounded-none flex flex-col h-full shadow-2xl relative">
      {/* Category Badge - Appears on hover */}
      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[7px] font-black text-white uppercase tracking-widest leading-none">{product.category}</span>
      </div>

      {/* Image Container with Zoom and Gradient Overlay */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-white/5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
          loading="lazy"
          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        {/* Bottom vignette overlay for better text readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-grow space-y-4 relative bg-card">
        {/* Title Section */}
        <div className="space-y-1">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-black text-[11px] line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors h-9 text-white uppercase tracking-tighter">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {/* Pricing and CTA Area */}
        <div className="pt-3 border-t border-white/10 space-y-4 mt-auto">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="font-black text-base text-orange-600 tracking-tighter leading-none">
                ৳{product.price.toLocaleString()}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-muted-foreground line-through text-[9px] font-bold mt-1">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.discountPercentage > 0 && (
              <div className="bg-orange-600 px-1.5 py-0.5">
                <span className="text-[8px] font-black text-white uppercase leading-none">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>
          
          {/* Action Button - High contrast transition */}
          <Button className="w-full bg-orange-600 text-white hover:bg-white hover:text-black transition-all duration-300 font-black text-[10px] h-10 rounded-none uppercase px-2 flex items-center justify-center gap-2 group/btn border border-transparent hover:border-black active:scale-95">
            <ShoppingCart className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> 
            <span>ORDER NOW</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
