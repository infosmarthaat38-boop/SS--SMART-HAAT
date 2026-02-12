
"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderModal } from '@/components/OrderModal';

interface ProductCardProps {
  product: any;
  index?: number;
}

export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = (product.stockQuantity || 0) <= 0;
  // Increase speed by prioritizing images for top items
  const isPriority = index < 10;

  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;

  return (
    <>
      <Card className="group bg-black border-none rounded-none flex flex-col h-full overflow-hidden gpu-accelerated">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-black block flex items-center justify-center">
          <Image
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            priority={isPriority}
            className="object-fill transition-transform duration-700 group-hover:scale-110"
            loading={isPriority ? "eager" : "lazy"}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <span className="text-white text-[9px] font-black border-2 border-white/30 px-3 py-1.5 uppercase tracking-widest bg-black/40 backdrop-blur-sm">SOLD OUT</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-4 md:p-5 flex flex-col flex-grow bg-black space-y-4">
          <h3 className="font-black text-[12px] md:text-[14px] text-white uppercase truncate font-headline tracking-tight">{product.name || 'Premium Item'}</h3>
          
          <div className="space-y-1 min-h-[52px] flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline text-[#01a3a4]">
                <span className="text-[12px] font-normal mr-1 translate-y-[-4px] text-white/50">৳</span>
                <span className="font-black text-[20px] md:text-[24px] tracking-tighter leading-none">
                  {(price || 0).toLocaleString()}
                </span>
              </div>
              {originalPrice > price && (
                <span className="text-[9px] md:text-[10px] font-black text-[#01a3a4] border border-[#01a3a4] px-2 py-0.5 shrink-0">
                  -{Math.round(((originalPrice - price) / (originalPrice || 1)) * 100)}%
                </span>
              )}
            </div>
            {originalPrice > price && (
              <p className="text-[10px] md:text-[12px] text-white/40 line-through font-bold">
                ৳{(originalPrice || 0).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 py-0.5">
            <div className={`h-2 w-2 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-600' : 'bg-green-600'}`} />
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          </div>

          <Button 
            disabled={isOutOfStock}
            onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
            className={`w-full mt-auto ${isOutOfStock ? 'bg-white/5 opacity-50' : 'bg-[#01a3a4] hover:bg-white hover:text-black'} text-white font-black text-[11px] md:text-[12px] h-10 md:h-12 rounded-none uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl border-none`}
          >
            <ShoppingBag className="h-4 w-4" /> অর্ডার করুন
          </Button>
        </CardContent>
      </Card>
      <OrderModal product={product} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
