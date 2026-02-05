
"use client";

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Upload, 
  Loader2, 
  Edit2, 
  Zap, 
  LayoutDashboard,
  CheckCircle2,
  Package,
  Ruler,
  DollarSign
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
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
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('100');
  const [sizes, setSizes] = useState('');
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInFlashOffer, setShowInFlashOffer] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50)), [db]);
  const { data: products } = useCollection(productsRef);
  const { data: categories } = useCollection(useMemoFirebase(() => collection(db, 'categories'), [db]));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 450, 450);
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
    if (!name || !price || !category || !imagePreview) {
      toast({ variant: "destructive", title: "MISSING DATA", description: "PLEASE FILL ALL REQUIRED FIELDS." });
      return;
    }

    const productData = {
      name: name.toUpperCase(),
      description: description || 'PREMIUM PRODUCT',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      category: category.toUpperCase(),
      stockQuantity: parseInt(stockQuantity),
      sizes: sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
      showInSlider,
      showInFlashOffer,
      imageUrl: imagePreview,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, 'products', editingId), productData);
      toast({ title: "PRODUCT UPDATED" });
      setEditingId(null);
    } else {
      addDocumentNonBlocking(collection(db, 'products'), { ...productData, createdAt: new Date().toISOString() });
      toast({ title: "PRODUCT SAVED" });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null); 
    setName(''); 
    setDescription('');
    setPrice(''); 
    setOriginalPrice('');
    setCategory(''); 
    setStockQuantity('100');
    setSizes('');
    setShowInSlider(false);
    setShowInFlashOffer(false);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="border border-white/10 h-12 w-12 rounded-none hover:bg-white/5">
            <Link href="/admin"><ArrowLeft className="h-6 w-6 text-[#01a3a4]" /></Link>
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">Inventory System</p>
            <h1 className="text-4xl font-black uppercase text-white tracking-tighter">PRODUCT CONTROL</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FORM COLUMN */}
          <Card className="lg:col-span-5 bg-card border-white/5 rounded-none shadow-2xl overflow-hidden h-fit">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase text-[#01a3a4] flex items-center gap-2 tracking-[0.2em]">
                {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {editingId ? 'EDIT EXISTING' : 'ADD NEW'} PRODUCT
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Basic Information</label>
                <Input placeholder="PRODUCT NAME" value={name} onChange={(e) => setName(e.target.value)} className="bg-black border-white/10 h-14 uppercase font-black text-xs" />
                <Textarea placeholder="DESCRIPTION" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-black border-white/10 min-h-[100px] text-xs font-bold uppercase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><DollarSign className="h-3 w-3" /> SALE PRICE (৳)</label>
                  <Input placeholder="E.G. 1200" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-black border-white/10 h-12 text-xs font-black text-[#01a3a4]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1">ORIGINAL PRICE (৳)</label>
                  <Input placeholder="E.G. 1800" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="bg-black border-white/10 h-12 text-xs font-bold text-white/40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><LayoutDashboard className="h-3 w-3" /> CATEGORY</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-black border-white/10 h-12 uppercase font-black text-[10px]"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {categories?.map((c) => <SelectItem key={c.id} value={c.name} className="uppercase font-black text-[10px]">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><Package className="h-3 w-3" /> STOCK QTY</label>
                  <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="bg-black border-white/10 h-12 text-xs font-black" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><Ruler className="h-3 w-3" /> AVAILABLE SIZES (COMMA SEPARATED)</label>
                <Input placeholder="E.G. M, L, XL, XXL" value={sizes} onChange={(e) => setSizes(e.target.value)} className="bg-black border-white/10 h-12 text-xs uppercase font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 border border-white/5">
                <div className="flex items-center space-x-3">
                  <Checkbox id="slider" checked={showInSlider} onCheckedChange={(val) => setShowInSlider(!!val)} className="border-[#01a3a4] data-[state=checked]:bg-[#01a3a4]" />
                  <label htmlFor="slider" className="text-[9px] font-black text-white uppercase cursor-pointer flex items-center gap-1"><LayoutDashboard className="h-3 w-3 text-[#01a3a4]" /> SHOW IN SLIDER</label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="flash" checked={showInFlashOffer} onCheckedChange={(val) => setShowInFlashOffer(!!val)} className="border-[#01a3a4] data-[state=checked]:bg-[#01a3a4]" />
                  <label htmlFor="flash" className="text-[9px] font-black text-white uppercase cursor-pointer flex items-center gap-1"><Zap className="h-3 w-3 text-orange-500" /> FLASH OFFER</label>
                </div>
              </div>

              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-6 text-center cursor-pointer bg-black/50 min-h-[180px] relative flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-[#01a3a4]/50">
                {isProcessingImage ? (
                  <Loader2 className="animate-spin text-[#01a3a4] h-8 w-8" />
                ) : imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-[#01a3a4] opacity-30 group-hover:opacity-100 mx-auto transition-all" />
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">UPLOAD PRODUCT VISUAL</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="flex gap-4">
                {editingId && <Button onClick={resetForm} variant="outline" className="flex-1 border-white/10 text-white font-black h-14 rounded-none uppercase text-[10px]">CANCEL</Button>}
                <Button onClick={handleSaveProduct} className="flex-[2] bg-[#01a3a4] hover:bg-white hover:text-black text-white font-black h-14 rounded-none uppercase tracking-widest text-[10px] shadow-2xl shadow-[#01a3a4]/10">
                  {editingId ? 'UPDATE RECORD' : 'SAVE TO DATABASE'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* LIST COLUMN */}
          <Card className="lg:col-span-7 bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase text-[#01a3a4] tracking-[0.2em]">EXISTING ARCHIVE ({products?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[800px] overflow-y-auto">
                {products?.map((p) => (
                  <div key={p.id} className="flex items-center gap-6 p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group">
                    <div className="relative h-16 w-16 bg-black border border-white/10 shrink-0 overflow-hidden">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[12px] font-black text-white uppercase truncate">{p.name}</h3>
                        {p.showInSlider && <LayoutDashboard className="h-3 w-3 text-[#01a3a4]" />}
                        {p.showInFlashOffer && <Zap className="h-3 w-3 text-orange-500" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#01a3a4] font-black text-[13px]">৳{p.price}</span>
                        {p.originalPrice > p.price && <span className="text-white/20 line-through text-[10px]">৳{p.originalPrice}</span>}
                        <span className="text-[8px] font-black text-white/40 uppercase bg-white/5 px-2 py-0.5">{p.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button onClick={() => { 
                        setEditingId(p.id); 
                        setName(p.name); 
                        setDescription(p.description || '');
                        setPrice(p.price.toString()); 
                        setOriginalPrice(p.originalPrice?.toString() || '');
                        setCategory(p.category); 
                        setStockQuantity(p.stockQuantity?.toString() || '100');
                        setSizes(p.sizes?.join(', ') || '');
                        setShowInSlider(!!p.showInSlider);
                        setShowInFlashOffer(!!p.showInFlashOffer);
                        setImagePreview(p.imageUrl); 
                      }} size="icon" variant="ghost" className="h-10 w-10 text-white/40 hover:text-[#01a3a4] hover:bg-[#01a3a4]/10 transition-all">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => deleteDocumentNonBlocking(doc(db, 'products', p.id))} size="icon" variant="ghost" className="h-10 w-10 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
