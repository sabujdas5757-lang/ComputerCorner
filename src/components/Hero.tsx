/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 md:pt-40 overflow-hidden bg-bg-dark">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/p/AF1QipPWUyOc6qlWd1DuwxsaQLFmHW5rNTkop2o8tR3b=s1600" 
          alt="Computer Corner Store Front"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
      </div>

      <div className="section-container relative z-10 w-full min-h-[50vh] flex items-start justify-end pt-6 md:pt-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a 
            href="https://maps.app.goo.gl/bnvqKkYyeE5LaY3z5"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 p-1.5 pr-4 bg-white/5 border border-white/10 rounded-full group cursor-pointer hover:border-primary/50 transition-all hover:bg-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] group-hover:text-primary transition-colors">Jhargram's Trusted Tech Hub</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
