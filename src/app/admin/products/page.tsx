
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Package, Upload, X, Loader2, Edit2, Save, CheckCircle2, AlertTriangle, Layers, Ruler } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInFlashOffer, setShowInFlashOffer] = useState(false);
  
  // Advanced Size Management
  const [sizeEntries, setSizeEntries] = useState<SizeEntry[]>([]);
  
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc')), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  // Auto-calculate total stock if sizes are present
  useEffect(() => {
    if (sizeEntries.length > 0) {
      const total = sizeEntries.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
      setStockQuantity(total.toString());
    }
  }, [sizeEntries]);

  // Auto-calculate discount
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

  const addSizeEntry = () => {
    setSizeEntries([...sizeEntries, { size: '', quantity: 0 }]);
  };

  const removeSizeEntry = (index: number) => {
    const newEntries = sizeEntries.filter((_, i) => i !== index);
    setSizeEntries(newEntries);
  };

  const updateSizeEntry = (index: number, field: keyof SizeEntry, value: string | number) => {
    const newEntries = [...sizeEntries];
    if (field === 'quantity') {
      newEntries[index][field] = parseInt(value.toString()) || 0;
    } else {
      newEntries[index][field] = value.toString().toUpperCase();
    }
    setSizeEntries(newEntries);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imagePreview || !category || !stockQuantity) {
      alert("PLEASE FILL ALL REQUIRED FIELDS.");
      return;
    }

    const productData = {
      name: name.toUpperCase(),
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      discountPercentage: parseInt(discountPercentage) || 0,
      category: category.toUpperCase(),
      // Store sizes as formatted strings for the frontend
      sizes: sizeEntries.length > 0 ? sizeEntries.map(s => s.size) : [],
      // Keep a structured version for inventory tracking if needed
      sizeInventory: sizeEntries,
      stockQuantity: parseInt(stockQuantity),
      imageUrl: imagePreview,
      showInSlider,
      showInFlashOffer,
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(db, 'products', editingId), productData);
      setEditingId(null);
    } else {
      addDocumentNonBlocking(collection(db, 'products'), {
        ...productData,
        createdAt: new Date().toISOString()
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setDiscountPercentage('0');
    setCategory('');
    setStockQuantity('');
    setSizeEntries([]);
    setImagePreview(null);
    setShowInSlider(false);
    setShowInFlashOffer(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice?.toString() || product.price.toString());
    setDiscountPercentage(product.discountPercentage?.toString() || '0');
    setCategory(product.category);
    setSizeEntries(product.sizeInventory || []);
    setStockQuantity(product.stockQuantity?.toString() || '');
    setImagePreview(product.imageUrl);
    setShowInSlider(!!product.showInSlider);
    setShowInFlashOffer(!!product.showInFlashOffer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const handleFinalDelete = () => {
    if (deleteId) {
      deleteDocumentNonBlocking(doc(db, 'products', deleteId));
      setDeleteId(null);
      setIsAlertOpen(false);
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
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            {editingId ? 'EDIT PRODUCT' : 'MANAGE PRODUCTS'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PRODUCT FORM */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1 h-fit sticky top-24 max-h-[85vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">
                {editingId ? 'UPDATE PRODUCT DETAILS' : 'ADD NEW PRODUCT'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Product Name *</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="E.G. PREMIUM JAMDANI SAREE" 
                    className="bg-black/50 border-white/10 rounded-none text-xs uppercase"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Description</label>
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="PRODUCT SPECIFICATIONS..." 
                    className="bg-black/50 border-white/10 rounded-none text-xs min-h-[80px]" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Original Price (৳)</label>
                    <Input 
                      type="number" 
                      value={originalPrice} 
                      onChange={(e) => setOriginalPrice(e.target.value)} 
                      placeholder="0.00" 
                      className="bg-black/50 border-white/10 rounded-none text-xs" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Selling Price (৳) *</label>
                    <Input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      placeholder="0.00" 
                      className="bg-black/50 border-white/10 rounded-none text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-orange-600 uppercase flex items-center gap-2">
                      <Ruler className="h-3 w-3" /> SIZE SPECIFIC INVENTORY
                    </label>
                    <Button type="button" onClick={addSizeEntry} variant="outline" className="h-8 rounded-none border-orange-600/30 text-orange-600 hover:bg-orange-600 hover:text-white text-[9px] font-black uppercase">
                      ADD SIZE
                    </Button>
                  </div>

                  {sizeEntries.map((entry, index) => (
                    <div key={index} className="flex gap-2 items-end group">
                      <div className="flex-1 space-y-1">
                         <label className="text-[8px] font-black text-muted-foreground uppercase">SIZE</label>
                         <Input 
                            value={entry.size} 
                            onChange={(e) => updateSizeEntry(index, 'size', e.target.value)}
                            placeholder="XL"
                            className="bg-black/50 border-white/10 rounded-none h-10 text-[10px]"
                         />
                      </div>
                      <div className="w-24 space-y-1">
                         <label className="text-[8px] font-black text-muted-foreground uppercase">QTY</label>
                         <Input 
                            type="number"
                            value={entry.quantity} 
                            onChange={(e) => updateSizeEntry(index, 'quantity', e.target.value)}
                            placeholder="1"
                            className="bg-black/50 border-white/10 rounded-none h-10 text-[10px]"
                         />
                      </div>
                      <Button type="button" onClick={() => removeSizeEntry(index)} variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {sizeEntries.length === 0 && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Total Stock Quantity *</label>
                      <Input 
                        type="number" 
                        value={stockQuantity} 
                        onChange={(e) => setStockQuantity(e.target.value)} 
                        placeholder="E.G. 100" 
                        className="bg-black/50 border-white/10 rounded-none text-xs"
                        required
                      />
                      <p className="text-[8px] text-muted-foreground italic uppercase">USE THIS IF PRODUCT HAS NO SPECIFIC SIZES.</p>
                    </div>
                  )}

                  {sizeEntries.length > 0 && (
                    <div className="p-3 bg-orange-600/5 border border-orange-600/10">
                      <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">
                        TOTAL CALCULATED STOCK: {stockQuantity} PCS
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Category *</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-black/50 border-white/10 rounded-none text-[10px] h-10 uppercase">
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 rounded-none">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name} className="uppercase text-[10px] focus:bg-orange-600 focus:text-white">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-2 border-t border-white/5 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="slider" 
                      checked={showInSlider} 
                      onCheckedChange={(checked) => setShowInSlider(!!checked)} 
                      className="border-white/20 data-[state=checked]:bg-orange-600" 
                    />
                    <Label htmlFor="slider" className="text-[10px] font-black uppercase text-white cursor-pointer">Show in Home Slider</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="flash" 
                      checked={showInFlashOffer} 
                      onCheckedChange={(checked) => setShowInFlashOffer(!!checked)} 
                      className="border-white/20 data-[state=checked]:bg-orange-600" 
                    />
                    <Label htmlFor="flash" className="text-[10px] font-black uppercase text-white cursor-pointer">Show in Flash Offer Section</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Product Image *</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer hover:border-orange-600 transition-all bg-black/30 flex flex-col items-center justify-center min-h-[150px] relative group"
                  >
                    {imagePreview ? (
                      <div className="relative w-full aspect-square">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-orange-600 p-1.5 text-white z-10"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-6 w-6 text-orange-600 mx-auto" />
                        <p className="text-[10px] font-black text-white uppercase">UPLOAD PHOTO</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingId && <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-white/10 rounded-none uppercase text-[10px] h-12">CANCEL</Button>}
                  <Button type="submit" className="flex-grow bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-12">
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> UPDATE</> : <><Plus className="mr-2 h-4 w-4" /> SAVE</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* PRODUCT LIST */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-2">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">INVENTORY LIST ({products?.length || 0})</CardTitle></CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-8 w-8 text-orange-600 animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products?.map((p) => (
                    <div key={p.id} className={`flex gap-4 p-4 bg-white/5 border transition-all ${editingId === p.id ? 'border-orange-600 bg-orange-600/5' : 'border-white/5'} group relative`}>
                      <div className="relative w-24 h-24 shrink-0 border border-white/10 overflow-hidden bg-black">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between overflow-hidden">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                             <p className="text-[8px] font-black text-orange-600 tracking-widest uppercase">{p.category}</p>
                             <Badge className={`rounded-none text-[7px] h-4 ${p.stockQuantity > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                               {p.stockQuantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                             </Badge>
                          </div>
                          <h3 className="text-sm font-black text-white uppercase truncate mt-1">{p.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] font-black text-white">৳{p.price}</span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase">TOTAL: {p.stockQuantity}</span>
                          </div>
                          {p.sizeInventory && p.sizeInventory.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.sizeInventory.map((si: any, i: number) => (
                                <span key={i} className="text-[7px] font-bold bg-white/10 px-1 text-white/70">{si.size}: {si.quantity}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button onClick={() => handleEdit(p)} variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-orange-600"><Edit2 className="h-4 w-4" /></Button>
                          <Button onClick={() => confirmDelete(p.id)} variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* PROFESSIONAL DELETE ALERT */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black border-orange-600/30 rounded-none p-8 max-w-md">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-600/10 flex items-center justify-center border border-red-600/20"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
              <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">DELETE PRODUCT?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
              THIS ACTION WILL PERMANENTLY REMOVE THIS PRODUCT FROM YOUR INVENTORY. THIS CANNOT BE UNDONE.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-2 sm:gap-0">
            <AlertDialogCancel className="flex-1 rounded-none border-white/10 text-white font-black uppercase text-[10px] h-12 hover:bg-white/5">CANCEL</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] rounded-none h-12 shadow-xl shadow-red-600/10">DELETE FOREVER</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
}
