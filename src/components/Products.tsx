/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';

export default function Products() {
  return (
    <section id="products" className="py-24 bg-surface">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Latest Arrivals</p>
            <h2 className="text-5xl font-bold tracking-tight">Best of <span className="text-gray-500">Tech.</span></h2>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/catalog"
              className="px-6 py-3 rounded-full border border-white/10 hover:border-primary transition-colors text-sm font-bold block"
            >
              All Products
            </Link>
            <a 
              href="https://wa.me/917501090919?text=Hello, I want to build a custom PC."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold block"
            >
              Build Your PC
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 5).map((product, idx) => (
            <Link 
              key={product.id}
              to={`/product/${product.id}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-dark border border-white/5 mb-6">
                   {product.discount && (
                     <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-primary text-bg-dark text-[10px] font-black uppercase tracking-wider">
                       {product.discount}
                     </div>
                   )}
                   {product.image && (
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                     />
                   )}
                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                      <div 
                        className="w-12 h-12 rounded-2xl bg-white text-bg-dark flex items-center justify-center hover:bg-primary transition-colors border-2 border-primary/10"
                      >
                        <MessageCircle size={22} fill="currentColor" className="text-primary" />
                      </div>
                   </div>
                </div>
                
                <div className="px-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.brand}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{product.category}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-black text-white">{product.price}</span>
                      {product.oldPrice && (
                        <span className="ml-2 text-sm text-gray-600 line-through">{product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
