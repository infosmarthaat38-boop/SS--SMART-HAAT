import React from 'react';
import Image from 'next/image';
import { ArrowRight, Flame, Star, LayoutGrid, Smartphone, Download, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-16">
        {/* BANNER SECTION (SLIDER + DOWNLOAD APP) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-2xl h-[400px] border border-white/5">
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[400px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                      alt="GRAND RAMADAN BAZAAR"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex flex-col justify-center px-12 space-y-6">
                      <h2 className="text-5xl md:text-6xl font-headline font-bold text-white max-w-2xl leading-tight uppercase">
                        GRAND <span className="gold-gradient">RAMADAN</span> BAZAAR
                      </h2>
                      <p className="text-white/70 max-w-md text-lg font-medium leading-relaxed uppercase">UP TO 80% OFF + FREE DELIVERY</p>
                      <Button className="bg-primary text-background h-14 px-10 font-bold rounded-full text-md hover:shadow-2xl hover:shadow-primary/40 transition-all uppercase w-fit">
                        SHOP NOW <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/10 border-none text-white hover:bg-white/30 h-10 w-10" />
              <CarouselNext className="right-4 bg-white/10 border-none text-white hover:bg-white/30 h-10 w-10" />
            </Carousel>
          </div>
          
          {/* DOWNLOAD APP CARD */}
          <div className="hidden lg:flex lg:col-span-3 bg-card rounded-2xl border border-white/5 p-6 flex-col justify-between group hover:border-primary/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-tight">DOWNLOAD THE APP</h3>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-transparent p-4 rounded-xl border border-primary/10 relative overflow-hidden">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 text-primary fill-current" />
                  <span className="text-[10px] font-bold">4.8 RATED</span>
                </div>
                <p className="text-xs font-bold leading-tight uppercase mb-4">GET EXCLUSIVE OFFERS ON MOBILE</p>
                <div className="flex gap-2">
                   <div className="flex-1 h-8 bg-black rounded-md flex items-center justify-center border border-white/10 text-[8px] font-bold">APP STORE</div>
                   <div className="flex-1 h-8 bg-black rounded-md flex items-center justify-center border border-white/10 text-[8px] font-bold">GOOGLE PLAY</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <div className="bg-white p-1 rounded-lg">
                <QrCode className="h-12 w-12 text-black" />
              </div>
              <p className="text-[9px] font-bold text-muted-foreground leading-snug uppercase">SCAN TO DOWNLOAD<br/>THE APP NOW!</p>
            </div>
          </div>
        </section>

        {/* TOP PRODUCT SECTION */}
        <section id="top-products" className="bg-card/30 rounded-[40px] p-10 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold flex items-center gap-4 uppercase">
              <Flame className="h-8 w-8 text-primary fill-current" /> TOP PRODUCT
            </h2>
            <Button variant="link" className="text-primary font-bold text-sm hover:translate-x-2 transition-transform uppercase">
              VIEW ALL <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h2 className="text-3xl font-bold uppercase tracking-tighter">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {[
              { name: 'SMARTPHONES', color: 'bg-blue-500/5 text-blue-400' },
              { name: 'FASHION', color: 'bg-pink-500/5 text-pink-400' },
              { name: 'WATCHES', color: 'bg-amber-500/5 text-amber-400' },
              { name: 'BEAUTY', color: 'bg-purple-500/5 text-purple-400' },
              { name: 'LAPTOPS', color: 'bg-emerald-500/5 text-emerald-400' },
              { name: 'FOOTWEAR', color: 'bg-rose-500/5 text-rose-400' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center space-y-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                <div className={`aspect-square ${cat.color} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-white/5`}>
                  <Star className="h-8 w-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JUST FOR YOU */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1.5 bg-primary rounded-full" />
              <h2 className="text-3xl font-bold uppercase tracking-tighter">JUST FOR YOU</h2>
            </div>
            <LayoutGrid className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {products.concat(products).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-12">
            <Button variant="outline" size="lg" className="w-full max-w-sm h-14 border-white/10 text-foreground hover:bg-primary hover:text-black rounded-full text-sm font-bold transition-all uppercase">
              LOAD MORE PRODUCTS
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
