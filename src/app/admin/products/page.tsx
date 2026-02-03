
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Package, Upload, X, Loader2, Edit2, Save, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function AdminProducts() {
  const db = useFirestore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInFlashOffer, setShowInFlashOffer] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // References
  const productsRef = useMemoFirebase(() => query(collection(db, 'products'), orderBy('createdAt', 'desc')), [db]);
  const categoriesRef = useMemoFirebase(() => collection(db, 'categories'), [db]);
  
  const { data: products, isLoading: productsLoading } = useCollection(productsRef);
  const { data: categories } = useCollection(categoriesRef);

  // Auto-calculate discount if originalPrice and price change
  useEffect(() => {
    const p = parseFloat(price);
    const op = parseFloat(originalPrice);
    if (p && op && op > p) {
      const disc = ((op - p) / op) * 100;
      setDiscountPercentage(Math.round(disc).toString());
    }
  }, [price, originalPrice]);

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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imagePreview || !category) return;

    const productData = {
      name: name.toUpperCase(),
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || parseFloat(price),
      discountPercentage: parseInt(discountPercentage),
      category: category.toUpperCase(),
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

    // Reset
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
    setOriginalPrice(product.originalPrice?.toString() || '');
    setDiscountPercentage(product.discountPercentage?.toString() || '0');
    setCategory(product.category);
    setImagePreview(product.imageUrl);
    setShowInSlider(!!product.showInSlider);
    setShowInFlashOffer(!!product.showInFlashOffer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            {editingId ? 'EDIT PRODUCT' : 'MANAGE PRODUCTS'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-1 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">
                {editingId ? 'UPDATE PRODUCT DETAILS' : 'ADD NEW PRODUCT'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Product Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="PRODUCT NAME" className="bg-black/50 border-white/10 rounded-none text-xs uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="DESCRIPTION" className="bg-black/50 border-white/10 rounded-none text-xs min-h-[80px]" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Original Price (৳)</label>
                    <Input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="0.00" className="bg-black/50 border-white/10 rounded-none text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Selling Price (৳)</label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="bg-black/50 border-white/10 rounded-none text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Discount (%)</label>
                    <Input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="bg-black/50 border-white/10 rounded-none text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase">Category</label>
                    <Select value={category} onValueChange={setCategory}>
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

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="slider" checked={showInSlider} onCheckedChange={(checked) => setShowInSlider(!!checked)} className="border-white/20 data-[state=checked]:bg-orange-600" />
                    <Label htmlFor="slider" className="text-[10px] font-black uppercase text-white cursor-pointer">Show in Home Slider</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="flash" checked={showInFlashOffer} onCheckedChange={(checked) => setShowInFlashOffer(!!checked)} className="border-white/20 data-[state=checked]:bg-orange-600" />
                    <Label htmlFor="flash" className="text-[10px] font-black uppercase text-white cursor-pointer">Show in Flash Offer Section</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">Product Image</label>
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 p-4 text-center cursor-pointer hover:border-orange-600 transition-all bg-black/30 flex flex-col items-center justify-center min-h-[150px] relative group">
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

                <div className="flex gap-2">
                  {editingId && (
                    <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-white/10 rounded-none uppercase text-[10px] h-12">
                      CANCEL
                    </Button>
                  )}
                  <Button type="submit" disabled={!name || !price || !imagePreview || !category} className="flex-grow bg-orange-600 hover:bg-orange-700 text-white font-black rounded-none uppercase text-[10px] h-12">
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> UPDATE PRODUCT</> : <><Plus className="mr-2 h-4 w-4" /> SAVE PRODUCT</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* LIST */}
          <Card className="bg-card border-white/5 rounded-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">INVENTORY LIST ({products?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-8 w-8 text-orange-600 animate-spin" /></div>
              ) : !products || products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10"><Package className="h-10 w-10 text-white/10 mx-auto mb-4" /><p className="text-[10px] font-black uppercase text-muted-foreground">NO PRODUCTS FOUND</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className={`flex gap-4 p-4 bg-white/5 border transition-all ${editingId === p.id ? 'border-orange-600 bg-orange-600/5' : 'border-white/5'} group relative`}>
                      <div className="relative w-24 h-24 shrink-0 border border-white/10 overflow-hidden">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        {(p.showInSlider || p.showInFlashOffer) && (
                          <div className="absolute top-0 left-0 bg-orange-600 p-1">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-between overflow-hidden">
                        <div>
                          <div className="flex justify-between items-start">
                            <p className="text-[8px] font-black text-orange-600 tracking-widest">{p.category}</p>
                            <div className="flex gap-1">
                              {p.showInSlider && <span className="text-[7px] bg-white/10 px-1 py-0.5 text-white font-black uppercase">Slider</span>}
                              {p.showInFlashOffer && <span className="text-[7px] bg-white/10 px-1 py-0.5 text-white font-black uppercase">Flash</span>}
                            </div>
                          </div>
                          <h3 className="text-sm font-black text-white uppercase truncate">{p.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[12px] font-black text-white">৳{p.price}</span>
                            {p.originalPrice > p.price && (
                              <span className="text-[10px] text-muted-foreground line-through">৳{p.originalPrice}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => handleEdit(p)} variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-orange-600"><Edit2 className="h-4 w-4" /></Button>
                          <Button onClick={() => handleDeleteProduct(p.id)} variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
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
      <Footer />
    </div>
  );
}
