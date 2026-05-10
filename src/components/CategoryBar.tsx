import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  'LAPTOP', 'MOTHERBOARD', 'RAM', 'GRAPHICS CARD', 'MONITOR', 'STORAGE', 'KEYBOARD', 'MOUSE', 'PRINTER', 'SERVICE'
];

export default function CategoryBar() {
  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/5 transition-all duration-300 py-2 overflow-hidden">
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-1">
          {categories.map((category, index) => (
            <Link
              key={category}
              to={category === 'SERVICE' ? '/catalog' : `/catalog?search=${category}`}
              className="whitespace-nowrap text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-primary transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
