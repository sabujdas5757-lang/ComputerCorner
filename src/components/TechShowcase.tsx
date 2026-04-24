/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Laptop, MessageCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';

const laptopProducts = PRODUCTS.filter(p => p.category === 'Laptops').slice(0, 4);
const monitorProducts = PRODUCTS.filter(p => p.category === 'Monitors').slice(0, 4);

export default function TechShowcase() {
  return (
    <section className="py-24 bg-bg-dark border-t border-white/5">
      <div className="section-container">
        
        {/* Laptops Section */}
        <div id="laptops" className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Laptop size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured <span className="text-primary italic">Laptops</span></h2>
                <p className="text-gray-500 text-sm">Best performance for work and play</p>
              </div>
            </div>
            <Link to="/catalog/Laptops" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {laptopProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} idx={idx} />
            ))}
          </div>
        </div>

        {/* Monitors Section */}
        <div id="monitor">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Monitor size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Premium <span className="text-blue-500 italic">Monitors</span></h2>
                <p className="text-gray-500 text-sm">Crystal clear visuals for professionals</p>
              </div>
            </div>
            <Link to="/catalog/Monitors" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {monitorProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} idx={idx} color="border-blue-500/20" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function ProductCard({ product, idx, color = "border-primary/20" }: { product: any, idx: number, color?: string, key?: React.Key }) {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        viewport={{ once: true }}
        className="bg-surface rounded-3xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-black/40">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.discount && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white text-bg-dark text-[10px] font-black uppercase tracking-tight">
              {product.discount}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.brand}</span>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{product.category}</span>
          </div>
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">{product.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-lg font-black">{product.price.split(' ')[0]}</span>
          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-bg-dark transition-all duration-300`}>
            <ArrowRight size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
