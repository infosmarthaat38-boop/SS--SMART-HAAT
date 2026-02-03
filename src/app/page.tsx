
import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Diamond, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/products';
import { StyleAssistant } from '@/components/StyleAssistant';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow">
        {/* Unique Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000"
              alt="Luxury Fashion"
              fill
              className="object-cover opacity-60 scale-105 transition-transform duration-[10s] hover:scale-100"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              <div className="flex justify-center mb-6">
                <span className="flex items-center gap-2 px-6 py-2 border border-primary/50 text-primary text-xs font-bold tracking-[0.4em] uppercase rounded-none glass-card">
                  <Crown className="h-4 w-4" /> Royal Collection 2024
                </span>
              </div>
              <h1 className="text-6xl md:text-9xl font-headline leading-[0.9] gold-gradient">
                The Art of <br /> Distinction
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto italic">
                Defined by rarity. Crafted for those who move the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Button size="lg" className="h-16 rounded-none px-12 bg-primary text-background hover:bg-primary/90 text-lg uppercase tracking-widest font-bold">
                  Enter The Atelier <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-16 rounded-none px-12 border-primary/50 text-primary hover:bg-primary/10 text-lg uppercase tracking-widest">
                  View Lookbook
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Style Assistant Component */}
        <section className="py-24 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-headline">Meet Your <br /><span className="text-primary italic">AI Stylist</span></h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed">
                  Apnar fashion niye kono proshno ache? Amader AI assistant apnake luxury styling advice dibe. 
                  (Have a fashion question? Our AI stylist provides premium advice.)
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Zap className="h-5 w-5" /> Real-time Advice
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Sparkles className="h-5 w-5" /> Trend Analysis
                  </div>
                </div>
              </div>
              <div className="glass-card p-1">
                <StyleAssistant />
              </div>
            </div>
          </div>
        </section>

        {/* Unique Feature Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group space-y-4 text-center p-8 border border-white/5 hover:border-primary/30 transition-all">
                <Diamond className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Rarity Guaranteed</h3>
                <p className="text-muted-foreground font-light">Limited edition pieces that are never mass-produced.</p>
              </div>
              <div className="group space-y-4 text-center p-8 border border-white/5 hover:border-primary/30 transition-all bg-primary/[0.03]">
                <Crown className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Bespoke Experience</h3>
                <p className="text-muted-foreground font-light">Personalized concierge service for our elite members.</p>
              </div>
              <div className="group space-y-4 text-center p-8 border border-white/5 hover:border-primary/30 transition-all">
                <Zap className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Swift Legacy</h3>
                <p className="text-muted-foreground font-light">Global priority shipping for your timeless investments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid - Redesigned */}
        <section id="shop" className="py-24 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <span className="text-primary text-xs font-bold tracking-[0.5em] uppercase">The Catalog</span>
              <h2 className="text-5xl md:text-7xl font-headline mt-4">Curated Excellence</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
