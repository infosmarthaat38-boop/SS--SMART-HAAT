
"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageIcon } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from 'next/image';

/**
 * CategoriesPage - Fetches and displays categories directly from Firestore.
 * Updated to make items smaller and more compact.
 */
export default function CategoriesPage() {
  const db = useFirestore();
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-8 w-2 bg-orange-600" />
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 bg-white/[0.02]">
            <ImageIcon className="h-10 w-10 text-white/10 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No categories found. Add some from Admin Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link 
                href={`/shop?category=${category.name}`} 
                key={category.id}
                className="group relative aspect-square border border-white/10 overflow-hidden hover:border-orange-600/50 transition-all bg-card"
              >
                {category.imageUrl && (
                  <div className="absolute inset-0 w-full h-full">
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-all duration-700 scale-100 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                  </div>
                )}
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-2 p-2">
                  <h2 className="text-[14px] md:text-[18px] font-black uppercase tracking-wider text-white drop-shadow-2xl">
                    {category.name}
                  </h2>
                  <div className="h-0.5 w-0 bg-orange-600 mx-auto group-hover:w-12 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
