
"use client";

import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, Apple, Play, ArrowRight, Sparkles } from 'lucide-react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, limit, doc, increment, orderBy } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { OrderModal } from '@/components/OrderModal';

const SlideItem = memo(({ item, priority }: { item: any, priority: boolean }) => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const isProduct = item.price !== undefined;

  return (
    <CarouselItem className="h-full pl-0">
      <div className="relative h-full w-full bg-black overflow-hidden gpu-accelerated flex items-center justify-center">
        <Image
          src={item.imageUrl || 'https://picsum.photos/seed/placeholder/800/450'}
          alt={item.name || item.title || 'Banner'}
          fill
          sizes="100vw"
          className="object-fill"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" } : {})}
        />
        
        <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start max-w-[90%] pointer-events-none">
          <h2 className="text-[12px] md:text-[20px] font-headline font-black text-white uppercase tracking-wider mb-1 drop-shadow-lg truncate w-full">
            {item.name || item.title}
          </h2>
          
          {isProduct && (
            <div className="flex flex-col space-y-1 md:space-y-2 pointer-events-auto">
              <div className="text-[14px] md:text-2xl font-black text-[#01a3a4] tracking-tighter drop-shadow-lg leading-none">
                <span className="text-[10px] md:text-[14px] font-normal mr-0.5 text-white">৳</span>
                {(item.price || 0).toLocaleString()}
              </div>
              <button 
                onClick={() => setIsOrderOpen(true)} 
                style={{ backgroundColor: '#01a3a4' }}
                className="text-white px-3 md:px-8 py-1.5 md:py-3 h-8 md:h-12 font-black text-[9px] md:text-[14px] uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-95 shadow-xl border-none flex items-center gap-2"
              >
                <ShoppingCart className="h-3 w-3 md:h-5 md:w-5" /> অর্ডার করুন
              </button>
            </div>
          )}
        </div>
      </div>
      <OrderModal product={item} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </CarouselItem>
  );
});

SlideItem.displayName = 'SlideItem';

const AnimatedFlashBar = memo(() => {
  const db = useFirestore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const flashProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(10));
  }, [db]);

  const flashBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(20));
  }, [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    const products = flashProducts || [];
    const banners = (flashBanners || []).filter(b => b.showOnRight !== false);
    return [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
  }, [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combinedItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [combinedItems.length]);

  if (combinedItems.length === 0) return null;
  const activeItem = combinedItems[currentIndex];

  return (
    <div className="h-full w-full relative overflow-hidden bg-black group cursor-pointer gpu-accelerated">
      <div key={activeItem.id} className="h-full w-full absolute inset-0">
        <Image 
          src={activeItem.imageUrl} 
          alt="Flash" 
          fill 
          className="object-fill"
          priority={true}
          loading="eager"
          decoding="async"
          {...({ fetchPriority: "high" } as any)}
        />
      </div>
      <div className="absolute top-2 right-2 bg-[#01a3a4]/40 backdrop-blur-sm border border-white/20 px-2 py-1 text-[6px] md:text-[8px] text-white font-black uppercase tracking-widest flex items-center gap-1">
        <Sparkles className="h-1.5 w-1.5 animate-pulse" /> FLASH LIVE
      </div>
      <div className="absolute bottom-2 left-2 right-2 z-10 space-y-0.5">
        <p className="text-[10px] md:text-[14px] font-black text-white uppercase tracking-widest truncate drop-shadow-md">
          {activeItem.name || activeItem.title}
        </p>
        <div className="h-0.5 w-8 bg-[#01a3a4] rounded-full" />
      </div>
    </div>
  );
});

AnimatedFlashBar.displayName = 'AnimatedFlashBar';

