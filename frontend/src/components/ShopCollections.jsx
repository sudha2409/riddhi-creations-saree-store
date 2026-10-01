import React from 'react';
import { mockCollections } from '../mockData';

export default function ShopCollections({ onSelectCategory }) {
  return (
    <section className="py-16 bg-canvas border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] tracking-[0.35em] font-light uppercase text-muted block">
            CURATED HANDLOOM WEAVES
          </span>
          <h2 className="font-serif font-normal text-3xl sm:text-4xl text-charcoal tracking-[0.2em] uppercase">
            SHOP BY COLLECTION
          </h2>
          <div className="w-12 h-[1px] bg-wine mx-auto mt-3" />
        </div>

        {/* 2-Column Mobile / 5-Column Desktop Editorial Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {mockCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCategory(col.category)}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer border border-subtle bg-canvas transition-all duration-500"
            >
              {/* Image */}
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              
              {/* Soft Gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent transition-opacity duration-300" />

              {/* Text Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-left text-canvas space-y-1">
                <span className="text-[9px] tracking-[0.25em] uppercase font-light text-stone-300 block">
                  {col.subtitle}
                </span>
                <h3 className="font-serif font-normal text-lg tracking-[0.18em] text-canvas leading-tight">
                  {col.name}
                </h3>
                <div className="pt-2 flex items-center gap-2 text-[10px] tracking-[0.25em] font-light uppercase text-gold group-hover:text-canvas transition-colors">
                  <span>SHOP NOW</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
