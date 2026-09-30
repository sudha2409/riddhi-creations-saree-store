import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  activeCategory,
  setActiveCategory,
  onSelectCollection
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { label: 'ALL SAREES', value: '' },
    { label: 'MOSS PRINTED', value: 'Moss' },
    { label: 'COTTON SAREES', value: 'Cotton' },
    { label: 'SILK SAREES', value: 'Silk' },
    { label: 'FESTIVE', value: 'Festive' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4] border-b border-[#E7E1D9] transition-all duration-300">
      
      {/* LEVEL 1 — ANNOUNCEMENT BAR (34px tall, hidden on scroll) */}
      {!isScrolled && (
        <div className="bg-[#FAF8F4] border-b border-[#E7E1D9] text-[#171717] text-[10px] md:text-[11px] h-[34px] px-4 text-center tracking-[0.2em] font-light uppercase flex items-center justify-center gap-3">
          <span>RIDDHI CREATIONS • SURAT HANDLOOM COUTURE</span>
          <span className="text-[#C8C2B8] hidden sm:inline">|</span>
          <span className="hidden sm:inline text-[#6F6A64]">COMPLIMENTARY SHIPPING ACROSS INDIA</span>
        </div>
      )}

      {/* LEVEL 2 — MAIN HEADER (3-Column Layout: Left Search, Center Logo, Right Actions) */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* DESKTOP MAIN ROW */}
          <div className="hidden md:grid grid-cols-3 items-center">
            
            {/* LEFT: ⌕ SEARCH (Minimal Underline Input) */}
            <div className="flex items-center justify-start">
              <div className="relative flex items-center group w-48 lg:w-60">
                <Search className="w-4 h-4 text-[#171717] stroke-[1.25] absolute left-0" />
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchExpanded(true)}
                  onBlur={() => setSearchExpanded(false)}
                  className="w-full pl-6 pr-4 py-1 bg-transparent border-b border-[#E7E1D9] text-[11px] tracking-[0.2em] text-[#171717] placeholder:text-[#6F6A64] font-light focus:outline-none focus:border-[#171717] transition-colors uppercase"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-0 text-[9px] text-[#6F6A64] hover:text-[#171717] uppercase tracking-wider"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* CENTER: RIDDHI CREATIONS LOGO WORDMARK */}
            <div 
              className="flex flex-col items-center cursor-pointer group text-center" 
              onClick={() => setActiveCategory('')}
            >
              <h1 className="font-serif text-2xl md:text-3xl font-normal tracking-[0.25em] text-[#171717] leading-tight">
                RIDDHI CREATIONS
              </h1>
              <span className="text-[9px] tracking-[0.35em] text-[#6F6A64] font-light uppercase block pt-1">
                SURAT HANDLOOM COUTURE
              </span>
            </div>

            {/* RIGHT: ACCOUNT | ♡ WISHLIST | BAG (0) */}
            <div className="flex items-center justify-end space-x-6 text-[11px] tracking-[0.2em] font-light text-[#171717]">
              
              {/* Account */}
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 hover:text-[#7A1F2B] transition-colors uppercase"
                title="Account / Admin"
              >
                <User className="w-4 h-4 stroke-[1.25]" />
                <span>ACCOUNT</span>
              </button>

              {/* Wishlist */}
              <button 
                onClick={onOpenWishlist}
                className="flex items-center gap-1.5 cursor-pointer hover:text-[#7A1F2B] transition-colors uppercase"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[1.25]" />
                <span>WISHLIST {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
              </button>

              {/* Bag */}
              <button
                onClick={onOpenCart}
                className="flex items-center gap-1.5 hover:text-[#7A1F2B] transition-colors uppercase"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.25]" />
                <span>BAG ({cartCount})</span>
              </button>
            </div>

          </div>

          {/* MOBILE MAIN ROW */}
          <div className="md:hidden flex items-center justify-between py-1">
            
            {/* Mobile Left: Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#171717] hover:text-[#7A1F2B] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.25]" /> : <Menu className="w-5 h-5 stroke-[1.25]" />}
            </button>

            {/* Mobile Center: Logo */}
            <div 
              className="flex flex-col items-center cursor-pointer" 
              onClick={() => setActiveCategory('')}
            >
              <span className="font-serif text-xl font-normal tracking-[0.2em] text-[#171717]">
                RIDDHI
              </span>
              <span className="text-[8px] tracking-[0.3em] text-[#6F6A64] font-light uppercase">
                COUTURE
              </span>
            </div>

            {/* Mobile Right: Wishlist & Bag */}
            <div className="flex items-center space-x-4 text-[#171717]">
              <button onClick={onOpenWishlist} className="p-1 text-[#171717] hover:text-[#7A1F2B]" aria-label="Wishlist">
                <Heart className="w-4 h-4 stroke-[1.25]" />
              </button>
              <button 
                onClick={onOpenCart}
                className="text-[11px] tracking-[0.15em] font-light uppercase flex items-center gap-1"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.25]" />
                <span>({cartCount})</span>
              </button>
            </div>

          </div>

          {/* MOBILE SECOND ROW: SEARCH */}
          <div className="md:hidden pt-3 pb-1">
            <div className="relative flex items-center w-full">
              <Search className="w-3.5 h-3.5 text-[#6F6A64] stroke-[1.25] absolute left-0" />
              <input
                type="text"
                placeholder="SEARCH SAREES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-4 py-1 bg-transparent border-b border-[#E7E1D9] text-[11px] tracking-[0.15em] text-[#171717] placeholder:text-[#6F6A64] font-light focus:outline-none focus:border-[#171717] uppercase"
              />
            </div>
          </div>

        </div>
      </div>

      {/* LEVEL 3 — CATEGORY NAVIGATION (Desktop Horizontal Row) */}
      <div className="hidden md:block border-t border-[#E7E1D9]/70 py-3">
        <nav className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  if (cat.value === 'collections') {
                    onSelectCollection && onSelectCollection();
                  } else if (cat.value === 'new') {
                    setActiveCategory('');
                  } else {
                    setActiveCategory(cat.value);
                  }
                }}
                className={`relative py-1 text-[11px] lg:text-[12px] tracking-[0.18em] uppercase font-light transition-colors whitespace-nowrap ${
                  isActive ? 'text-[#171717] font-normal' : 'text-[#6F6A64] hover:text-[#171717]'
                }`}
              >
                <span>{cat.label}</span>
                {isActive ? (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#7A1F2B]" />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#171717] transition-all duration-200 group-hover:w-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* MOBILE CATEGORY NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E1D9] bg-[#FAF8F4] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3.5 text-left">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  if (cat.value === 'collections') {
                    onSelectCollection && onSelectCollection();
                  } else {
                    setActiveCategory(cat.value);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-[11px] tracking-[0.2em] uppercase py-1 transition-colors ${
                  activeCategory === cat.value ? 'text-[#7A1F2B] font-medium border-l-2 border-[#7A1F2B] pl-3' : 'text-[#171717] hover:text-[#7A1F2B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-left text-[11px] tracking-[0.2em] uppercase pt-4 text-[#6F6A64] border-t border-[#E7E1D9]"
            >
              ACCOUNT / ADMIN
            </button>
          </div>
        </div>
      )}

    </header>
  );
}

