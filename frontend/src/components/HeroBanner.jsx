import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { mockHeroSlides } from '../mockData';

export default function HeroBanner({ onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockHeroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = mockHeroSlides[currentSlide] || mockHeroSlides[0];

  return (
    <div className="relative bg-obsidian text-canvas overflow-hidden">
      {/* Full-bleed Crisp Photography Hero */}
      <div className="relative h-[520px] sm:h-[580px] md:h-[640px] w-full transition-all duration-700 ease-in-out">
        
        {/* Un-overlayed photography with natural contrast */}
        <img
          src={slide.bgImage}
          alt={slide.title}
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000 ease-out"
        />
        
        {/* Subtle dark gradient behind left text area ONLY for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/55 to-transparent max-w-3xl" />

        {/* Hero Text Content Container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center">
          <div className="max-w-xl space-y-6 text-left">
            
            {/* Tagline */}
            <div className="inline-block">
              <span className="text-[10px] tracking-[0.35em] font-light uppercase text-gold border-b border-gold/40 pb-1">
                {slide.tag}
              </span>
            </div>

            {/* Campaign Title */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.18em] text-canvas leading-[1.15]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-300 font-light tracking-wider leading-relaxed max-w-md">
              {slide.subtitle}
            </p>

            {/* Fashion CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => onSelectCategory(slide.category)}
                className="group inline-flex items-center gap-3 bg-transparent text-canvas border border-canvas/40 px-7 py-3 text-xs tracking-[0.25em] font-light uppercase hover:bg-canvas hover:text-obsidian hover:border-canvas transition-all duration-300"
              >
                <span>{slide.cta}</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>
            </div>

          </div>
        </div>

        {/* Slide Counter (01 / 03 format) */}
        <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-2 text-xs font-serif tracking-[0.2em] text-canvas/80">
          <span className="text-gold font-normal">{slide.number}</span>
          <span className="text-stone-500 font-light">/</span>
          <span className="text-stone-400 font-light">{slide.total}</span>
        </div>

        {/* Minimal Transparent Controls */}
        <div className="absolute bottom-6 right-6 sm:right-12 flex items-center space-x-3">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + mockHeroSlides.length) % mockHeroSlides.length)}
            className="p-2 text-canvas/70 hover:text-canvas transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-1" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % mockHeroSlides.length)}
            className="p-2 text-canvas/70 hover:text-canvas transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 stroke-1" />
          </button>
        </div>

      </div>

      {/* Trust & Craftsmanship Bar */}
      <div className="bg-canvas border-b border-subtle py-4.5 px-6 text-charcoal">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-[11px] font-light tracking-[0.2em] uppercase">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-3.5 h-3.5 text-gold stroke-1 shrink-0" />
            <span>100% CERTIFIED HANDLOOM</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-3.5 h-3.5 text-gold stroke-1 shrink-0" />
            <span>INSURED EXPRESS SHIPPING</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold stroke-1 shrink-0" />
            <span>HAND-INSPECTED • FINAL SALE</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold stroke-1 shrink-0" />
            <span>MATCHING BLOUSE FABRIC INCLUDED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
