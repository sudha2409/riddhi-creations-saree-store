import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal
}) {
  const [isHovered, setIsHovered] = useState(false);

  const rawImg = (isHovered && product.hover_image) ? product.hover_image : (product.image_url || product.image);
  const displayImage = (rawImg && rawImg.startsWith('/')) ? `.${rawImg}` : rawImg;
  const discountPercent = product.discount_percent || (product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0);
  const mrpVal = product.mrp || Math.round(product.price * 2.5);

  return (
    <div 
      className="group relative bg-white flex flex-col transition-all duration-300 hover:shadow-lg cursor-pointer text-left border border-stone-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenProductModal(product)}
    >
      {/* 1. DOMINANT 3:4 PORTRAIT IMAGE CONTAINER */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
        />
        




        {/* Bottom-Right Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute bottom-2.5 right-2.5 p-2 text-stone-700 hover:text-[#7A1F2B] transition-all z-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs shadow-md border border-stone-100"
          aria-label="Wishlist item"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#7A1F2B] text-[#7A1F2B]' : 'stroke-[1.5]'}`} />
        </button>
      </div>

      {/* 2. PRODUCT INFORMATION AREA */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white space-y-1.5">
        {/* Saree Name */}
        <h3 className="font-sans font-normal text-stone-800 text-xs sm:text-sm line-clamp-2 hover:text-[#7A1F2B] transition-colors leading-snug tracking-wide">
          {product.name}
        </h3>

        {/* Pricing Row: MRP strikethrough + Price + Discount % */}
        <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
          <span className="text-xs text-stone-400 line-through font-light">
            ₹{mrpVal.toLocaleString('en-IN')}
          </span>
          <span className="font-sans font-bold text-stone-900 text-sm sm:text-base">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {discountPercent > 0 && (
            <span className="text-xs font-semibold text-[#E85D4E]">
              ({discountPercent}% OFF)
            </span>
          )}
        </div>

        {/* Bottom row: Size Tag & Quick Add to Bag button */}
        <div className="flex items-center justify-between pt-1 text-[11px] border-t border-stone-100 mt-1">
          <span className="text-stone-500 font-medium tracking-wider uppercase">
            SIZE: <span className="text-stone-800 font-semibold">{product.size || 'ONESIZE'}</span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="text-xs font-semibold text-[#7A1F2B] hover:text-[#5a1620] uppercase tracking-wider flex items-center gap-1 transition-colors py-1 px-2 rounded hover:bg-stone-50"
            title="Add to Shopping Bag"
            aria-label="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        </div>

      </div>

    </div>
  );
}


