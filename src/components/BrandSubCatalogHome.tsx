/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const popularBrands = [
  { name: 'ASUS', logo: 'https://www.asus.com/media/images/ASUS-logo.svg', color: 'bg-blue-600' },
  { name: 'HP', logo: '', color: 'bg-blue-400' },
  { name: 'SAMSUNG', logo: '', color: 'bg-blue-800' },
  { name: 'DELL', logo: '', color: 'bg-blue-500' },
  { name: 'LENOVO', logo: '', color: 'bg-red-600' },
  { name: 'AMD', logo: '', color: 'bg-orange-600' },
  { name: 'Intel', logo: '', color: 'bg-blue-700' },
  { name: 'Hikvision', logo: '', color: 'bg-red-700' }
];

export default function BrandSubCatalogHome() {
  return (
    <section className="py-24 bg-surface">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Shop by Manufacturer</h2>
            <h3 className="text-5xl font-bold tracking-tight">Our <span className="text-gray-500 italic">Brand Partners.</span></h3>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularBrands.map((brand, idx) => (
            <Link 
              key={brand.name}
              to={`/catalog`}
              className="group relative h-48 rounded-[32px] overflow-hidden bg-white/5 border border-white/5 hover:border-primary/50 transition-all duration-500"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent to-black/60">
                <span className="text-2xl font-black tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500">{brand.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Browse Products</span>
              </div>
              
              {/* Decorative brand initial */}
              <div className="absolute -bottom-4 -right-4 text-9xl font-black text-white/5 pointer-events-none group-hover:text-primary/5 transition-colors duration-500">
                {brand.name[0]}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ArrowRight size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold">Custom Assemblies</h4>
              <p className="text-gray-500 text-sm">Need a specialized build? We assemble custom PCs for any budget.</p>
            </div>
          </div>
          <a 
            href="https://wa.me/917501090919"
            className="px-8 py-4 bg-white text-bg-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
          >
            Request Quote
          </a>
        </div>
      </div>
    </section>
  );
}
