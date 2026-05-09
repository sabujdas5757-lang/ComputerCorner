/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageSquare, Filter, LayoutGrid, List } from 'lucide-react';
import { PRODUCT_CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { useProducts } from '../contexts/ProductContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const getNumericPrice = (priceStr: string) => {
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function Catalog() {
  const { products: PRODUCTS } = useProducts();
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const usageParam = searchParams.get('usage');
  const hotSellingParam = searchParams.get('hotSelling');

  const [activeCategory, setActiveCategory] = useState(categorySlug || 'All');
  const [activeBrand, setActiveBrand] = useState('AllBrands');
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');
  const [categories, setCategories] = useState<string[]>([]);
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [firestoreBrands, setFirestoreBrands] = useState<string[]>([]);
  const [variousFilters, setVariousFilters] = useState<string[]>([]);
  const [activeVarious, setActiveVarious] = useState('All');
  
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const cats = snapshot.docs.map(doc => doc.data().name);
        setCategories(cats);
      } else {
        setCategories(DEFAULT_CATEGORIES.map(c => c.title));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'brands'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const b = snapshot.docs.map(doc => doc.data().name);
        setFirestoreBrands(b);
      } else {
        setFirestoreBrands([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'various_filters'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const filters = snapshot.docs.map(doc => doc.data().name);
        setVariousFilters(filters);
      } else {
        // Fallback to default if no dynamic filters exist
        setVariousFilters(['Student Usage', 'Gaming', 'Editing', 'Office Usage', 'MacBook']);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [categorySlug]);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) {
      setSearchQuery(s);
    }
  }, [searchParams]);

  const brands = useMemo(() => {
    // If we have brands in firestore, use them. Otherwise derive from products.
    let list: string[];
    if (firestoreBrands.length > 0) {
      list = firestoreBrands;
    } else {
      list = (Array.from(new Set(PRODUCTS.map(p => p.brand))) as string[]).sort();
    }

    // Filter out duplicates of different casing
    const seen = new Set();
    const unique = list.filter(b => {
      const lower = b.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

    return ['AllBrands', ...unique];
  }, [PRODUCTS, firestoreBrands]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const categoryMatch = activeCategory === 'All' || 
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
        activeCategory.toLowerCase().includes(p.category.toLowerCase());
      const brandMatch = activeBrand === 'AllBrands' || p.brand.toLowerCase() === activeBrand.toLowerCase();
      
      const price = getNumericPrice(p.price);
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Usage based filtering
      let usageMatch = true;
      if (usageParam) {
        const productTags = Array.isArray(p.usageTags) ? p.usageTags.map((t: string) => t.toLowerCase()) : [];
        if (usageParam === 'student') {
          usageMatch = productTags.includes('student usage');
        } else if (usageParam === 'gaming') {
          // In LaptopUsageHub, Gaming & Editing are grouped
          usageMatch = productTags.includes('gaming') || productTags.includes('editing');
        } else if (usageParam === 'office') {
          usageMatch = productTags.includes('office usage');
        } else if (usageParam === 'editing') {
          usageMatch = productTags.includes('editing');
        } else if (usageParam === 'macbook') {
          usageMatch = productTags.includes('macbook');
        }
      }

      // Hot Selling filtering
      const hotSellingMatch = hotSellingParam === 'true' ? !!p.isHotSelling : true;

      // Various filtering
      let variousMatch = true;
      if (activeVarious !== 'All') {
        const productTags = Array.isArray(p.usageTags) ? p.usageTags.map((t: string) => t.toLowerCase()) : [];
        variousMatch = productTags.includes(activeVarious.toLowerCase());
      }

      return categoryMatch && brandMatch && priceMatch && searchMatch && usageMatch && hotSellingMatch && variousMatch;
    });
  }, [activeCategory, activeBrand, priceRange, usageParam, searchQuery, hotSellingParam, activeVarious]);

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
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto pt-24 md:pt-32">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 border-b border-white/5 pb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="opacity-20">❯</span>
          <span className="text-primary">
            {hotSellingParam === 'true' ? 'Hot Selling Products' : (activeCategory === 'All' ? (searchQuery || 'Catalog') : activeCategory)}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
              {hotSellingParam === 'true' ? 'Hot Selling Products' : (activeCategory === 'All' ? (searchQuery || 'Catalog') : activeCategory)}
              <span className="text-xs font-medium text-gray-500 normal-case ml-4">
                (Showing {filteredProducts.length} of {PRODUCTS.length} products)
              </span>
            </h1>
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
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Filter by Category</span>
              <div className="flex flex-wrap gap-3">
                {['All', ...categories].map((cat) => (
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
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Filter by Various</span>
              <div className="flex flex-wrap gap-2">
                {['All', ...variousFilters].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveVarious(f)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                      activeVarious === f 
                        ? 'bg-primary border-primary text-bg-dark' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-6">Price Range (₹)</span>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase block mb-2">Min Price</label>
                  <input 
                    type="number" 
                    value={priceRange.min ?? 0}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-600 uppercase block mb-2">Max Price</label>
                  <input 
                    type="number" 
                    value={priceRange.max ?? 0}
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
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl group-hover:bg-primary group-hover:text-bg-dark transition-all text-[10px] font-black uppercase tracking-widest"
            >
              View Details
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
