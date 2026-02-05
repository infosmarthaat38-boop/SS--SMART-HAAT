"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
  const db = useFirestore();
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(18)), [db]);
  const { data: products, isLoading } = useCollection(productsRef);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-10 py-10">
        <h1 className="text-2xl font-black text-white uppercase mb-8">ALL PRODUCTS</h1>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products?.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
