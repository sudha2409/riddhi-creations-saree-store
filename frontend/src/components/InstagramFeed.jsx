import React from 'react';
import { mockInstagramImages } from '../mockData';
import { Instagram } from 'lucide-react';

export default function InstagramFeed() {
  return (
    <section className="py-20 bg-canvas border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] tracking-[0.35em] font-light uppercase text-gold block flex items-center justify-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-gold stroke-1" /> INSTAGRAM EDIT
          </span>
          <h2 className="font-serif font-normal text-3xl sm:text-4xl text-charcoal tracking-[0.2em] uppercase">
            FOLLOW THE RIDDHI EDIT
          </h2>
          <span className="text-xs tracking-[0.25em] font-light text-muted uppercase block">
            @riddhicreation_surat
          </span>
          <div className="w-12 h-[1px] bg-wine mx-auto mt-3" />
        </div>

        {/* 6 Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockInstagramImages.map((item) => (
            <a
              key={item.id}
              href="https://www.instagram.com/riddhicreation_surat/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden border border-subtle bg-canvas block"
            >
              <img
                src={item.image}
                alt="Riddhi Creations Editorial"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-canvas text-xs font-light tracking-widest">
                <div className="flex items-center gap-1">
                  <Instagram className="w-4 h-4 stroke-1" />
                  <span>{item.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
