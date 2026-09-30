import React from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF8F4] h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#E7E1D9]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E7E1D9] flex items-center justify-between bg-[#171717] text-[#FAF8F4]">
          <div className="flex items-center gap-2.5 font-serif font-normal text-base tracking-[0.18em] uppercase">
            <Heart className="w-4 h-4 text-[#B5924E] fill-[#B5924E]" />
            <span>My Wishlist ({wishlistProducts.length})</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-white transition-colors" aria-label="Close Wishlist">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-3 py-16">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E7E1D9] flex items-center justify-center text-stone-300 shadow-xs">
                <Heart className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg font-normal text-[#171717] tracking-wide">Your Wishlist is Empty</p>
              <p className="text-xs text-stone-500 font-light max-w-xs leading-relaxed">
                Save your favorite handloom sarees by clicking the heart icon while browsing our couture collection.
              </p>
              <button 
                onClick={onClose} 
                className="bg-[#171717] text-[#FAF8F4] font-serif text-xs uppercase tracking-[0.2em] px-6 py-3 border border-[#171717] hover:bg-[#7A1F2B] transition-colors shadow-sm"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            wishlistProducts.map((item) => (
              <div key={item.id} className="flex gap-4 p-3.5 bg-white border border-[#E7E1D9] relative group shadow-xs">
                <img 
                  src={item.image_url || item.image} 
                  alt={item.name} 
                  className="w-20 h-26 object-cover border border-stone-200 shrink-0" 
                />
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="font-sans font-normal text-xs sm:text-sm text-[#171717] line-clamp-2 leading-snug">{item.name}</h4>
                    <div className="font-sans font-bold text-[#171717] text-sm mt-1.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        onAddToCart(item);
                        onRemoveFromWishlist(item);
                      }}
                      className="bg-[#171717] text-[#FAF8F4] hover:bg-[#7A1F2B] text-[10px] uppercase font-serif tracking-wider px-3 py-1.5 flex items-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(item)}
                      className="text-stone-400 hover:text-red-600 p-1 text-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-[#E7E1D9] bg-white text-center">
            <button
              onClick={onClose}
              className="w-full bg-[#171717] text-[#FAF8F4] font-serif text-xs uppercase tracking-[0.2em] py-3.5 shadow-md hover:bg-[#7A1F2B] transition-all border border-[#171717] flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-[#B5924E]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
