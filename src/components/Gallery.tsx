/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { GALLERY_IMAGES } from '../constants';

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-bg-dark border-t border-white/5">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Visual Tour</p>
          <h2 className="text-5xl font-bold tracking-tight">Our Tech <span className="text-gray-500">Workspace</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {GALLERY_IMAGES.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/3] rounded-[32px] overflow-hidden bg-surface border border-white/5"
            >
              {image.url && (
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Shop Showcase
                </p>
                <h3 className="text-xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {image.title}
                </h3>
                <p className="text-gray-400 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                  {image.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
