/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, MessageSquare, Filter } from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../constants';

export default function Catalog() {
  const { categorySlug } = useParams();
  const [activeCategory, setActiveCategory] = useState(categorySlug || 'All');

  // Map category slugs to titles if needed, or just use titles
  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(p.category.toLowerCase()));

  return (
    <div className="min-h-screen bg-bg-dark text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Back to Home</span>
            </Link>
            <h1 className="text-5xl font-bold tracking-tight">Full Products <span className="text-gray-500 italic">Catalog.</span></h1>
          </div>
          
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

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {['All', ...PRODUCT_CATEGORIES.map(c => c.title)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                activeCategory === cat 
                  ? 'bg-primary border-primary text-bg-dark' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Link 
              key={product.id}
              to={`/product/${product.id}`}
              className="group block"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-white/5">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.discount}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                    {product.brand} • {product.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <span className="text-2xl font-black text-white">{product.price}</span>
                      {product.oldPrice && (
                        <span className="block text-xs text-gray-600 line-through font-bold">{product.oldPrice}</span>
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
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[40px]">
            <Filter size={48} className="mx-auto text-gray-700 mb-6" />
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later.</p>
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