const FlashOfferCard = memo(() => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = useFirestore();
  
  const flashProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('showInFlashOffer', '==', true), limit(10));
  }, [db]);

  const flashBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'FLASH'), limit(20));
  }, [db]);
  
  const { data: flashProducts } = useCollection(flashProductQuery);
  const { data: flashBanners } = useCollection(flashBannerQuery);

  const combinedItems = useMemo(() => {
    const products = flashProducts || [];
    const banners = (flashBanners || []).filter(b => b.showOnLeft !== false);
    return [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
  }, [flashProducts, flashBanners]);

  useEffect(() => {
    if (combinedItems.length <= 1) {
      setCurrentIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combinedItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [combinedItems.length]);
  
  const activeItem = combinedItems[currentIndex];

  return (
    <div className="h-full bg-black overflow-hidden relative group w-full gpu-accelerated flex items-center justify-center">
      {activeItem ? (
        <div className="h-full w-full relative flex items-center justify-center" key={activeItem.id}>
          <div className="h-full w-full absolute inset-0">
            <Image 
              src={activeItem.imageUrl || 'https://picsum.photos/seed/flash/400/400'} 
              alt="Flash Offer" 
              fill 
              sizes="(max-width: 768px) 33vw, 25vw" 
              className="object-fill" 
              priority={true}
              loading="eager"
              decoding="async"
              {...({ fetchPriority: "high" } as any)}
            />
          </div>
          <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-red-600 px-2 md:px-4 py-1 text-[6px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] z-10 shadow-xl">FLASH OFFER</div>
          
          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 z-10 flex flex-col items-start max-w-[90%]">
             <p className="text-white font-black text-[10px] md:text-[16px] uppercase tracking-wider mb-1 drop-shadow-md truncate w-full">
               {activeItem.name || activeItem.title}
             </p>
             {activeItem.price !== undefined && (
               <div className="mb-1">
                 <span className="text-[#01a3a4] font-black text-[12px] md:text-2xl drop-shadow-md">
                   ৳{(activeItem.price || 0).toLocaleString()}
                 </span>
               </div>
             )}
             <button 
               onClick={() => setIsOrderOpen(true)} 
               style={{ backgroundColor: '#01a3a4' }}
               className="text-white px-3 md:px-6 py-1.5 md:py-2.5 h-7 md:h-11 font-black text-[9px] md:text-[14px] uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-95 shadow-xl border-none flex items-center gap-1.5"
             >
               <ShoppingCart className="h-3 w-3 md:h-5 md:w-5" /> অর্ডার করুন
             </button>
             <OrderModal product={activeItem} isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2 w-full">
          <ShoppingCart className="h-6 w-6 text-white/10" />
        </div>
      )}
    </div>
  );
});

FlashOfferCard.displayName = 'FlashOfferCard';

export default function Home() {
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  
  const categoriesRef = useMemoFirebase(() => db ? collection(db, 'categories') : null, [db]);
  
  const productsRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(60));
  }, [db]);

  const sliderProductQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('showInSlider', '==', true), limit(15));
  }, [db]);

  const sliderBannerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'featured_banners'), where('type', '==', 'SLIDER'), limit(15));
  }, [db]);

  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  
  const { data: categories, isLoading: isCategoriesLoading } = useCollection(categoriesRef);
  const { data: allProducts, isLoading: isProductsLoading } = useCollection(productsRef);
  const { data: sliderProducts } = useCollection(sliderProductQuery);
  const { data: sliderBanners } = useCollection(sliderBannerQuery);
  const { data: settings } = useDoc(settingsRef);

  const combinedSliderItems = useMemo(() => {
    const products = sliderProducts || [];
    const banners = sliderBanners || [];
    return [...banners, ...products].sort((a, b) => 
      new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
    );
  }, [sliderProducts, sliderBanners]);

  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  useEffect(() => {
    setIsMounted(true);
    if (db) {
      const timer = setTimeout(() => {
        const dateStr = new Date().toISOString().split('T')[0];
        const statsRef = doc(db, 'visitorStats', dateStr);
        setDocumentNonBlocking(statsRef, { count: increment(1), date: dateStr }, { merge: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [db]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-[#01a3a4]/30 relative">
      <MainHeader />

      <main className="flex-grow container mx-auto bg-black">
        {/* TOP FOLD: PERFECT IMAGE DISPLAY */}
        <section className="px-2 md:px-12 pt-0.5 pb-2 md:pt-1 md:pb-4">
          <div className="grid grid-cols-12 gap-0 h-[130px] md:h-[380px] gpu-accelerated bg-black overflow-hidden border border-white/5">
            <div className="col-span-3 h-full overflow-hidden border-r border-white/5 bg-black">
              <FlashOfferCard />
            </div>
            
            <div className="col-span-6 h-full relative overflow-hidden bg-black border-r border-white/5">
              {combinedSliderItems.length > 0 ? (
                <Carousel className="w-full h-full" opts={{ loop: true }} plugins={[autoplay.current]}>
                  <CarouselContent className="h-full ml-0">
                    {combinedSliderItems.map((item, index) => (
                      <SlideItem key={item.id || index} item={item} priority={index === 0} />
                    ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 text-[#01a3a4] animate-spin" />
                </div>
              )}
            </div>

            <div className="col-span-3 h-full bg-[#01a3a4] relative overflow-hidden flex flex-col items-center justify-center p-1 md:p-4 space-y-1 md:space-y-4 gpu-accelerated shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">
              {settings?.showVideoInAppBar ? (
                <div className="absolute inset-0 w-full h-full bg-black"><AnimatedFlashBar /></div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1 md:space-y-4 relative z-10 w-full">
                  <h3 className="text-white font-black text-[10px] md:text-sm lg:text-lg uppercase tracking-[0.2em] italic text-center drop-shadow-xl font-headline leading-none">DOWNLOAD APP</h3>
                  <div className="bg-white p-0.5 md:p-2 w-14 h-14 md:w-32 md:h-32 flex items-center justify-center border border-white/20 shadow-2xl">
                    <Image 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(settings?.qrCodeLink || 'https://sssmarthaat.com')}`} 
                      alt="QR" 
                      width={150} 
                      height={150} 
                      className="w-full h-full" 
                      priority={true} 
                      decoding="async"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-3 w-full max-w-[160px]">
                    <button className="w-full bg-white text-black h-6 md:h-10 flex items-center justify-center gap-1 md:gap-2 font-black text-[7px] md:text-[11px] uppercase shadow-lg hover:opacity-90 transition-all"><Apple className="h-3 w-3 md:h-5 md:w-5" /> APP STORE</button>
                    <button className="w-full bg-white text-black h-6 md:h-10 flex items-center justify-center gap-1 md:gap-2 font-black text-[7px] md:text-[11px] uppercase shadow-lg hover:opacity-90 transition-all"><Play className="h-3 w-3 md:h-5 md:w-5" /> PLAY STORE</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {isCategoriesLoading || isProductsLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] font-black uppercase text-[#01a3a4] tracking-widest">Initialising Archive...</p>
          </div>
        ) : categories?.map((cat) => {
          const catProducts = allProducts?.filter(p => p.category === cat.name).slice(0, 18) || [];
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} className="py-1 md:py-2 px-2 md:px-12 gpu-accelerated product-section bg-black">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="h-4 md:h-6 w-1 bg-[#01a3a4]" />
                  <h2 className="text-[10px] md:text-[14px] font-black text-white uppercase tracking-[0.3em] font-headline">{cat.name} COLLECTION</h2>
                </div>
                <Link href={`/shop?category=${cat.name}`} className="text-[7px] md:text-[9px] font-black text-[#01a3a4] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                  VIEW ALL <ArrowRight className="h-2 w-2 md:h-2.5 md:w-2.5" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
                {catProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-8 md:mt-12 flex justify-center pb-16 px-2 md:px-12 bg-black">
          <Link href="/shop" className="w-full md:w-auto">
            <button className="w-full md:w-[220px] border border-white/20 bg-white/[0.05] hover:border-[#01a3a4] text-white px-6 h-10 md:h-12 font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] flex items-center justify-center gap-2 md:gap-3 transition-all hover:bg-[#01a3a4] hover:text-white active:scale-95 shadow-lg group">
              MORE PRODUCT <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>

        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
}
