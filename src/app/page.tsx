
import React from 'react';
import Image from 'next/image';
import { ArrowRight, Flame, Star, LayoutGrid, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-orange-600/30">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 space-y-10">
        {/* BANNER SECTION (SLIDER + DOWNLOAD APP) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 relative rounded-none overflow-hidden shadow-2xl h-[320px] border border-white/5 bg-card">
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[320px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                      alt="GRAND RAMADAN BAZAAR"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent flex flex-col justify-center px-10 space-y-3">
                      <div className="space-y-0">
                        <h2 className="text-4xl md:text-5xl font-headline font-black text-white leading-none uppercase tracking-tighter">
                          GRAND <span className="text-orange-600 italic">RAMADAN</span>
                        </h2>
                        <h2 className="text-4xl md:text-5xl font-headline font-black text-white leading-none uppercase tracking-tighter">
                          BAZAAR
                        </h2>
                      </div>
                      <p className="text-white/90 text-[10px] font-black tracking-tight uppercase">UP TO 80% OFF + FREE DELIVERY</p>
                      <Button className="bg-orange-600 text-white h-9 px-6 font-black rounded-none text-[10px] hover:bg-orange-700 transition-all uppercase w-fit mt-2">
                        SHOP NOW <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/10 border-none text-white hover:bg-white/30 h-8 w-8 rounded-none" />
              <CarouselNext className="right-4 bg-white/10 border-none text-white hover:bg-white/30 h-8 w-8 rounded-none" />
            </Carousel>
          </div>
          
          {/* DOWNLOAD APP CARD */}
          <div className="hidden lg:flex lg:col-span-3 bg-card rounded-none border border-white/5 p-5 flex-col justify-between group hover:border-orange-600/20 transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/10 rounded-none">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-tight text-white">DOWNLOAD THE APP</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-transparent p-4 rounded-none border border-orange-600/10 relative overflow-hidden">
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="h-3 w-3 text-orange-600 fill-current" />
                  <span className="text-[9px] font-black text-white">4.8 RATED</span>
                </div>
                <p className="text-[10px] font-black leading-tight uppercase mb-3 text-white">GET EXCLUSIVE OFFERS ON MOBILE</p>
                <div className="flex flex-col gap-2">
                   <div className="h-8 bg-black rounded-none flex items-center justify-center border border-white/10 text-[9px] font-black cursor-pointer hover:bg-white/5 transition-colors uppercase text-white">APP STORE</div>
                   <div className="h-8 bg-black rounded-none flex items-center justify-center border border-white/10 text-[9px] font-black cursor-pointer hover:bg-white/5 transition-colors uppercase text-white">GOOGLE PLAY</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="bg-white p-1 rounded-none">
                <QrCode className="h-10 w-10 text-black" />
              </div>
              <p className="text-[9px] font-black text-muted-foreground leading-snug uppercase">SCAN TO DOWNLOAD</p>
            </div>
          </div>
        </section>

        {/* TOP PRODUCT SECTION - ALWAYS 12 PRODUCTS */}
        <section id="top-products" className="bg-card/30 rounded-none p-8 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter text-white">
              <Flame className="h-6 w-6 text-orange-600 fill-current" /> TOP PRODUCT
            </h2>
            <Button variant="link" className="text-orange-600 font-black text-[10px] hover:translate-x-1 transition-transform uppercase p-0 h-auto">
              VIEW ALL <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-orange-600" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'SMARTPHONES', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'FASHION', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'WATCHES', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'BEAUTY', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'LAPTOPS', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'FOOTWEAR', color: 'bg-orange-500/5 text-orange-400' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center space-y-2 p-3 hover:bg-white/5 rounded-none transition-all border border-transparent hover:border-white/10">
                <div className={`aspect-square ${cat.color} rounded-none flex items-center justify-center group-hover:scale-105 transition-transform border border-white/5`}>
                  <Star className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JUST FOR YOU */}
        <section className="space-y-8 pb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1.5 bg-orange-600" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">JUST FOR YOU</h2>
            </div>
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {products.concat(products).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-8">
            <Button variant="outline" size="lg" className="w-full max-w-[250px] h-12 border-white/10 text-white hover:bg-orange-600 hover:text-white rounded-none text-[10px] font-black transition-all uppercase">
              LOAD MORE PRODUCTS
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
