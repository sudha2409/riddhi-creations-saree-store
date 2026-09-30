import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { mockInstagramImages } from '../mockData';

export default function Footer({ onSelectCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Accordion state for mobile
  const [openAccordion, setOpenAccordion] = useState({
    shop: false,
    about: false,
    care: false,
    connect: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#171515] text-[#FAF8F4] pt-20 pb-12 font-sans border-t border-[#2A2726] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 1 — BRAND STATEMENT */}
        <div className="text-center space-y-4 max-w-3xl mx-auto py-4">
          <h2 className="font-serif font-normal text-3xl sm:text-5xl tracking-[0.25em] text-[#FAF8F4] uppercase leading-tight">
            RIDDHI CREATIONS
          </h2>
          <span className="text-[10px] sm:text-[11px] tracking-[0.4em] font-light text-[#B5924E] uppercase block">
            SURAT HANDLOOM COUTURE
          </span>
          <p className="font-serif italic text-[#A39E93] text-sm sm:text-base font-light pt-2 max-w-xl mx-auto leading-relaxed">
            "Timeless Indian textiles, crafted for the modern woman."
          </p>
        </div>

        {/* SECTION 2 — NEWSLETTER */}
        <div className="max-w-md mx-auto text-center space-y-3 pb-8 border-b border-[#2A2726]">
          <h3 className="font-serif text-xs tracking-[0.25em] uppercase text-[#FAF8F4] font-normal">
            THE RIDDHI EDIT
          </h3>
          <p className="text-[12px] text-[#A39E93] font-light leading-relaxed">
            Be the first to discover new collections, handloom stories and exclusive edits.
          </p>
          <form onSubmit={handleSubscribe} className="pt-3">
            <div className="relative border-b border-[#4A4542] focus-within:border-[#FAF8F4] flex items-center transition-colors">
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-2 text-[11px] tracking-[0.15em] text-[#FAF8F4] placeholder:text-[#6E6861] font-light focus:outline-none uppercase"
              />
              <button 
                type="submit" 
                aria-label="Subscribe" 
                className="text-[#A39E93] hover:text-[#FAF8F4] transition-colors p-1 text-xs tracking-[0.2em] font-light flex items-center gap-1 uppercase"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.25]" />
              </button>
            </div>
            {subscribed && (
              <p className="text-[10px] text-[#B5924E] tracking-[0.2em] uppercase pt-2">
                Thank you for subscribing to The Riddhi Edit.
              </p>
            )}
          </form>
        </div>

        {/* SECTION 3 — FOOTER NAVIGATION (4 Clean Columns Desktop / Accordion Mobile) */}
        
        {/* DESKTOP 4 COLUMNS */}
        <div className="hidden md:grid grid-cols-4 gap-10 text-[13px] pt-4">
          
          {/* Column 1: SHOP */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-normal uppercase tracking-[0.2em] text-[#FAF8F4]">SHOP</h4>
            <ul className="space-y-2.5 text-[#A39E93] font-light">
              <li><button onClick={() => onSelectCategory('')} className="hover:text-[#FAF8F4] transition-colors">All Sarees</button></li>
              <li><button onClick={() => onSelectCategory('Moss')} className="hover:text-[#FAF8F4] transition-colors">Moss Sarees</button></li>
              <li><button onClick={() => onSelectCategory('Printed')} className="hover:text-[#FAF8F4] transition-colors">Printed Sarees</button></li>
              <li><button onClick={() => onSelectCategory('Exclusive')} className="hover:text-[#FAF8F4] transition-colors">Exclusive Edits</button></li>
              <li><button onClick={() => onSelectCategory('Festive')} className="hover:text-[#FAF8F4] transition-colors">Festive Drapes</button></li>
            </ul>
          </div>

          {/* Column 2: ABOUT */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-normal uppercase tracking-[0.2em] text-[#FAF8F4]">ABOUT</h4>
            <ul className="space-y-2.5 text-[#A39E93] font-light">
              <li><a href="#story" className="hover:text-[#FAF8F4] transition-colors">Our Story</a></li>
              <li><a href="#craft" className="hover:text-[#FAF8F4] transition-colors">Our Craft</a></li>
              <li><a href="#heritage" className="hover:text-[#FAF8F4] transition-colors">Handloom Heritage</a></li>
              <li><a href="#journal" className="hover:text-[#FAF8F4] transition-colors">Journal</a></li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER CARE */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-normal uppercase tracking-[0.2em] text-[#FAF8F4]">CUSTOMER CARE</h4>
            <ul className="space-y-2.5 text-[#A39E93] font-light">
              <li><a href="#contact" className="hover:text-[#FAF8F4] transition-colors">Contact Us</a></li>
              <li><a href="#shipping" className="hover:text-[#FAF8F4] transition-colors">Shipping & Delivery</a></li>
              <li className="text-[11px] text-[#B5924E] tracking-wider uppercase">Final Sale — No Return Policy</li>
              <li><a href="#faqs" className="hover:text-[#FAF8F4] transition-colors">FAQs</a></li>
              <li><a href="#track" className="hover:text-[#FAF8F4] transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Column 4: CONNECT */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-normal uppercase tracking-[0.2em] text-[#FAF8F4]">CONNECT</h4>
            <ul className="space-y-2.5 text-[#A39E93] font-light">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4] transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4] transition-colors">Facebook</a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4] transition-colors">Pinterest</a></li>
              <li><a href="https://wa.me/918770275989" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4] transition-colors">WhatsApp Concierge</a></li>
            </ul>
          </div>

        </div>

        {/* MOBILE ACCORDIONS */}
        <div className="md:hidden space-y-4 border-t border-[#2A2726] pt-4 text-xs font-light">
          
          {/* SHOP Accordion */}
          <div className="border-b border-[#2A2726] pb-3">
            <button 
              onClick={() => toggleAccordion('shop')}
              className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#FAF8F4] py-1"
            >
              <span>SHOP</span>
              <ChevronDown className={`w-4 h-4 text-[#A39E93] transform transition-transform ${openAccordion.shop ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion.shop && (
              <ul className="pt-3 space-y-2 text-[#A39E93] pl-2">
                <li><button onClick={() => onSelectCategory('')} className="hover:text-[#FAF8F4]">All Sarees</button></li>
                <li><button onClick={() => onSelectCategory('Moss')} className="hover:text-[#FAF8F4]">Moss Sarees</button></li>
                <li><button onClick={() => onSelectCategory('Printed')} className="hover:text-[#FAF8F4]">Printed Sarees</button></li>
                <li><button onClick={() => onSelectCategory('Exclusive')} className="hover:text-[#FAF8F4]">Exclusive Edits</button></li>
                <li><button onClick={() => onSelectCategory('Festive')} className="hover:text-[#FAF8F4]">Festive Drapes</button></li>
              </ul>
            )}
          </div>

          {/* ABOUT Accordion */}
          <div className="border-b border-[#2A2726] pb-3">
            <button 
              onClick={() => toggleAccordion('about')}
              className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#FAF8F4] py-1"
            >
              <span>ABOUT</span>
              <ChevronDown className={`w-4 h-4 text-[#A39E93] transform transition-transform ${openAccordion.about ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion.about && (
              <ul className="pt-3 space-y-2 text-[#A39E93] pl-2">
                <li><a href="#story" className="hover:text-[#FAF8F4]">Our Story</a></li>
                <li><a href="#craft" className="hover:text-[#FAF8F4]">Our Craft</a></li>
                <li><a href="#heritage" className="hover:text-[#FAF8F4]">Handloom Heritage</a></li>
                <li><a href="#journal" className="hover:text-[#FAF8F4]">Journal</a></li>
              </ul>
            )}
          </div>

          {/* CUSTOMER CARE Accordion */}
          <div className="border-b border-[#2A2726] pb-3">
            <button 
              onClick={() => toggleAccordion('care')}
              className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#FAF8F4] py-1"
            >
              <span>CUSTOMER CARE</span>
              <ChevronDown className={`w-4 h-4 text-[#A39E93] transform transition-transform ${openAccordion.care ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion.care && (
              <ul className="pt-3 space-y-2 text-[#A39E93] pl-2">
                <li><a href="#contact" className="hover:text-[#FAF8F4]">Contact Us</a></li>
                <li><a href="#shipping" className="hover:text-[#FAF8F4]">Shipping & Delivery</a></li>
                <li className="text-[11px] text-[#B5924E]">Final Sale — No Return Policy</li>
                <li><a href="#faqs" className="hover:text-[#FAF8F4]">FAQs</a></li>
                <li><a href="#track" className="hover:text-[#FAF8F4]">Track Order</a></li>
              </ul>
            )}
          </div>

          {/* CONNECT Accordion */}
          <div className="border-b border-[#2A2726] pb-3">
            <button 
              onClick={() => toggleAccordion('connect')}
              className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#FAF8F4] py-1"
            >
              <span>CONNECT</span>
              <ChevronDown className={`w-4 h-4 text-[#A39E93] transform transition-transform ${openAccordion.connect ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion.connect && (
              <ul className="pt-3 space-y-2 text-[#A39E93] pl-2">
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4]">Instagram</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4]">Facebook</a></li>
                <li><a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4]">Pinterest</a></li>
                <li><a href="https://wa.me/918770275989" target="_blank" rel="noreferrer" className="hover:text-[#FAF8F4]">WhatsApp Concierge</a></li>
              </ul>
            )}
          </div>

        </div>

        {/* SECTION 4 — SOCIAL / INSTAGRAM IMAGE STRIP */}
        <div className="pt-8 border-t border-[#2A2726] space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.3em] text-[#B5924E] font-light uppercase block">
              FOLLOW THE RIDDHI EDIT
            </span>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="font-serif text-sm sm:text-base tracking-[0.25em] text-[#FAF8F4] hover:text-[#B5924E] transition-colors block"
            >
              @RIDDHICOLLECTION
            </a>
          </div>

          {/* 6 Minimal Square Fashion Thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {mockInstagramImages.map((item) => (
              <div key={item.id} className="relative aspect-square overflow-hidden bg-[#242120] group cursor-pointer">
                <img 
                  src={item.image} 
                  alt="Riddhi Couture Edit" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 — FOOTER BOTTOM LEGAL BAR */}
        <div className="border-t border-[#2A2726] pt-8 text-[11px] text-[#787268] font-light tracking-[0.15em] uppercase flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RIDDHI CREATIONS. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6 text-[#A39E93]">
            <a href="#privacy" className="hover:text-[#FAF8F4] transition-colors">PRIVACY POLICY</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#FAF8F4] transition-colors">TERMS & CONDITIONS</a>
            <span>•</span>
            <a href="#shipping" className="hover:text-[#FAF8F4] transition-colors">SHIPPING POLICY</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

