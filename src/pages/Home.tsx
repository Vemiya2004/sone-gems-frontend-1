import React from "react";
import { Link } from "wouter";
import { useGetFeaturedGems, useGetGemCategories } from "@/api-client";
import { GemCard } from "@/components/shared/GemCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  const { data: featuredGems, isLoading: isFeaturedLoading } = useGetFeaturedGems();
  const { data: categories, isLoading: isCategoriesLoading } = useGetGemCategories();

  const mockCategories = [
    { name: "Sapphire", image: "/images/sapphire.png" },
    { name: "Ruby", image: "/images/ruby.png" },
    { name: "Emerald", image: "/images/emerald.png" },
    { name: "Alexandrite", image: "/images/alexandrite.png" },
    { name: "Spinel", image: "/images/spinel.png" },
    { name: "Cat's Eye", image: "/images/catseye.png" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[80vh] min-h-[600px] w-full bg-primary flex items-center">
        <div className="absolute inset-0 z-0">
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="h-full">
              <CarouselItem className="h-[80vh] min-h-[600px] relative">
                <img src="/images/banner1.png" alt="Luxury jewelry store interior" className="w-full h-full object-cover opacity-60" />
              </CarouselItem>
              <CarouselItem className="h-[80vh] min-h-[600px] relative">
                <img src="/images/banner2.png" alt="Sapphires on dark slate" className="w-full h-full object-cover opacity-60" />
              </CarouselItem>
              <CarouselItem className="h-[80vh] min-h-[600px] relative">
                <img src="/images/banner3.png" alt="Jeweler inspecting emerald" className="w-full h-full object-cover opacity-60" />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent pointer-events-none" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-2xl text-white">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Unearth <span className="text-secondary italic">Ceylon's</span> Finest
            </h1>
            <p className="text-lg md:text-xl font-light mb-8 text-white/90 leading-relaxed">
              Discover our curated collection of premium Sri Lankan gemstones. From breathtaking sapphires to rare alexandrites, each piece is a masterpiece of nature.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 font-medium">
                <Link href="/gems">Shop Collection</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white text-base px-8 font-medium">
                <Link href="/about">Our Heritage</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Discover by Category</h2>
            <div className="h-1 w-20 bg-secondary mx-auto mb-4"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our extensive range of precious and semi-precious stones, ethically sourced from the famous mines of Sri Lanka.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {mockCategories.map((cat, i) => (
              <Link key={i} href={`/gems?category=${cat.name}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-full mb-4 bg-muted border border-border">
                  <img src={cat.image} alt={cat.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors duration-500"></div>
                </div>
                <h3 className="text-center font-serif text-lg font-medium group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Gems</h2>
              <div className="h-1 w-20 bg-secondary mb-4"></div>
              <p className="text-muted-foreground">Handpicked selections of extraordinary quality and brilliance.</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/gems">View All Gems</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isFeaturedLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-square" />
                  <Skeleton className="h-4 w-1/3 mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              ))
            ) : Array.isArray(featuredGems) && featuredGems.length > 0 ? (
              featuredGems.slice(0, 4).map(gem => (
                <GemCard key={gem.id} gem={gem} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No featured gems at the moment.
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/gems">View All Gems</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative aspect-square md:aspect-[4/3] overflow-hidden rounded-sm">
               <img src="/images/banner3.png" alt="Master craftsman" className="object-cover w-full h-full" />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">The Artisan's Touch</h2>
              <p className="text-primary-foreground/80 text-lg font-light leading-relaxed">
                For over three decades, Sone Gems has been synonymous with unparalleled quality. Each gemstone passes through the hands of our master cutters, honoring traditional Sri Lankan techniques while bringing out maximum brilliance.
              </p>
              <p className="text-primary-foreground/80 text-lg font-light leading-relaxed">
                We guarantee the authenticity and ethical sourcing of every piece, complete with independent certification from globally recognized gemological laboratories.
              </p>
              <div className="pt-4">
                <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}