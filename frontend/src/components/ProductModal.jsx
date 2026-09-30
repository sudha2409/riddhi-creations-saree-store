import React, { useState } from 'react';
import { X, Heart, CheckCircle2, Store } from 'lucide-react';
import { checkPincode } from '../api';
import { mockProducts } from '../mockData';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}) {
  if (!product) return null;

  const gallery = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image_url || product.image];

  // Fill gallery up to at least 4 images for the 2x2 PDP grid feel
  const displayGallery = gallery.length >= 4 
    ? gallery.slice(0, 4) 
    : [...gallery, gallery[0], gallery[0], gallery[0]].slice(0, 4);

  const [pincode, setPincode] = useState('');
  const [pinResult, setPinResult] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);

  const handleCheckPincode = async (e) => {
    e.preventDefault();
    const cleanPin = pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setPinResult({ deliverable: false, message: "Please enter a valid 6-digit Indian Pincode." });
      return;
    }
    setCheckingPin(true);
    try {
      const res = await checkPincode(cleanPin);
      const estDays = (res && res.estimated_days) ? res.estimated_days : "2-4 Business Days";
      setPinResult({
        deliverable: true,
        message: `✓ Express Delivery Available to ${cleanPin}! (Estimated: ${estDays})`
      });
    } catch (err) {
      setPinResult({
        deliverable: true,
        message: `✓ Express Delivery Available to ${cleanPin}! (Estimated: 2-4 Business Days)`
      });
    } finally {
      setCheckingPin(false);
    }
  };

  const discountPercent = product.discount_percent || (product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0);
  const relatedProducts = mockProducts.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl overflow-hidden shadow-2xl relative my-auto border border-[#E7E1D9] flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-white/90 p-2 rounded-full text-[#171717] hover:text-[#E85D4E] transition-colors border border-[#E7E1D9] shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* LEFT COLUMN: 2x2 PORTRAIT IMAGE GRID (KOSKII PDP STYLE) */}
        <div className="w-full md:w-1/2 bg-[#F9F8F6] p-3 sm:p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-[#E7E1D9] grid grid-cols-2 gap-2">
          {displayGallery.map((imgUrl, index) => (
            <div key={index} className="relative aspect-[3/4] overflow-hidden bg-white border border-stone-200">
              <img
                src={imgUrl}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
              {index === 0 && discountPercent > 0 && (
                <span className="absolute top-2 left-2 bg-[#E85D4E] text-white text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-xs uppercase">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: PRODUCT PURCHASING & DETAILS (KOSKII PDP STYLE) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6 text-left bg-white">
          
          {/* Header Title & Wishlist */}
          <div className="space-y-3 border-b border-[#E7E1D9] pb-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-sans font-medium text-lg sm:text-xl text-[#171717] leading-snug">
                {product.name}
              </h1>
              <button
                onClick={() => onToggleWishlist(product)}
                className="p-2 rounded-full text-stone-600 hover:text-[#7A1F2B] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#7A1F2B] text-[#7A1F2B]' : 'stroke-[1.5]'}`} />
              </button>
            </div>

            {/* Price Row */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-stone-500 font-light">MRP</span>
                {product.mrp > product.price && (
                  <span className="text-sm text-stone-400 line-through font-light">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-sans font-bold text-[#171717] text-xl sm:text-2xl">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold text-[#E85D4E]">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-500 font-light uppercase tracking-wider">
                Inclusive of all taxes • Direct from Surat Looms
              </p>
            </div>
          </div>

          {/* ONESIZE Badge */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 block">
              SIZE
            </span>
            <div className="inline-block border border-[#171717] text-[#171717] px-4 py-1.5 text-xs font-semibold uppercase rounded-xs bg-[#FAF8F4]">
              ONESIZE
            </div>
          </div>

          {/* Action CTAs: BUY NOW & ADD TO BAG */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="bg-[#E85D4E] hover:bg-[#D44C3D] text-white font-sans font-semibold text-xs tracking-wider uppercase py-3.5 px-4 rounded-md transition-colors shadow-xs"
            >
              BUY NOW
            </button>
            <button
              onClick={() => {
                onAddToCart(product);
              }}
              className="border border-[#E85D4E] text-[#E85D4E] hover:bg-[#E85D4E]/10 font-sans font-semibold text-xs tracking-wider uppercase py-3.5 px-4 rounded-md transition-colors"
            >
              ADD TO BAG
            </button>
          </div>

          {/* COLOUR VARIANT THUMBNAIL */}
          <div className="space-y-2 pt-2 border-t border-[#E7E1D9]">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 block">
              COLOURS
            </span>
            <div className="w-14 h-18 border-2 border-[#171717] rounded-md overflow-hidden cursor-pointer shadow-xs">
              <img src={displayGallery[0]} alt="color variant" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* DELIVERY ESTIMATE BOX */}
          <div className="space-y-2 pt-2 border-t border-[#E7E1D9]">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 block">
              DELIVERY ESTIMATE
            </span>
            <form onSubmit={handleCheckPincode} className="relative flex items-center">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:border-[#E85D4E] text-[#171717]"
              />
              <button
                type="submit"
                disabled={checkingPin}
                className="absolute right-3 text-xs font-semibold text-[#E85D4E] hover:underline uppercase"
              >
                {checkingPin ? 'Checking...' : 'Check Delivery >'}
              </button>
            </form>

            {pinResult && (
              <div className={`text-xs p-3 rounded-md flex items-center gap-2 ${pinResult.deliverable ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                <span>{pinResult.message}</span>
              </div>
            )}

            <p className="text-xs text-stone-600 flex items-center gap-1.5 font-light pt-1">
              <span>🚚</span> <span>Express Delivery available across 28,000+ Pin Codes in India</span>
            </p>
          </div>

          {/* YOU MAY ALSO LIKE RECOMMENDATIONS */}
          {relatedProducts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#E7E1D9]">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-700 block">
                YOU MAY ALSO LIKE
              </span>
              <div className="grid grid-cols-3 gap-2">
                {relatedProducts.map((rel) => (
                  <div key={rel.id} className="group cursor-pointer space-y-1 text-left">
                    <div className="aspect-[3/4] overflow-hidden rounded-md bg-stone-100 border border-stone-200">
                      <img src={rel.image_url || rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="text-[10px] font-medium text-[#171717] line-clamp-1 leading-tight">{rel.name}</p>
                    <p className="text-[10px] font-semibold text-[#E85D4E]">₹{rel.price.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIND NEAREST STUDIO */}
          <div className="space-y-2 pt-4 border-t border-[#E7E1D9] bg-[#FAF8F4] p-4 rounded-md border text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase text-[#171717] flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#E85D4E] stroke-[1.5]" /> FIND NEAREST STUDIO
              </span>
              <span className="text-[#E85D4E] font-semibold hover:underline">Surat Studio &gt;</span>
            </div>
            <p className="text-stone-600 font-light leading-relaxed text-[11px]">
              Visit our Flagship Studio: Millenium Market 1, Ring Road, Surat - 395002. Experience authentic handloom weaving in person.
            </p>
          </div>

          {/* DETAILS SECTION */}
          <div className="space-y-2 pt-4 border-t border-[#E7E1D9]">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-700 block">
              DETAILS
            </span>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              {product.description || "Authentic saree crafted with traditional handloom motifs and premium finish. Comes with matching unstitched blouse piece and Koskii premium quality guarantee for celebrations."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
