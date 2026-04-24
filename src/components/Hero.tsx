/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-bg-dark">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000" 
          alt="Modern Computer Store Interior"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
      </div>

      <div className="section-container relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <a 
              href="https://maps.app.goo.gl/bnvqKkYyeE5LaY3z5"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mb-8 p-1.5 pr-4 bg-white/5 border border-white/10 rounded-full group cursor-pointer hover:border-primary/50 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#888] group-hover:text-primary transition-colors">Jhargram's Trusted Tech Hub</span>
            </a>
            
            <h1 className="text-6xl md:text-[84px] font-bold leading-[1.05] tracking-tight mb-8">
              Sales, Service & Security Care <span className="text-primary italic">for every computer.</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-xl leading-relaxed">
              From Custom Gaming PCs and Laptops to CCTV Security, Printers, TVs, and Home Appliances — we sell and service premium technology near R.B.M. School, Jhargram.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="tel:8167489332" className="btn-accent px-10 py-5 text-lg group">
                Call Sales: 8167489332
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#products" className="btn-outline px-10 py-5 text-lg">
                See What We Sell
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
