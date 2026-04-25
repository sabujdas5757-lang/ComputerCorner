/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Laptop, Gamepad2, Briefcase, Apple, ArrowRight, Home } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const usageCategories = [
  {
    id: 'student',
    title: 'Student Usage',
    description: 'Balanced machines for learning, research, and daily productivity. Reliable performance that lasts through long study sessions.',
    icon: <Laptop size={32} />,
    color: 'from-blue-500/20 to-transparent',
    borderColor: 'border-blue-500/20',
    hoverColor: 'hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    link: '/catalog/Laptops?usage=student'
  },
  {
    id: 'gaming',
    title: 'Gaming & Editing',
    description: 'Powerful rigs with high-end GPUs for heavy workloads, content creation, and elite gaming performance.',
    icon: <Gamepad2 size={32} />,
    color: 'from-red-500/20 to-transparent',
    borderColor: 'border-red-500/20',
    hoverColor: 'hover:border-red-500/50',
    iconColor: 'text-red-400',
    link: '/catalog/Laptops?usage=gaming'
  },
  {
    id: 'office',
    title: 'Office Usage',
    description: 'Enterprise-grade solutions built for stability, security, and multitasking across professional applications.',
    icon: <Briefcase size={32} />,
    color: 'from-primary/20 to-transparent',
    borderColor: 'border-primary/20',
    hoverColor: 'hover:border-primary/50',
    iconColor: 'text-primary',
    link: '/catalog/Laptops?usage=office'
  },
  {
    id: 'macbook',
    title: 'MacBook',
    description: 'Dedicated category for MacOS enthusiasts. Experience the power of Apple Silicon and the premium ecosystem.',
    icon: <Apple size={32} />,
    color: 'from-white/10 to-transparent',
    borderColor: 'border-white/10',
    hoverColor: 'hover:border-white/40',
    iconColor: 'text-white',
    link: '/catalog/Laptops?usage=macbook'
  }
];

export default function LaptopUsageHub() {
  return (
    <div className="min-h-screen bg-bg-dark text-white">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="section-container relative">
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="absolute -top-16 left-4 md:left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
              <Home size={14} />
            </div>
            Back to Home
          </Link>

          <div className="text-center mb-20">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4"
            >
              Hardware Selection
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              Choose Your <span className="text-gray-500 italic">Usage.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
            >
              Every user is unique. Select the category that best matches your workflow to see our curated collection of high-performance laptops.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {usageCategories.map((cat, idx) => (
              <Link 
                key={cat.id} 
                to={cat.link}
                className="block group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={`relative h-full p-10 rounded-[40px] bg-white/5 border ${cat.borderColor} ${cat.hoverColor} transition-all duration-500 overflow-hidden flex flex-col`}
                >
                  {/* Decorative background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-30 group-hover:opacity-50 transition-opacity`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-[22px] bg-white/5 border border-white/10 flex items-center justify-center ${cat.iconColor} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      {cat.icon}
                    </div>
                    
                    <h2 className="text-4xl font-bold mb-6 tracking-tight group-hover:text-primary transition-colors">
                      {cat.title}
                    </h2>
                    
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-auto relative z-10 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
                    Browse Collection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>

                  {/* Corner detail */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Contact help */}
          <div className="mt-24 p-12 bg-white/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Need a Custom Recommendation?</h3>
              <p className="text-gray-500">Our tech experts can help you choose the perfect machine for your budget.</p>
            </div>
            <a 
              href="https://wa.me/917501090919"
              className="px-8 py-4 bg-primary text-bg-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-glow"
            >
              Talk to Expert
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
