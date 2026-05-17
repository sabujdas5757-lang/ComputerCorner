/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../constants';
import { ArrowRight } from 'lucide-react';

export default function ProductGallery() {
  return (
    <section id="catalog" className="py-24 bg-surface border-t border-white/5">
      <div className="section-container">
        <div className="mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Product Catalog</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Explore Our <span className="text-gray-500">Tech Range</span>
            </h2>
            <p className="text-gray-400 max-w-md">
              From high-end gaming rigs to essential home security, discover our full spectrum of computer hardware and electronics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCT_CATEGORIES.map((category, idx) => {
            const isLaptops = category.title === 'Laptops';
            return (
              <Link
                key={category.title}
                to={`/category-hub/laptops`}
                className="block"
              >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer border border-white/5"
              >
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 delay-75">
                    See Products <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
        </div>
      </div>
    </section>
  );
}
