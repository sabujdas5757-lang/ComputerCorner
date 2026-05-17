/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, LayoutGrid, List, ChevronDown, MessageSquare, X } from 'lucide-react';
import { PRODUCT_CATEGORIES as DEFAULT_CATEGORIES } from '../constants';
import { useProducts } from '../contexts/ProductContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

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

  const [sortOrder, setSortOrder] = useState('Relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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
    let list: string[];
    if (firestoreBrands.length > 0) {
      list = firestoreBrands;
    } else {
      list = (Array.from(new Set(PRODUCTS.map(p => p.brand))) as string[]).sort();
    }

    const seen = new Set();
    const unique = list.filter(b => {
      const lower = b.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

    return ['AllBrands', ...unique];
  }, [PRODUCTS, firestoreBrands]);

  const clearAllFilters = () => {
    setActiveCategory('All');
    setActiveBrand('AllBrands');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 200000 });
    setSortOrder('Relevance');
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const categoryMatch = activeCategory === 'All' || 
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
        activeCategory.toLowerCase().includes(p.category.toLowerCase());
      const brandMatch = activeBrand === 'AllBrands' || p.brand.toLowerCase() === activeBrand.toLowerCase();
      
      const price = getNumericPrice(p.price);
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());

      let usageMatch = true;
      if (usageParam) {
        const productTags = Array.isArray(p.usageTags) ? p.usageTags.map((t: string) => t.trim().toLowerCase()) : [];
        usageMatch = productTags.includes(usageParam.trim().toLowerCase());
      }

      const hotSellingMatch = hotSellingParam === 'true' ? !!p.isHotSelling : true;

      return categoryMatch && brandMatch && priceMatch && searchMatch && usageMatch && hotSellingMatch;
    });

    if (sortOrder === 'Price: Low to High') {
      result = result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortOrder === 'Price: High to Low') {
      result = result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortOrder === 'Newest First') {
      // Assuming products later in array are newer, or they have an id. We'll use id as fallback.
      result = result.sort((a, b) => (b.id?.localeCompare(a.id || '') || 0));
    }

    return result;
  }, [activeCategory, activeBrand, priceRange, usageParam, searchQuery, hotSellingParam, PRODUCTS, sortOrder]);

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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>
      
      <main className="flex-1 w-full pt-16 md:pt-20 pb-20 px-4 md:px-6">
        <div className="w-full max-w-[1920px] mx-auto">
          {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-gray-500 mb-3">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="opacity-40">❯</span>
          <span className="text-white capitalize">
            {hotSellingParam === 'true' ? 'Hot Selling' : (activeCategory === 'All' ? 'Catalog' : activeCategory)}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Mobile Filter Toggle */}
          {isFiltersOpen && (
             <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setIsFiltersOpen(false)} />
          )}
          {/* Left Sidebar Filters */}
          <div className={`fixed inset-y-0 left-0 w-[280px] bg-[#0A0A0A] border-r border-white/10 p-6 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64 lg:shrink-0 lg:bg-[#151515] lg:border lg:border-white/10 lg:rounded-2xl lg:sticky lg:top-24 max-h-screen lg:max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h3 className="font-bold text-lg text-white">Filters</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-primary transition-colors shrink-0"
                >
                  Clear All
                </button>
                <button onClick={() => setIsFiltersOpen(false)} className="lg:hidden text-gray-400 hover:text-black">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <span className="text-xs font-bold text-gray-500 block mb-4 uppercase tracking-widest">Category</span>
              <div className="space-y-3">
                {['All', ...categories].map((cat) => (
                  <div key={cat} className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        activeCategory === cat ? 'border-primary' : 'border-white/20'
                      }`}
                    >
                      {activeCategory === cat && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </button>
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`text-sm ${activeCategory === cat ? 'text-primary font-bold' : 'text-gray-400 hover:text-white'} uppercase`}
                    >
                      {cat}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <span className="text-xs font-bold text-gray-500 block mb-4 uppercase tracking-widest">Price Range</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  placeholder="Min"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
                <span className="text-gray-600">-</span>
                <input 
                  type="number"
                  placeholder="Max"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-8">
              <span className="text-xs font-bold text-gray-500 block mb-4 uppercase tracking-widest">Brand</span>
              <input 
                type="text" 
                placeholder="Filter by brand..."
                value={activeBrand === 'AllBrands' ? '' : activeBrand}
                onChange={(e) => setActiveBrand(e.target.value ? e.target.value : 'AllBrands')}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-primary"
              />
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {brands.filter(b => b !== 'AllBrands').map((brand) => (
                  <div key={brand} className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveBrand(brand)}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        activeBrand === brand ? 'border-primary' : 'border-white/20'
                      }`}
                    >
                      {activeBrand === brand && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </button>
                    <button 
                      onClick={() => setActiveBrand(brand)}
                      className={`text-sm ${activeBrand === brand ? 'text-primary font-bold' : 'text-gray-400 hover:text-white'} uppercase`}
                    >
                      {brand}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Product Grid */}
          <div className="flex-1 w-full">
            {/* Top Bar for Sort */}
            <div className="bg-[#151515] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 z-20 relative text-white shadow-xl">
              <h1 className="text-lg md:text-xl font-bold uppercase mb-4 sm:mb-0">
                {hotSellingParam === 'true' ? 'Hot Selling Products' : (activeCategory === 'All' ? (searchQuery || 'Catalog') : activeCategory)}
                <span className="text-sm font-normal text-gray-500 normal-case ml-2 block sm:inline mt-1 sm:mt-0">
                  (Showing {filteredProducts.length} of {PRODUCTS.length} products)
                </span>
              </h1>
              
              <div className="flex items-center gap-3">
                <button
                   onClick={() => setIsFiltersOpen(true)}
                   className="lg:hidden flex items-center justify-center gap-2 flex-1 px-4 py-2 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  <Filter size={16} /> Filters
                </button>
                <div className="hidden sm:block">
                  <button 
                    onClick={() => setViewMode(viewMode === 'grid' ? 'grouped' : 'grid')}
                    className="p-2 border border-white/20 rounded-lg hover:bg-white/5 transition-all text-white h-10 w-10 flex items-center justify-center"
                    title="Toggle View Mode"
                  >
                    {viewMode === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
                  </button>
                </div>
                
                <div className="relative flex-1 sm:flex-none">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2 border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors bg-[#151515] h-10"
                  >
                    <span className="truncate">Sort By: {sortOrder}</span> <ChevronDown size={14} className={`shrink-0 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSortOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full sm:w-56 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                      {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest First'].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortOrder(option);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${sortOrder === option ? 'text-primary font-bold bg-white/5' : 'text-gray-400'}`}
                        >
                          {option === 'Relevance' && sortOrder !== 'Relevance' ? 'Sort By: Relevance' : option}
                        </button>
                      ))}
                    </div>
                  )}
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
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6"
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
                  className="space-y-16"
                >
                  {groupedProducts.map(([brand, products]) => (
                    <div key={brand}>
                      <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-black">{brand}</h2>
                        <div className="h-[1px] flex-1 bg-white/20" />
                        <span className="text-xs font-bold text-gray-500">{products.length} Products</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-6">
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
              <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                <Filter size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);
}

function ProductCard({ product, index }: { product: any; index: number; key?: React.Key }) {
  const { user } = useAuth();
  const isAdmin = user?.email === 'computercorner15@yahoo.com' || user?.email === 'sabujdas5757@gmail.com';
  
  return (
    <div className="group block relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl shadow-sm transition-all h-full flex flex-col"
      >
        <div className="relative aspect-square overflow-hidden bg-white p-2 flex items-center justify-center border-b border-gray-100">
          <Link to={`/product/${product.id}`} className="w-full h-full block">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
              />
            )}
          </Link>
          {product.discount && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-[#10b981] text-white text-[10px] font-black uppercase rounded shadow-sm z-10">
              {product.discount} OFF
            </div>
          )}
          {!isAdmin && (
            <a 
              href={`https://wa.me/917501090919?text=I'm interested in: ${product.name}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2 right-2 w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#128C7E] shadow-md transition-transform active:scale-95 z-10"
            >
              <MessageSquare size={18} fill="currentColor" />
            </a>
          )}
        </div>
        <Link to={`/product/${product.id}`} className="p-4 flex-1 flex flex-col text-black">
          <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
             {product.name}
          </h3>
          <div className="text-[10px] font-bold text-gray-500 uppercase mb-3">
            {product.brand}
          </div>
          
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-black">{product.price.split(' The')[0]}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">{product.oldPrice}</span>
            )}
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

