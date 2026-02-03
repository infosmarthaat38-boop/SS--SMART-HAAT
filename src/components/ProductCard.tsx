
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

// React.memo used to prevent unnecessary re-renders in large lists
export const ProductCard = memo(({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card border-white/5 hover:border-orange-600/30 transition-all duration-500 rounded-none flex flex-col h-full shadow-lg">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-white/5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        />
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-grow space-y-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-[10px] line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors h-8 text-white uppercase tracking-tight">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="pt-3 border-t border-white/5 space-y-3 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-orange-600 tracking-tighter">৳{product.price.toFixed(2)}</span>
              <span className="text-[10px] text-muted-foreground line-through font-bold">৳{product.originalPrice.toFixed(2)}</span>
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-orange-500 text-[10px] font-black uppercase tracking-tight mt-1">
                {product.discountPercentage}% OFF TODAY
              </span>
            )}
          </div>
          
          <Button className="w-full bg-orange-600 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] h-9 rounded-none uppercase px-2">
            <ShoppingCart className="mr-2 h-4 w-4" /> ORDER NOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';
