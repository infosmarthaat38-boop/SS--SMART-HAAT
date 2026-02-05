"use client";

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Upload, Loader2, Edit2, Save } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { compressImage } from '@/lib/image-compression';

export default function AdminProducts() {
  const db = useFirestore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(20)), [db]);
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(useMemoFirebase(() => collection(db, 'categories'), [db]));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file);
        setImagePreview(compressed);
      } catch (err) {
        toast({ variant: "destructive", title: "ERROR", description: "FAILED TO PROCESS IMAGE." });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !imagePreview) return;

    const productData = {
      name: name.toUpperCase(),
      price: parseFloat(price),
      category: category.toUpperCase(),
      imageUrl: imagePreview,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, 'products', editingId), productData);
      toast({ title: "UPDATED" });
      setEditingId(null);
    } else {
      addDocumentNonBlocking(collection(db, 'products'), { ...productData, createdAt: new Date().toISOString(), stockQuantity: 100 });
      toast({ title: "SAVED" });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setPrice(''); setCategory(''); setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-10 py-10">
        <div className="flex items-center gap-4 mb-10">
          <Button asChild variant="ghost" className="border border-white/10 h-10 w-10"><Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-3xl font-black uppercase text-white">INVENTORY CONTROL</h1>
        </div>
        <div className="grid grid-cols-12 gap-8">
          <Card className="col-span-4 bg-card border-white/5 rounded-none h-fit">
            <CardHeader className="border-b border-white/5"><CardTitle className="text-[10px] font-black uppercase text-[#01a3a4]">{editingId ? 'EDIT' : 'ADD'} PRODUCT</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-6">
              <Input placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} className="bg-black border-white/10 h-12 uppercase font-bold" />
              <Input placeholder="PRICE (৳)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-black border-white/10 h-12" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-black border-white/10 h-12 uppercase font-black"><SelectValue placeholder="CATEGORY" /></SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  {categories?.map((c) => <SelectItem key={c.id} value={c.name} className="uppercase font-black">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer bg-black min-h-[150px] relative flex items-center justify-center">
                {isProcessingImage ? <Loader2 className="animate-spin text-[#01a3a4]" /> : imagePreview ? <Image src={imagePreview} alt="P" fill className="object-cover" /> : <Upload className="h-8 w-8 text-[#01a3a4] opacity-50" />}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <Button onClick={handleSaveProduct} className="w-full bg-[#01a3a4] text-white font-black h-12 rounded-none">{editingId ? 'UPDATE' : 'SAVE'}</Button>
            </CardContent>
          </Card>
          <Card className="col-span-8 bg-card border-white/5 rounded-none">
            <CardHeader className="border-b border-white/5"><CardTitle className="text-[10px] font-black uppercase text-[#01a3a4]">EXISTING RECORDS</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-2">
              {products?.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5">
                  <div className="relative h-12 w-12 border border-white/10 overflow-hidden"><Image src={p.imageUrl} alt="P" fill className="object-cover" /></div>
                  <div className="flex-grow"><h3 className="text-xs font-black text-white uppercase truncate">{p.name}</h3><p className="text-[#01a3a4] font-black text-[10px]">৳{p.price}</p></div>
                  <div className="flex gap-2"><Button onClick={() => { setEditingId(p.id); setName(p.name); setPrice(p.price.toString()); setCategory(p.category); setImagePreview(p.imageUrl); }} size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-[#01a3a4]"><Edit2 className="h-4 w-4" /></Button><Button onClick={() => deleteDocumentNonBlocking(doc(db, 'products', p.id))} size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-red-600"><Trash2 className="h-4 w-4" /></Button></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
