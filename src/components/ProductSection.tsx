/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../constants';
import { checkIfAdmin } from '../utils/admin';

interface ProductSectionProps {
  title: string;
  category: string;
  key?: string;
}

export default function ProductSection({ title, category }: ProductSectionProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products: PRODUCTS } = useProducts();
  const { user } = useAuth();
  const isAdmin = checkIfAdmin(user?.email);

  const products = PRODUCTS
    .filter(p => {
      if (!p.category) return false;
      const cat = p.category.toLowerCase().trim();
      const target = category.toLowerCase().trim();
      // Flexible matching for singular/plural
      return cat === target || cat === target + 's' || cat + 's' === target;
    })
    .sort((a, b) => {
      // Prioritize products marked for home grid
      const aFeatured = !!a.showInHomeGrid;
      const bFeatured = !!b.showInHomeGrid;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    })
    .slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-black py-12 border-b border-white/5">
      <div className="w-full px-4 md:px-6 max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-[#fdf2a7] via-[#fdf2a7] to-[#fac1ff] p-4 rounded-lg shadow-xl">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">{title}</h2>
          <button 
            onClick={() => navigate(`/catalog/${category}`)}
            className="bg-black text-white text-[10px] md:text-xs font-black px-6 py-2 rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            View All
          </button>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-black p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-primary"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-black p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-primary"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>

          {/* Product List */}
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="min-w-[240px] md:min-w-[300px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg snap-start flex flex-col group/card cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-white border-b border-gray-100 p-4">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-[#5eb133] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {product.discount || '30% OFF'}
                  </div>
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/card:scale-110 transition-transform duration-500"
                  />
                  
                  {/* WhatsApp Action */}
                  {!isAdmin && (
                    <a 
                      href={`https://wa.me/917501090919?text=I'm interested in: ${product.name}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-4 right-4 bg-[#25D366] text-white p-2 rounded-full shadow-lg opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-[#128C7E] z-20"
                    >
                      <MessageSquare size={18} fill="currentColor" />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-sm md:text-base font-bold text-black line-clamp-3 mb-1 group-hover/card:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    {product.brand}
                  </span>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through mb-0.5">
                          {product.oldPrice}
                        </span>
                      )}
                      <span className="text-lg md:text-xl font-black text-black">
                        {product.price.split(' ')[0]}
                      </span>
                    </div>
                    {product.discount && (
                      <span className="text-[10px] font-bold text-[#5eb133] border border-[#5eb133]/20 px-2 py-0.5 rounded bg-[#5eb133]/5">
                        {product.discount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
