
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Package, Upload, X, Loader2, Edit2, Save, AlertTriangle, Ruler, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/image-compression';
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

interface SizeEntry {
  size: string;
  quantity: number;
}

export default function AdminProducts() {
  const db = useFirestore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [category, setCategory] = useState('');
  const [manualStockQuantity, setManualStockQuantity] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInFlashOffer, setShowInFlashOffer] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  const [showValidation, setShowValidation] = useState(false);
  const [sizeEntries, setSizeEntries] = useState<SizeEntry[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Performance Logic: Limit admin list to 20 for instant management feel.
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(20)), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  useEffect(() => {
    if (editingId) return;
    const p = parseFloat(price);
    const op = parseFloat(originalPrice);
    if (p && op && op > p) {
      const disc = ((op - p) / op) * 100;
      setDiscountPercentage(Math.round(disc).toString());
    } else {
      setDiscountPercentage('0');
    }
  }, [price, originalPrice, editingId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressedDataUrl = await compressImage(file);
        setImagePreview(compressedDataUrl);
      } catch (err) {
        toast({ variant: "destructive", title: "ERROR", description: "IMAGE PROCESSING FAILED." });
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !imagePreview) {
      setShowValidation(true);
      toast({ variant: "destructive", title: "MISSING FIELDS", description: "FILL ALL REQUIRED INFORMATION." });
      return;
    }

    const finalStock = sizeEntries.length > 0 
      ? sizeEntries.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
      : parseInt(manualStockQuantity) || 0;

    const productData = {
      name: name.toUpperCase(),
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      discountPercentage: parseInt(discountPercentage) || 0,
      category: category.toUpperCase(),
      sizeInventory: sizeEntries,
      stockQuantity: finalStock,
      imageUrl: imagePreview,
      showInSlider,
      showInFlashOffer,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, 'products', editingId), productData);
      toast({ title: "RECORD UPDATED" });
      setEditingId(null);
    } else {
      addDocumentNonBlocking(collection(db, 'products'), { ...productData, createdAt: new Date().toISOString() });
      toast({ title: "PRODUCT REGISTERED" });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setDescription(''); setPrice(''); setOriginalPrice('');
    setCategory(''); setManualStockQuantity(''); setSizeEntries([]); setImagePreview(null);
    setShowInSlider(false); setShowInFlashOffer(false); setShowValidation(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id); setName(product.name); setDescription(product.description || '');
    setPrice(product.price.toString()); setOriginalPrice(product.originalPrice?.toString() || product.price.toString());
    setCategory(product.category); setSizeEntries(product.sizeInventory || []);
    if (!product.sizeInventory?.length) setManualStockQuantity(product.stockQuantity?.toString() || '');
    else setManualStockQuantity('');
    setImagePreview(product.imageUrl); setShowInSlider(!!product.showInSlider); setShowInFlashOffer(!!product.showInFlashOffer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalDelete = () => {
    if (deleteId) {
      deleteDocumentNonBlocking(doc(db, 'products', deleteId));
      toast({ variant: "destructive", title: "RECORD REMOVED" });
      setDeleteId(null); setIsAlertOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <Button asChild variant="ghost" className="rounded-none border border-white/10 h-12 w-12"><Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link></Button>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Inventory Management</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">{editingId ? 'EDITING RECORD' : 'PRODUCT CONTROL'}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="bg-card border-white/5 rounded-none lg:col-span-4 h-fit shadow-2xl overflow-y-auto max-h-[85vh]">
            <CardHeader className="border-b border-white/5 p-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> {editingId ? 'UPDATE ITEM' : 'REGISTER ITEM'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Identity *</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="NAME" className="bg-black/50 border-white/10 rounded-none h-12 text-xs uppercase font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">MSRP (৳)</label>
                    <Input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="bg-black/50 border-white/10 rounded-none h-12 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Price (৳) *</label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-black/50 border-white/10 rounded-none h-12 text-xs text-orange-600 font-black" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Category *</label>
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger className="bg-black/50 border-white/10 rounded-none text-[10px] h-12 uppercase font-black"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent className="bg-card border-white/10 rounded-none">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name} className="uppercase text-[10px] font-black py-3">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Visualization *</label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-6 text-center cursor-pointer bg-black/30 min-h-[200px] relative flex items-center justify-center overflow-hidden">
                    {isProcessingImage ? <Loader2 className="h-8 w-8 text-orange-600 animate-spin" /> : 
                     imagePreview ? <Image src={imagePreview} alt="Preview" fill className="object-cover" /> : 
                     <Upload className="h-10 w-10 text-orange-600 opacity-50" />}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>
                <Button type="submit" disabled={isProcessingImage} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-14 shadow-2xl">
                  {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />} {editingId ? 'UPDATE' : 'SAVE'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/5 rounded-none lg:col-span-8 shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">INVENTORY ARCHIVE</CardTitle>
              <Badge className="bg-orange-600 text-white font-black text-[9px] rounded-none px-4 py-1">LATEST 20 RECORDS</Badge>
            </CardHeader>
            <CardContent className="p-6">
              {productsLoading ? <div className="py-40 text-center"><Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto" /></div> : (
                <div className="flex flex-col gap-2">
                  {products?.map((p) => (
                    <div key={p.id} className={`flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:border-white/20 transition-all ${editingId === p.id ? 'border-orange-600 bg-orange-600/5' : ''}`}>
                      <div className="relative w-16 h-16 shrink-0 bg-black border border-white/10 overflow-hidden">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover opacity-80" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[8px] font-black text-orange-600 tracking-widest uppercase">{p.category}</p>
                        <h3 className="text-[12px] font-black text-white uppercase truncate tracking-tighter">{p.name}</h3>
                        <p className="text-sm font-black text-white tracking-tighter">৳{p.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(p)} variant="outline" size="icon" className="h-10 w-10 border-white/10 text-white hover:bg-orange-600 rounded-none"><Edit2 className="h-4 w-4" /></Button>
                        <Button onClick={() => setIsAlertOpen(true)} variant="outline" size="icon" className="h-10 w-10 border-white/10 text-muted-foreground hover:bg-red-600 rounded-none"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-orange-600/30 rounded-none p-10 max-w-md">
          <AlertDialogHeader className="space-y-6">
            <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">DELETE RECORD?</AlertDialogTitle>
            <AlertDialogDescription className="text-[11px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">THIS ACTION IS PERMANENT.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-3">
            <AlertDialogCancel className="flex-1 rounded-none border-white/10 text-white font-black uppercase text-[10px] h-14">CANCEL</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-none h-14 shadow-2xl">CONFIRM</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}
