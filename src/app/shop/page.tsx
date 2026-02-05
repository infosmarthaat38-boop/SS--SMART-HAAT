
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2, Package } from 'lucide-react';

/**
 * ShopPage - Performance optimized with query limits for 10k+ products.
 */
export default function ShopPage() {
  const db = useFirestore();
  
  // Strict limit for instant mobile paint and fast JSON response.
  const productsRef = useMemoFirebase(() => query(
    collection(db, 'products'),
    orderBy('createdAt', 'desc'),
    limit(30)
  ), [db]);
  
  const { data: products, isLoading } = useCollection(productsRef);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="h-8 w-2 bg-orange-600" />
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">ALL PRODUCTS</h1>
          </div>
          {!isLoading && products && (
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">SHOWING RECENT RECORDS</p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black uppercase text-[#01a3a4] animate-pulse tracking-widest">ACCESSING ARCHIVE...</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-white/10 bg-white/[0.01]">
            <Package className="h-12 w-12 text-white/5 mx-auto mb-6" />
            <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">No products discovered in archive.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
