
"use client";

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Package, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminProducts() {
  const db = useFirestore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // References
  const productsRef = useMemoFirebase(() => collection(db, 'products'), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("IMAGE IS TOO LARGE. MAX 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imagePreview || !category) return;

    addDocumentNonBlocking(productsRef, {
      name: name.toUpperCase(),
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(price) * 1.5, // Automated mockup original price
      discountPercentage: 33,
      category: category.toUpperCase(),
      imageUrl: imagePreview,
      createdAt: new Date().toISOString()
    });

    // Reset
    setName('');
    setDescription('');
    setPrice('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("DELETE THIS PRODUCT?")) {
      deleteDocumentNonBlocking(doc(db, 'products', id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2">
            <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">MANAGE PRODUCTS</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">ADD NEW PRODUCT</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Product Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="PRODUCT NAME" className="bg-black/50 border-white/10 rounded-none text-xs uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIPTION" className="bg-black/50 border-white/10 rounded-none text-xs min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Price (৳)</label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="bg-black/50 border-white/10 rounded-none text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Category</label>
                    <Select onValueChange={setCategory}>
                      <SelectTrigger className="bg-black/50 border-white/10 rounded-none text-[10px] h-10 uppercase">
                        <SelectValue placeholder="SELECT" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 rounded-none">
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name} className="uppercase text-[10px] focus:bg-orange-600 focus:text-white">{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Product Image</label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer hover:border-orange-600 transition-all bg-black/30 flex flex-col items-center justify-center min-h-[200px] relative group">
                    {imagePreview ? (
                      <div className="relative w-full aspect-square">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-orange-600 p-1.5 text-white z-10"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-6 w-6 text-orange-600 mx-auto" />
                        <p className="text-[10px] font-black text-white uppercase">UPLOAD IMAGE</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <Button type="submit" disabled={!name || !price || !imagePreview || !category} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-12">
                  <Plus className="mr-2 h-4 w-4" /> SAVE PRODUCT
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* LIST */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">INVENTORY LIST</CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-8 w-8 text-orange-600 animate-spin" /></div>
              ) : !products || products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10"><Package className="h-10 w-10 text-white/10 mx-auto mb-4" /><p className="text-[10px] font-black uppercase text-muted-foreground">NO PRODUCTS FOUND</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="flex gap-4 p-4 bg-white/5 border border-white/5 group relative">
                      <div className="relative w-24 h-24 shrink-0 border border-white/10 overflow-hidden">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-[8px] font-black text-orange-600 tracking-widest">{p.category}</p>
                          <h3 className="text-sm font-black text-white uppercase truncate">{p.name}</h3>
                          <p className="text-[12px] font-black text-white mt-1">৳{p.price}</p>
                        </div>
                        <Button onClick={() => handleDeleteProduct(p.id)} variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 self-end"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
