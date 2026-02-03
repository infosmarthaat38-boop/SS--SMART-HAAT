
"use client";

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Upload, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCategories() {
  const db = useFirestore();
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  const { data: categories, isLoading } = useCollection(categoriesRef);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("IMAGE TOO LARGE.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imagePreview) return;
    addDocumentNonBlocking(categoriesRef, {
      name: name.toUpperCase(),
      imageUrl: imagePreview
    });
    setName('');
    setImagePreview(null);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleFinalDelete = () => {
    if (deleteId) {
      deleteDocumentNonBlocking(doc(db, 'categories', deleteId));
      setDeleteId(null);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2"><Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">MANAGE CATEGORIES</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1 h-fit">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">ADD NEW CATEGORY</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Name</label>
                  <Input placeholder="E.G. FASHION" value={name} onChange={(e) => setName(e.target.value)} className="bg-black/50 border-white/10 rounded-none text-xs uppercase" />
                </div>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer hover:border-orange-600 bg-black/30 min-h-[200px] flex flex-col items-center justify-center relative">
                  {imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : <Upload className="h-6 w-6 text-orange-600" />}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <Button type="submit" disabled={!name || !imagePreview} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-12">SAVE CATEGORY</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 rounded-none lg:col-span-2">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">EXISTING CATEGORIES</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categories?.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 group hover:border-orange-600/30 transition-all">
                    <div className="relative w-20 h-20 shrink-0 bg-black overflow-hidden border border-white/10">
                      <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover opacity-80 group-hover:opacity-100" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-[12px] font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                    </div>
                    <Button onClick={() => confirmDelete(cat.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-orange-600/30 rounded-none p-8 max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600/10 flex items-center justify-center border border-red-600/20"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">DELETE CATEGORY?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              THIS WILL PERMANENTLY REMOVE THIS CATEGORY. PRODUCTS UNDER THIS CATEGORY WILL NOT BE DELETED BUT WILL LOSE THEIR CATEGORY LINK.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-2 sm:gap-0">
            <AlertDialogCancel className="flex-1 rounded-none border-white/10 text-white font-black uppercase text-[10px] h-12 hover:bg-white/5">CANCEL</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-none h-12 shadow-xl shadow-red-600/10">CONFIRM DELETE</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}
