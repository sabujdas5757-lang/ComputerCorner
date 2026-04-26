/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingCart, MessageSquare, Filter, LayoutGrid, List } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants';
import { useProducts } from '../contexts/ProductContext';

const getNumericPrice = (priceStr: string) => {
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function Catalog() {
  const { products: PRODUCTS } = useProducts();
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const usageParam = searchParams.get('usage');

  const [activeCategory, setActiveCategory] = useState(categorySlug || 'All');
  const [activeBrand, setActiveBrand] = useState('AllBrands');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });

  React.useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [categorySlug]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
    return ['AllBrands', ...uniqueBrands];
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const categoryMatch = activeCategory === 'All' || 
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
        activeCategory.toLowerCase().includes(p.category.toLowerCase());
      const brandMatch = activeBrand === 'AllBrands' || p.brand === activeBrand;
      
      const price = getNumericPrice(p.price);
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Usage based filtering
      let usageMatch = true;
      if (usageParam && p.category === 'Laptops') {
        const name = p.name.toLowerCase();
        const discount = (p.discount || '').toLowerCase();

        if (usageParam === 'student') {
          usageMatch = discount.includes('student') || discount.includes('budget') || name.includes('vivobook') || name.includes('ideapad');
        } else if (usageParam === 'gaming') {
          usageMatch = name.includes('gaming') || name.includes('rog') || name.includes('tuf') || name.includes('victus');
        } else if (usageParam === 'office') {
          usageMatch = (name.includes('inspiron') || name.includes('pavilion') || discount.includes('professional')) && p.brand !== 'APPLE';
        } else if (usageParam === 'macbook') {
          usageMatch = p.brand === 'APPLE';
        }
      }

      return categoryMatch && brandMatch && priceMatch && searchMatch && usageMatch;
    });
  }, [activeCategory, activeBrand, priceRange, usageParam, searchQuery]);

  const groupedProducts = useMemo(() => {
    if (viewMode !== 'grouped') return [];
    const groups: Record<string, typeof PRODUCTS> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.brand]) groups[p.brand] = [];
      groups[p.brand].push(p);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredProducts, viewMode]);

  return (
    <div className="min-h-screen bg-bg-dark text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto pt-24 md:pt-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Back to Home</span>
            </Link>
            <h1 className="text-5xl font-bold tracking-tight">Full Products <span className="text-gray-500 italic">Catalog.</span></h1>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'grouped' : 'grid')}
              className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              {viewMode === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
              {viewMode === 'grid' ? 'Group by Brand' : 'Show Grid'}
            </button>
            <a 
              href="https://wa.me/917501090919" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-4 bg-primary text-bg-dark rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-glow"
            >
              <MessageSquare size={18} fill="currentColor" />
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 bg-white/5 border border-white/10 rounded-[32px] p-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Search Catalog</span>
              <input 
                type="text" 
                placeholder="Search by name, brand or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Filter by Category</span>
              <div className="flex flex-wrap gap-3">
                {['All', ...PRODUCT_CATEGORIES.map(c => c.title)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      activeCategory === cat 
                        ? 'bg-primary border-primary text-bg-dark' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Filter by Brand</span>
              <div className="flex flex-wrap gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      activeBrand === brand 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {brand === 'AllBrands' ? 'All Brands' : brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Price Range (₹)</span>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase block mb-2">Min Price</label>
                  <input 
                    type="number" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase block mb-2">Max Price</label>
                  <input 
                    type="number" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[5000, 15000, 30000, 50000, 100000].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPriceRange(prev => ({ ...prev, max: p }))}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-400"
                  >
                    Under {p.toLocaleString()}
                  </button>
                ))}
                <button 
                  onClick={() => setPriceRange({ min: 0, max: 200000 })}
                  className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-primary"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="grouped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24"
            >
              {groupedProducts.map(([brand, products]) => (
                <div key={brand}>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black tracking-tight">{brand}</h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-xs font-bold text-gray-500">{products.length} Products</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[40px]">
            <Filter size={48} className="mx-auto text-gray-700 mb-6" />
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}

        {/* Help Banner */}
        <div className="mt-24 p-12 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[40px] text-center">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            We have a huge inventory in our physical shop that might not be listed here yet. 
            Contact us for specific requirements.
          </p>
          <a 
            href="tel:8167489332"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-bg-dark rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-light transition-all"
          >
            Call our Shop
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: any; index: number; key?: React.Key }) {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden hover:border-primary/30 transition-all h-full flex flex-col"
      >
        <div className="relative aspect-square overflow-hidden bg-white/5">
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
          {product.discount && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-full">
              {product.discount}
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
            {product.brand} • {product.category}
          </div>
          <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
            <div className="flex flex-col">
              <span className="text-xl font-black text-white leading-tight">{product.price.split(' The')[0]}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-1">
                The price may be higher or lower
              </span>
              {product.oldPrice && (
                <span className="block text-xs text-gray-600 line-through font-bold mt-1">{product.oldPrice}</span>
              )}
            </div>
            <div 
              className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-primary group-hover:text-bg-dark transition-all"
            >
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
