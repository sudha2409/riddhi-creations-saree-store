import React from 'react';
import { mockOccasions } from '../mockData';

export default function ShopOccasions({ onSelectOccasion }) {
  return (
    <section className="py-16 bg-canvas border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] tracking-[0.35em] font-light uppercase text-muted block">
            CELEBRATIONS & TROUSSEAU
          </span>
          <h2 className="font-serif font-normal text-3xl sm:text-4xl text-charcoal tracking-[0.2em] uppercase">
            SHOP BY OCCASION
          </h2>
          <div className="w-12 h-[1px] bg-wine mx-auto mt-3" />
        </div>

        {/* 6-Tile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {mockOccasions.map((occ) => (
            <div
              key={occ.id}
              onClick={() => onSelectOccasion(occ.name)}
              className="group relative aspect-[4/5] overflow-hidden cursor-pointer border border-subtle bg-canvas"
            >
              <img
                src={occ.image}
                alt={occ.name}
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 text-center text-canvas space-y-0.5">
                <h3 className="font-serif font-normal text-sm sm:text-base tracking-[0.2em] uppercase text-canvas">
                  {occ.name}
                </h3>
                <span className="text-[9px] tracking-[0.2em] uppercase font-light text-stone-300 block">
                  {occ.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
