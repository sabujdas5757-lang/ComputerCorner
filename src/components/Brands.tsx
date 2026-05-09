/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Brands() {
  const navigate = useNavigate();
  const stats = [
    { label: 'Years Serving', value: '10+' },
    { label: 'Devices Serviced', value: '5000+' },
    { label: 'Brands Supported', value: '15+' },
  ];

  const brands = ['ASUS', 'HP', 'SAMSUNG', 'DELL', 'LENOVO', 'AMD'];

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
          <h3 className="text-2xl font-bold text-gray-400">Leading tech brands available in store</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {brands.map((brand) => (
            <motion.div
              key={brand}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              onClick={() => navigate('/catalog')}
              className="h-24 bg-black border border-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer group"
            >
              <span className="text-xl font-black text-white group-hover:text-primary transition-colors italic tracking-tighter">{brand}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
