import React, { useState } from 'react';
import { SlidersHorizontal, RefreshCw, Check, Plus, Minus } from 'lucide-react';

export default function Filters({
  filters,
  setFilters,
  filterOptions,
  onResetFilters,
  totalResults
}) {
  const [openSections, setOpenSections] = useState({
    SIZE: true,
    COLORS: true,
    CATEGORY: true,
    FABRIC: true,
    OCCASION: true,
    PRICE: true,
    PATTERN: false,
    STYLE: false,
    SLEEVE: false,
    NECK: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const fabrics = filterOptions.fabrics || ['Moss', 'Moss Silk', 'Silk Blend'];
  const occasions = filterOptions.occasions || ['Festive', 'Everyday Elegance', 'Traditional', 'Party'];
  const colors = filterOptions.colors || ['Pink', 'Magenta', 'Gold'];
  const categories = ['Printed Sarees', 'Moss Sarees', 'Exclusive Sarees'];
  const patterns = ['Golden Zari Border', 'Bandhani Print', 'Ethnic Motifs'];
  const styles = ['Traditional', 'Contemporary', 'Surat Handloom'];

  const handleFabricToggle = (fab) => {
    setFilters(prev => ({ ...prev, fabric: prev.fabric === fab ? '' : fab }));
  };

  const handleOccasionToggle = (occ) => {
    setFilters(prev => ({ ...prev, occasion: prev.occasion === occ ? '' : occ }));
  };

  const handleColorToggle = (c) => {
    setFilters(prev => ({ ...prev, color: prev.color === c ? '' : c }));
  };

  return (
    <aside className="hidden lg:block lg:w-64 bg-white p-5 border border-stone-200 space-y-4 self-start sticky top-28 text-left shadow-2xs">
      
      {/* Libas Filter Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm tracking-wider uppercase">
          <SlidersHorizontal className="w-4 h-4 text-stone-700" />
          <span>FILTER</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-semibold text-[#7A1F2B] hover:underline flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>CLEAR ALL</span>
        </button>
      </div>

      <div className="divide-y divide-stone-200">

        {/* 1. SIZE ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('SIZE')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>SIZE</span>
            {openSections.SIZE ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.SIZE && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs border border-stone-300 font-medium bg-stone-50 text-stone-800">
                ONESIZE
              </span>
            </div>
          )}
        </div>

        {/* 2. COLORS ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('COLORS')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>COLORS</span>
            {openSections.COLORS ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.COLORS && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {colors.map((col) => (
                <button
                  key={col}
                  onClick={() => handleColorToggle(col)}
                  className={`px-2.5 py-1 text-[11px] font-medium border transition-all rounded-xs ${
                    filters.color === col
                      ? 'border-[#7A1F2B] text-[#7A1F2B] bg-rose-50 font-semibold'
                      : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. CATEGORY ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('CATEGORY')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>CATEGORY</span>
            {openSections.CATEGORY ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.CATEGORY && (
            <div className="mt-2.5 space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFabricToggle(cat)}
                  className="w-full text-left py-1 text-xs text-stone-600 hover:text-stone-900 font-normal tracking-wide flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. FABRIC ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('FABRIC')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>FABRIC</span>
            {openSections.FABRIC ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.FABRIC && (
            <div className="mt-2.5 space-y-1 max-h-48 overflow-y-auto pr-1">
              {fabrics.map((fab) => (
                <button
                  key={fab}
                  onClick={() => handleFabricToggle(fab)}
                  className={`w-full text-left py-1 px-1 text-xs flex items-center justify-between transition-colors font-normal ${
                    filters.fabric === fab
                      ? 'text-[#7A1F2B] font-semibold bg-rose-50/60 rounded-xs px-2'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>{fab}</span>
                  {filters.fabric === fab && <Check className="w-3 h-3 text-[#7A1F2B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. OCCASION ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('OCCASION')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>OCCASION</span>
            {openSections.OCCASION ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.OCCASION && (
            <div className="mt-2.5 space-y-1">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  onClick={() => handleOccasionToggle(occ)}
                  className={`w-full text-left py-1 px-1 text-xs flex items-center justify-between transition-colors font-normal ${
                    filters.occasion === occ
                      ? 'text-[#7A1F2B] font-semibold bg-rose-50/60 rounded-xs px-2'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>{occ}</span>
                  {filters.occasion === occ && <Check className="w-3 h-3 text-[#7A1F2B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. PATTERN AND PRINT ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('PATTERN')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>PATTERN AND PRINT</span>
            {openSections.PATTERN ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.PATTERN && (
            <div className="mt-2.5 space-y-1">
              {patterns.map((pat) => (
                <div key={pat} className="py-1 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-xs border-stone-300 text-[#7A1F2B] focus:ring-0" />
                  <span>{pat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. PRICE ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('PRICE')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>PRICE</span>
            {openSections.PRICE ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.PRICE && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-700 font-medium">
                <span>Range:</span>
                <span>₹0 - ₹{(filters.max_price || 50000).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={filters.max_price || 50000}
                onChange={(e) => setFilters(prev => ({ ...prev, max_price: Number(e.target.value) }))}
                className="w-full accent-[#7A1F2B] bg-stone-200 h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-light">
                <span>₹0</span>
                <span>₹25,000</span>
                <span>₹50,000+</span>
              </div>
            </div>
          )}
        </div>

        {/* 8. STYLE ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('STYLE')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>STYLE</span>
            {openSections.STYLE ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.STYLE && (
            <div className="mt-2.5 space-y-1">
              {styles.map((st) => (
                <div key={st} className="py-1 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-xs border-stone-300 text-[#7A1F2B] focus:ring-0" />
                  <span>{st}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 9. SLEEVE LENGTH ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('SLEEVE')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>SLEEVE LENGTH</span>
            {openSections.SLEEVE ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.SLEEVE && (
            <div className="mt-2.5 text-xs text-stone-600 space-y-1">
              <div className="py-1">Unstitched Running Blouse</div>
              <div className="py-1">Matching Contrast Piece</div>
            </div>
          )}
        </div>

        {/* 10. NECK ACCORDION */}
        <div className="py-3">
          <button 
            onClick={() => toggleSection('NECK')}
            className="w-full flex items-center justify-between font-semibold text-xs tracking-wider uppercase text-stone-800 hover:text-stone-900"
          >
            <span>NECK</span>
            {openSections.NECK ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
          {openSections.NECK && (
            <div className="mt-2.5 text-xs text-stone-600 space-y-1">
              <div className="py-1">Custom Tailored Neckline</div>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
}
