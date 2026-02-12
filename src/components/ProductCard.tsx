
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
      <Card className="group bg-black border border-white/[0.03] rounded-none flex flex-col h-full overflow-hidden gpu-accelerated transition-all duration-300 hover:border-[#01a3a4]/40 hover:shadow-[0_0_20px_rgba(1,163,164,0.1)]">
        <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-black block flex items-center justify-center">
          <Image
            src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            priority={isPriority}
            className="object-fill transition-transform duration-[1.5s] group-hover:scale-110"
            loading={isPriority ? "eager" : "lazy"}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <span className="text-white text-[9px] font-black border border-white/30 px-3 py-1.5 uppercase tracking-widest bg-black/40 backdrop-blur-sm">SOLD OUT</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-3 md:p-4 flex flex-col flex-grow bg-black space-y-3">
          <div className="space-y-1">
            <h3 className="font-black text-[10px] md:text-[12px] text-white/90 uppercase truncate tracking-wide">{product.name || 'Premium Item'}</h3>
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-600' : 'bg-[#01a3a4]'}`} />
              <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-[#01a3a4]'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
              </span>
            </div>
          </div>
          
          <div className="space-y-1 mt-auto">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline text-white">
                <span className="text-[10px] font-normal mr-0.5 text-white/40">৳</span>
                <span className="font-black text-[16px] md:text-[18px] tracking-tighter leading-none">
                  {(price || 0).toLocaleString()}
                </span>
              </div>
              {originalPrice > price && (
                <span className="text-[8px] font-black text-[#01a3a4] border border-[#01a3a4]/30 px-1.5 py-0.5 shrink-0">
                  -{Math.round(((originalPrice - price) / (originalPrice || 1)) * 100)}%
                </span>
              )}
            </div>
            {originalPrice > price && (
              <p className="text-[9px] md:text-[10px] text-white/20 line-through font-bold">
                ৳{(originalPrice || 0).toLocaleString()}
              </p>
            )}
          </div>

          <Button 
            disabled={isOutOfStock}
            onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
            className={`w-full mt-2 ${isOutOfStock ? 'bg-white/5 text-white/20 border border-white/5' : 'bg-[#01a3a4] hover:bg-white hover:text-black'} text-white font-black text-[10px] h-9 rounded-none uppercase flex items-center justify-center gap-2 transition-all active:scale-95 border-none shadow-lg`}
          >
            <ShoppingBag className="h-3.5 w-3.5" /> অর্ডার করুন
          </Button>
        </CardContent>
      </Card>
      <OrderModal product={product} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
