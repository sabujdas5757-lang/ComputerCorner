/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../constants';
import { MessageSquare, ShoppingCart, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Desktops', 'Laptops', 'Printers', 'Cameras', 'CCTV', 'Audio', 'Appliances', 'Power', 'Accessories'];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-24 bg-bg-dark">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Latest Tech Inventory</p>
            <h2 className="text-4xl font-bold tracking-tight">Available In-Store <span className="text-gray-500">Today</span></h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/50 w-full sm:w-64 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeCategory === cat 
                ? 'bg-primary border-primary text-bg-dark' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="card-dark group py-8 px-6"
              >
                <div className="relative h-64 bg-bg-dark rounded-xl mb-6 overflow-hidden flex items-center justify-center border border-white/5 p-8">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface">
                      <div className="text-center opacity-20">
                        <ShoppingCart size={48} className="mx-auto mb-2" />
                        <span className="text-xs font-bold">IMAGE PENDING</span>
                      </div>
                    </div>
                  )}
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-primary text-bg-dark text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      {product.discount}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                    <span>{product.brand}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-gray-500">{product.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-snug">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between pt-4 border-t border-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-600 line-through">{product.oldPrice}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Live Stock Price</p>
                    </div>
                    
                    <a 
                      href={`https://wa.me/918167489332?text=I'm interested in ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-primary hover:text-bg-dark transition-all rounded-xl text-gray-400"
                    >
                      <MessageSquare size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
