/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative min-h-[30vh] flex items-center justify-center pt-24 overflow-hidden bg-bg-dark">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/p/AF1QipPWUyOc6qlWd1DuwxsaQLFmHW5rNTkop2o8tR3b=s1600" 
          alt="Computer Corner"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/30 to-bg-dark" />
      </div>

      <div className="section-container relative z-10 w-full flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl w-full"
        >
          {/* Hero text and search moved to Navbar/removed per user request */}
        </motion.div>
      </div>
    </section>
  );
}
