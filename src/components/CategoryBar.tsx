import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  'Shop All', 'Computers', 'Laptops', 'Monitor', 'Motherboard', 'RAM', 
  'Processor', 'CPU Cooler', 'Graphics Card', 'Storage', 'SMPS', 
  'Cabinet', 'Peripherals', 'Printer', 'CCTV Camera', 'More'
];

export default function CategoryBar() {
  return (
    <div className="w-full bg-bg-dark/95 border-b border-white/5 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto py-4 no-scrollbar hide-scrollbar">
          {categories.map((category, index) => {
            const isCatalogLink = category === 'Shop All';
            const isLaptopLink = category === 'Laptops';
            const Component = (isCatalogLink || isLaptopLink) ? Link : motion.a;
            
            let props = {};
            if (isCatalogLink) {
              props = { to: '/catalog' };
            } else if (isLaptopLink) {
              props = { to: '/laptops' };
            } else {
              props = { href: `#${category.toLowerCase().replace(/\s+/g, '-')}` };
            }

            return (
              <Component
                key={category}
                {...(props as any)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
              >
                {category}
              </Component>
            );
          })}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
