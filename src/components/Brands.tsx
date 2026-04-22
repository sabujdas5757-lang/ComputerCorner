/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Brands() {
  const stats = [
    { label: 'Years Serving', value: '10+' },
    { label: 'Devices Serviced', value: '5,000+' },
    { label: 'Brands Supported', value: '6+' },
  ];

  const brands = ['HP', 'ASUS', 'Intel', 'Canon', 'Dell', 'Epson'];

  return (
    <section className="bg-bg-dark py-20 border-b border-white/5">
      <div className="section-container">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Authorized Handlers For</p>
          <h3 className="text-2xl font-bold text-gray-400">We sell and service the world's leading tech brands</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {brands.map((brand) => (
            <motion.div
              key={brand}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              className="h-32 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-300 opacity-80">{brand}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
