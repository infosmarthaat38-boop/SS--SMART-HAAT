"use client";

import React, { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { OrderModal } from '@/components/OrderModal';

interface ProductCardProps {
  product: any;
  index?: number;
}

// ROBUST MEMOIZATION: Prevent unnecessary re-renders for large lists
export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isOutOfStock = (product?.stockQuantity || 0) <= 0;
  
  const isPriority = index < 6;
  const price = product?.price || 0;
  const originalPrice = product?.originalPrice || price;

  return (
    <div className="product-card-container gpu-accelerated h-full">
      <Card className="group bg-white border border-white/5 rounded-none flex flex-col h-full overflow-hidden transition-all duration-500 hover:border-primary hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative">
        <Link href={`/products/${product?.id}`} className="relative aspect-square overflow-hidden bg-white block flex items-center justify-center">
          <Image
            src={product?.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={product?.name || 'Product'}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            priority={isPriority}
            className="object-contain transition-transform duration-[2s] group-hover:scale-110"
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 animate-in fade-in duration-500">
              <span className="text-white text-[10px] md:text-[12px] font-black border-2 border-white px-4 py-2 uppercase tracking-[0.2em] bg-red-600/20 backdrop-blur-md shadow-2xl animate-pulse">OUT OF STOCK</span>
            </div>
          )}
        </Link>
        
        <CardContent className="p-1.5 md:p-3 flex flex-col flex-grow bg-white space-y-1 md:space-y-1.5">
          <div className="space-y-0.5 md:space-y-1">
            <h3 className="font-black text-[9px] md:text-[11px] text-black uppercase truncate tracking-tighter transition-colors group-hover:text-primary leading-tight">
              {product?.name || 'Premium Item'}
            </h3>
            <div className="flex items-center gap-1">
              <div className={`h-1 w-1 rounded-full ${isOutOfStock ? 'bg-red-600' : 'bg-green-500'} animate-pulse`} />
              <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : `IN STOCK`}
              </span>
            </div>
          </div>
          
          <div className="mt-auto pt-0.5">
            <div className="flex flex-col justify-start mb-1 md:mb-1.5 relative">
              <div className="flex items-baseline gap-0.5 text-black">
                <span className="text-[9px] md:text-[10px] font-black text-primary">৳</span>
                <span className="font-black text-[15px] md:text-[20px] tracking-tighter leading-none">
                  {(price || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between h-[10px] md:h-[14px]">
                {originalPrice > price ? (
                  <>
                    <p className="text-[9px] md:text-[10px] text-black/60 line-through font-bold tracking-tight">
                      ৳{(originalPrice || 0).toLocaleString()}
                    </p>
                    <div className="bg-primary/10 border border-primary/20 px-0.5 py-0 ml-auto">
                      <span className="text-[7px] md:text-[8px] font-black text-primary tracking-tighter uppercase">
                        -{Math.round(((originalPrice - price) / (originalPrice || 1)) * 100)}%
                      </span>
                    </div>
                  </>
                ) : <div className="h-[10px] md:h-[14px]" />}
              </div>
            </div>

            <button 
              disabled={isOutOfStock}
              onClick={(e) => { e.preventDefault(); setIsOrderOpen(true); }}
              style={{ backgroundColor: !isOutOfStock ? 'var(--button-bg)' : undefined }}
              className={`w-full ${isOutOfStock ? 'bg-gray-100 border border-black/5 text-black/20' : 'hover:opacity-90'} text-white font-black text-[8px] md:text-[10px] h-7 md:h-8 rounded-none uppercase flex items-center justify-center gap-1 transition-all duration-500 active:scale-95 border-none shadow-lg tracking-[0.1em]`}
            >
              {isOutOfStock ? 'SOLD OUT' : 'অর্ডার করুন'}
            </button>
          </div>
        </CardContent>
      </Card>
      <OrderModal product={product} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </div>
  );
});

ProductCard.displayName = 'ProductCard';