import React from 'react';
import Image from 'next/image';
import { ArrowRight, Diamond, Crown, ShieldCheck, MapPin, Star, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { StyleAssistant } from '@/components/StyleAssistant';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow">
        {/* Cinematic Hero */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000"
              alt="Haute Couture Dhaka"
              fill
              className="object-cover opacity-50 scale-105"
              priority
              data-ai-hint="luxury fashion model"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
            <div className="flex flex-col items-center animate-fade-in-up">
              <span className="text-primary text-[10px] font-bold tracking-[1em] uppercase mb-4">The Absolute Peak</span>
              <h1 className="text-8xl md:text-[12rem] font-headline leading-none gold-gradient select-none">
                SMART <br /> <span className="italic font-light">HAAT</span>
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mt-6 tracking-wide">
                Where heritage craftsmanship meets modern technology. Curated for the Dhaka elite.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-10">
                <Button size="lg" className="h-16 rounded-none px-12 bg-primary text-background hover:bg-primary/90 text-xs uppercase tracking-widest font-black gold-shimmer">
                  Enter The Atelier <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-16 rounded-none px-12 border-white/20 hover:border-primary/50 text-white text-xs uppercase tracking-widest bg-white/5 backdrop-blur-sm">
                  The Lookbook
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars of Luxury */}
        <section className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
              <div className="space-y-6 group cursor-default">
                <div className="flex justify-center">
                  <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center group-hover:royal-border transition-all">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-headline tracking-widest">Imperial Standard</h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-[250px] mx-auto">Selected materials from global fashion capitals, refined for Dhaka's elite social calendar.</p>
              </div>
              <div className="space-y-6 group cursor-default">
                <div className="flex justify-center">
                  <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center group-hover:royal-border transition-all">
                    <Diamond className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-headline tracking-widest">Heritage Jamdani</h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-[250px] mx-auto">Blending the thousand-year legacy of Bengal silk with cutting-edge smart accessories.</p>
              </div>
              <div className="space-y-6 group cursor-default">
                <div className="flex justify-center">
                  <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center group-hover:royal-border transition-all">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-headline tracking-widest">Secured Identity</h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-[250px] mx-auto">Every transaction and every piece is verified for its unique place in our limited collections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Style Assistant & Concierge */}
        <section className="py-40 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-10 order-2 lg:order-1">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-panel text-primary text-[10px] font-bold tracking-[0.4em] uppercase">
                  <Star className="h-3 w-3 fill-current" /> Couture Concierge
                </div>
                <h2 className="text-6xl md:text-8xl font-headline leading-none">
                  Tailored <br /><span className="text-primary italic">Intelligence</span>
                </h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-lg">
                  Amader private AI stylist apnar closet analyze kore Gulshan ebong Banani-r high-end parties-er jonno ekdom perfect styling advice probe. 
                  Bespoke elegance, now at your fingertips.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 glass-panel royal-border">
                    <PhoneCall className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <p className="font-bold text-sm uppercase tracking-widest">Priority Access</p>
                      <p className="text-xs text-muted-foreground mt-1">Talk to our lead consultants for private showings in our Dhaka studio.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="royal-border p-1">
                  <StyleAssistant />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Icons */}
        <section id="shop" className="py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="space-y-4">
                <span className="text-primary text-[10px] font-bold tracking-[1em] uppercase block">The Season's Peak</span>
                <h2 className="text-6xl md:text-9xl font-headline">The Icons</h2>
              </div>
              <Button variant="link" className="text-primary uppercase tracking-[0.3em] font-black hover:no-underline group p-0">
                View All <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-3" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-12 gap-y-32">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Membership CTA */}
        <section className="py-40 border-t border-white/5 relative bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-12">
              <Crown className="h-12 w-12 text-primary mx-auto mb-8 animate-pulse" />
              <h2 className="text-5xl md:text-7xl font-headline tracking-tighter">Join The <span className="gold-gradient">Sovereign Club</span></h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                Exclusive early access to limited drops, private Dhaka events, and 24/7 personal fashion concierge.
              </p>
              <div className="pt-8">
                <Button size="lg" className="h-20 rounded-none px-16 bg-white text-black hover:bg-primary hover:text-white transition-all text-sm uppercase tracking-[0.5em] font-black gold-shimmer">
                  Apply For Membership
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}