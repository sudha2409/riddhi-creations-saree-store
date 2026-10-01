import React from 'react';

export default function BrandStory({ onReadStory }) {
  return (
    <section className="py-20 bg-canvas border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Large Imagery */}
          <div className="relative aspect-[4/5] overflow-hidden border border-subtle">
            <img
              src="./moss_saree_pink.jpg"
              alt="Surat Handloom Couture"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 border border-canvas/20 pointer-events-none" />
          </div>

          {/* Right Editorial Story Copy */}
          <div className="text-left space-y-6 max-w-lg">
            
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.35em] font-light uppercase text-gold block">
                SURAT HANDLOOM HERITAGE
              </span>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-charcoal tracking-[0.18em] uppercase leading-snug">
                ROOTED IN HERITAGE & CRAFTSMANSHIP
              </h2>
              <div className="w-12 h-[1px] bg-wine mt-3" />
            </div>

            <p className="font-serif text-lg sm:text-xl text-stone-700 italic font-light leading-relaxed">
              "From the looms of master artisans in Surat to your wardrobe, every drape celebrates the rich elegance of Indian textiles."
            </p>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed tracking-wide">
              Riddhi Creations brings together the artistry of Surat handloom with a contemporary sense of luxury. Featuring intricate golden zari borders, traditional bandhani prints, and rich running blouse pieces, every saree in our atelier is hand-inspected in Surat for its authenticity, drape, and fast vibrant colours.
            </p>

            <div className="pt-4">
              <button
                onClick={onReadStory}
                className="group inline-flex items-center gap-3 bg-transparent text-charcoal border-b border-charcoal pb-1 text-xs tracking-[0.25em] font-light uppercase hover:text-wine hover:border-wine transition-all"
              >
                <span>DISCOVER OUR STORY</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
