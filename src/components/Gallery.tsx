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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {GALLERY_IMAGES.slice(0, 6).map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-surface border border-white/5"
            >
              <img 
                src={image} 
                alt={`Computer Setup ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
