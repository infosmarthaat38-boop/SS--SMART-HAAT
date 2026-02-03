
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-none bg-transparent rounded-none transition-all duration-500">
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-8 gap-4">
          <Link href={`/products/${product.id}`} className="w-full">
            <Button variant="outline" className="w-full rounded-none border-white text-white hover:bg-white hover:text-background uppercase tracking-widest font-bold">
              View Details
            </Button>
          </Link>
          <Button className="w-full rounded-none bg-primary text-background hover:bg-primary/90 uppercase tracking-widest font-bold">
            <Plus className="h-4 w-4 mr-2" /> Add To Bag
          </Button>
        </div>
        
        {/* Luxury Badge */}
        <div className="absolute top-4 left-4">
          <div className="px-2 py-1 bg-primary text-[10px] font-bold text-background uppercase tracking-widest">
            Limited
          </div>
        </div>
      </div>
      
      <CardContent className="pt-6 px-0 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">{product.category}</p>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-headline text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">{product.name}</h3>
            </Link>
          </div>
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
