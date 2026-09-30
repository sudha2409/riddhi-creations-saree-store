import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ShopCollections from './components/ShopCollections';
import ShopOccasions from './components/ShopOccasions';
import BrandStory from './components/BrandStory';
import InstagramFeed from './components/InstagramFeed';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { fetchProducts, fetchFilterOptions } from './api';
import { mockProducts } from './mockData';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ fabrics: [], occasions: [], colors: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const [filters, setFilters] = useState({
    fabric: '',
    occasion: '',
    color: '',
    min_price: 0,
    max_price: 50000,
    sort_by: 'popular'
  });

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const catalogRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, activeCategory, filters]);

  const loadFilterOptions = async () => {
    try {
      const data = await fetchFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterMockProducts = (allProducts, params) => {
    let list = [...allProducts];
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.fabric.toLowerCase().includes(s)
      );
    }
    if (params.category) {
      const cat = params.category.toLowerCase();
      list = list.filter(p =>
        p.category.toLowerCase().includes(cat) ||
        p.fabric.toLowerCase().includes(cat) ||
        p.occasion.toLowerCase().includes(cat)
      );
    }
    if (params.fabric) {
      const fab = params.fabric.toLowerCase();
      list = list.filter(p => p.fabric.toLowerCase().includes(fab));
    }
    if (params.occasion) {
      const occ = params.occasion.toLowerCase();
      list = list.filter(p => p.occasion.toLowerCase().includes(occ));
    }
    if (params.color) {
      list = list.filter(p => p.color.toLowerCase() === params.color.toLowerCase());
    }
    if (params.min_price) {
      list = list.filter(p => p.price >= params.min_price);
    }
    if (params.max_price && params.max_price < 50000) {
      list = list.filter(p => p.price <= params.max_price);
    }
    return list;
  };

  const loadProducts = async () => {
    setLoading(true);
    const queryParams = {
      search: searchTerm,
      category: activeCategory,
      fabric: filters.fabric,
      occasion: filters.occasion,
      color: filters.color,
      min_price: filters.min_price,
      max_price: filters.max_price,
      sort_by: filters.sort_by
    };
    try {
      const data = await fetchProducts(queryParams);
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts(filterMockProducts(mockProducts, queryParams));
      }
    } catch (err) {
      console.error(err);
      setProducts(filterMockProducts(mockProducts, queryParams));
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory('');
    setFilters({
      fabric: '',
      occasion: '',
      color: '',
      min_price: 0,
      max_price: 50000,
      sort_by: 'popular'
    });
    showToast('Filters reset to default');
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to your shopping bag!`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast('Removed from wishlist');
      } else {
        next.add(product.id);
        showToast('Saved to your wishlist!');
      }
      return next;
    });
  };

  const handleProceedToCheckout = (total, discount) => {
    setCheckoutTotal(total);
    setCheckoutDiscount(discount);
    setCheckoutOpen(true);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products for New Arrivals & Bestsellers sections
  const newArrivals = products.filter(p => p.is_new).slice(0, 4);
  const bestSellers = products.filter(p => p.is_bestseller).slice(0, 4);

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between font-sans selection:bg-wine selection:text-canvas text-charcoal">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-canvas font-serif text-xs px-5 py-3 shadow-2xl flex items-center gap-2 border border-subtle tracking-wider animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-gold stroke-1" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. THREE-LAYER FASHION HEADER */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartCount}
        wishlistCount={wishlist.size}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        activeCategory={activeCategory}
        setActiveCategory={handleSelectCategory}
        onSelectCollection={() => {
          if (catalogRef.current) {
            catalogRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* MAIN SAREE COLLECTION PAGE (KOSKII COLLECTIONS/SAREES STYLE) */}
      <main className="flex-1">

        {/* 9. MAIN SAREE COLLECTION CATALOG & FACETED FILTERS */}
        {/* 9. MAIN SAREE COLLECTION CATALOG & FACETED FILTERS */}
        <div ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
          
          {/* Collection Header & Breadcrumb (Libas Style) */}
          <div className="border-b border-stone-200 pb-6 mb-8 space-y-2">
            <div className="text-xs text-stone-500 font-light tracking-wide flex items-center gap-1.5">
              <span className="hover:text-stone-800 cursor-pointer" onClick={() => handleSelectCategory('')}>Home</span> 
              <span>/</span> 
              <span className="text-stone-900 font-medium">Sarees for Women</span>
            </div>
            
            <div className="pt-2">
              <h1 className="font-serif font-normal text-2xl sm:text-3xl text-stone-900 tracking-wide uppercase">
                {activeCategory ? `${activeCategory} Sarees` : 'Sarees for Women'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light tracking-wide max-w-3xl mt-1.5 leading-relaxed">
                Explore Riddhi Creations' handloom saree couture — crafted in Surat with pure zari, rich silk drapes, and traditional Indian motifs.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Faceted Filters Sidebar */}
            <Filters
              filters={filters}
              setFilters={setFilters}
              filterOptions={filterOptions}
              onResetFilters={handleResetFilters}
              totalResults={products.length}
            />

            {/* Right Main Product Grid */}
            <div className="flex-1 space-y-6">
              
              {/* Active Filter Indicators & Top Sort Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div className="text-xs text-stone-600 font-medium tracking-wider uppercase">
                  <span>{products.length} PRODUCTS</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-light uppercase tracking-wider">SORT:</span>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
                    className="bg-white border border-stone-300 text-xs text-stone-800 py-1.5 px-3 focus:outline-none focus:border-stone-600"
                  >
                    <option value="popular">FEATURED</option>
                    <option value="price_low_high">PRICE: LOW TO HIGH</option>
                    <option value="price_high_low">PRICE: HIGH TO LOW</option>
                    <option value="newest">NEW ARRIVALS</option>
                  </select>
                </div>
              </div>

              {(activeCategory || filters.fabric || filters.occasion || filters.color || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 bg-stone-50 p-3 border border-stone-200 text-xs">
                  <span className="font-medium text-stone-500 uppercase tracking-wider text-[10px]">ACTIVE FILTERS:</span>
                  {activeCategory && <span className="bg-white border border-stone-300 text-stone-800 px-2.5 py-0.5 text-[11px] font-medium">Category: {activeCategory}</span>}
                  {filters.fabric && <span className="bg-white border border-stone-300 text-stone-800 px-2.5 py-0.5 text-[11px] font-medium">Fabric: {filters.fabric}</span>}
                  {filters.occasion && <span className="bg-white border border-stone-300 text-stone-800 px-2.5 py-0.5 text-[11px] font-medium">Occasion: {filters.occasion}</span>}
                  {filters.color && <span className="bg-white border border-stone-300 text-stone-800 px-2.5 py-0.5 text-[11px] font-medium">Color: {filters.color}</span>}
                  {searchTerm && <span className="bg-white border border-stone-300 text-stone-800 px-2.5 py-0.5 text-[11px] font-medium">Search: "{searchTerm}"</span>}
                  <button onClick={handleResetFilters} className="text-[#7A1F2B] font-semibold uppercase tracking-wider text-[10px] hover:underline ml-auto">CLEAR ALL</button>
                </div>
              )}

              {/* Product Grid (3 Per Row Desktop / 2 Per Row Mobile - Libas Style) */}
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} className="bg-stone-200/50 animate-pulse aspect-[3/4] border border-stone-200" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white p-12 text-center border border-stone-200 space-y-4 my-8">
                  <Sparkles className="w-10 h-10 text-amber-600 mx-auto stroke-1" />
                  <h3 className="font-serif font-normal text-xl text-stone-900 tracking-wide">No Sarees Found Matching Your Filters</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto font-light">Try adjusting your filter selection or search terms to view our full handloom couture collection.</p>
                  <button onClick={handleResetFilters} className="bg-stone-900 text-white font-sans text-xs uppercase tracking-widest px-6 py-3 border border-stone-900">
                    RESET ALL FILTERS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      isWishlisted={wishlist.has(p.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                      onOpenProductModal={(product) => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* Product Specification Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.has(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Slide-out Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProducts={products.filter(p => wishlist.has(p.id))}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        totalAmount={checkoutTotal}
        discountApplied={checkoutDiscount}
        onClearCart={() => setCart([])}
      />

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* 10. LARGE PREMIUM FASHION FOOTER */}
      <Footer onSelectCategory={handleSelectCategory} />

    </div>
  );
}
