
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
      
      <main className="flex-grow container mx-auto px-4 py-4 space-y-8">
        {/* BANNER SECTION (SLIDER + DOWNLOAD APP) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-9 relative rounded-none overflow-hidden shadow-2xl h-[280px] border border-white/5">
            <Carousel className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-[280px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600"
                      alt="GRAND RAMADAN BAZAAR"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-8 space-y-2">
                      <div className="space-y-0">
                        <h2 className="text-3xl md:text-4xl font-headline font-black text-white leading-[0.85] uppercase tracking-tighter">
                          GRAND <span className="text-orange-600 italic">RAMADAN</span>
                        </h2>
                        <h2 className="text-3xl md:text-4xl font-headline font-black text-white leading-[0.85] uppercase tracking-tighter">
                          BAZAAR
                        </h2>
                      </div>
                      <p className="text-white/90 text-[10px] font-black tracking-tight uppercase">UP TO 80% OFF + FREE DELIVERY</p>
                      <Button className="bg-orange-600 text-white h-8 px-4 font-black rounded-none text-[8px] hover:bg-orange-700 transition-all uppercase w-fit mt-1">
                        SHOP NOW <ArrowRight className="ml-1 h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/10 border-none text-white hover:bg-white/30 h-7 w-7 rounded-none" />
              <CarouselNext className="right-4 bg-white/10 border-none text-white hover:bg-white/30 h-7 w-7 rounded-none" />
            </Carousel>
          </div>
          
          {/* DOWNLOAD APP CARD */}
          <div className="hidden lg:flex lg:col-span-3 bg-card rounded-none border border-white/5 p-4 flex-col justify-between group hover:border-orange-600/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-orange-600/10 rounded-none">
                  <Smartphone className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-black text-[9px] uppercase tracking-tight">DOWNLOAD THE APP</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-transparent p-3 rounded-none border border-orange-600/10 relative overflow-hidden">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-2 w-2 text-orange-600 fill-current" />
                  <span className="text-[7px] font-black">4.8 RATED</span>
                </div>
                <p className="text-[8px] font-black leading-tight uppercase mb-2">GET EXCLUSIVE OFFERS ON MOBILE</p>
                <div className="flex flex-col gap-1">
                   <div className="h-7 bg-black rounded-none flex items-center justify-center border border-white/10 text-[7px] font-black cursor-pointer hover:bg-white/5 transition-colors uppercase">APP STORE</div>
                   <div className="h-7 bg-black rounded-none flex items-center justify-center border border-white/10 text-[7px] font-black cursor-pointer hover:bg-white/5 transition-colors uppercase">GOOGLE PLAY</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <div className="bg-white p-0.5 rounded-none">
                <QrCode className="h-7 w-7 text-black" />
              </div>
              <p className="text-[7px] font-black text-muted-foreground leading-snug uppercase">SCAN TO DOWNLOAD</p>
            </div>
          </div>
        </section>

        {/* TOP PRODUCT SECTION */}
        <section id="top-products" className="bg-card/30 rounded-none p-6 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
              <Flame className="h-5 w-5 text-orange-600 fill-current" /> TOP PRODUCT
            </h2>
            <Button variant="link" className="text-orange-600 font-black text-[8px] hover:translate-x-1 transition-transform uppercase p-0 h-auto">
              VIEW ALL <ArrowRight className="ml-1 h-2.5 w-2.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.concat(products).slice(0, 12).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-orange-600" />
            <h2 className="text-xl font-black uppercase tracking-tighter">SHOP BY CATEGORY</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'SMARTPHONES', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'FASHION', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'WATCHES', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'BEAUTY', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'LAPTOPS', color: 'bg-orange-500/5 text-orange-400' },
              { name: 'FOOTWEAR', color: 'bg-orange-500/5 text-orange-400' }
            ].map((cat) => (
              <div key={cat.name} className="group cursor-pointer text-center space-y-1.5 p-2 hover:bg-white/5 rounded-none transition-all border border-transparent hover:border-white/10">
                <div className={`aspect-square ${cat.color} rounded-none flex items-center justify-center group-hover:scale-105 transition-transform border border-white/5`}>
                  <Star className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest">{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* JUST FOR YOU */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-orange-600" />
              <h2 className="text-xl font-black uppercase tracking-tighter">JUST FOR YOU</h2>
            </div>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.concat(products).map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" size="sm" className="w-full max-w-[200px] h-10 border-white/10 text-foreground hover:bg-orange-600 hover:text-white rounded-none text-[8px] font-black transition-all uppercase">
              LOAD MORE PRODUCTS
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
