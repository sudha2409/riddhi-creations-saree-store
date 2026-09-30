import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Sparkles, ShieldAlert } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;
  
  const freeShippingThreshold = 3000;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = coupon.trim().toUpperCase();
    if (code === 'RIDDHI10' || code === 'ROYAL10') {
      setDiscountPercent(10);
      setCouponSuccess(`Promo Code ${code} Applied! Saved 10%`);
    } else if (code === 'BRIDAL15') {
      setDiscountPercent(15);
      setCouponSuccess('Promo Code BRIDAL15 Applied! Saved 15%');
    } else {
      setCouponError('Invalid Coupon Code. Try RIDDHI10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-canvas h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-subtle">
        
        {/* Header */}
        <div className="p-5 border-b border-subtle flex items-center justify-between bg-obsidian text-canvas">
          <div className="flex items-center gap-2.5 font-serif font-normal text-base tracking-[0.18em] uppercase">
            <ShoppingBag className="w-4 h-4 text-champagne-400" />
            <span>Shopping Bag ({cartItems.length})</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-canvas transition-colors" aria-label="Close Bag">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-white px-5 py-3 border-b border-subtle text-xs text-obsidian font-light">
          {freeShippingLeft > 0 ? (
            <p className="tracking-wide">Add <strong className="font-medium text-obsidian">₹{freeShippingLeft.toLocaleString('en-IN')}</strong> more for <strong className="font-medium text-champagne-600">FREE Express Shipping</strong></p>
          ) : (
            <p className="font-medium text-champagne-600 flex items-center gap-1.5 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-champagne-500" /> Complimentary Express Shipping Unlocked
            </p>
          )}
          <div className="w-full bg-stone-100 h-1 mt-2 overflow-hidden">
            <div className="bg-champagne-500 h-full transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-3 py-12">
              <ShoppingBag className="w-12 h-12 text-stone-300" />
              <p className="font-serif text-lg font-normal text-obsidian tracking-wide">Your Shopping Bag is empty</p>
              <p className="text-xs text-muted font-light max-w-xs">Explore our luxury sarees and add your favorites to your bag.</p>
              <button onClick={onClose} className="bg-obsidian text-champagne-400 font-serif text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-full border border-champagne-500/30">
                Browse Collection
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white border border-subtle relative group">
                <img src={item.image_url} alt={item.name} className="w-20 h-24 object-cover border border-subtle shrink-0" />
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="font-serif font-normal text-sm text-obsidian line-clamp-1 tracking-wide">{item.name}</h4>
                    <span className="text-[9px] text-champagne-600 font-medium uppercase tracking-widest">{item.category}</span>
                    <div className="font-serif font-medium text-obsidian text-sm mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-subtle bg-canvas">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 text-obsidian hover:text-champagne-600">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-medium text-obsidian">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 text-obsidian hover:text-champagne-600">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button onClick={() => onRemoveItem(item.id)} className="text-stone-400 hover:text-obsidian text-xs flex items-center gap-1 font-light">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-subtle bg-white space-y-4">
            
            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-subtle pt-3 font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-medium text-obsidian">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-champagne-600">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-base font-serif font-medium text-obsidian border-t border-subtle pt-2.5">
                <span>Total Amount</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onProceedToCheckout(subtotal, 0);
                onClose();
              }}
              className="w-full bg-obsidian text-canvas font-serif text-xs uppercase tracking-[0.2em] py-4 rounded-full shadow-lg hover:bg-champagne-500 hover:text-obsidian transition-all flex items-center justify-center gap-2 border border-champagne-500/30 transform active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-champagne-400" />
            </button>
            <p className="text-[10px] text-muted text-center font-light uppercase tracking-wider">Final Sale • Strictly No Returns or Exchanges</p>

          </div>
        )}

      </div>
    </div>
  );
}

