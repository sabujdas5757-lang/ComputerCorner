/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CheckCircle2, Quote } from 'lucide-react';
import { AMCFEATURES, TESTIMONIALS, WORKSHOP_LOGS } from '../constants';

export default function Services() {
  return (
    <section id="workshop" className="py-24 bg-bg-dark border-t border-white/5">
      <div className="section-container">
        {/* Workshop Logs */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">Workshop Logs</p>
              <h2 className="text-4xl font-bold tracking-tight">Our technical bench <span className="text-gray-500">at work.</span></h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORKSHOP_LOGS.map((log) => (
              <div key={log.title} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 border border-white/5 bg-surface">
                  <img src={log.image} alt={log.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-1 h-4 bg-primary rounded-full" />
                   <h4 className="font-bold text-lg">{log.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AMC Section */}
        <div id="amc" className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="relative order-2 lg:order-1">
             <div className="absolute -inset-4 bg-primary/10 blur-3xl opacity-30 rounded-full" />
             <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" 
                  alt="AMC Service" 
                  className="w-full h-full object-cover grayscale"
                />
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Peace of Mind</p>
            <h3 className="text-5xl font-bold tracking-tight mb-8">Annual Maintenance Contracts <span className="text-gray-500">(AMC)</span></h3>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              We manage your office or home workstations so you don't have to. Professional maintenance for small businesses, schools and offices in Jhargram.
            </p>
            
            <ul className="space-y-6 mb-12">
              {AMCFEATURES.map((feature) => (
                <li key={feature.text} className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <span className="text-lg font-medium text-gray-200">{feature.text}</span>
                </li>
              ))}
            </ul>

            <a href="#contact" className="btn-accent px-10 py-5 text-lg">
              Get an AMC Quote
            </a>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">From Our Customers</p>
            <h2 className="text-4xl font-bold tracking-tight">Real stories from Jhargram</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card-dark p-8 relative">
                <Quote className="absolute top-6 right-8 text-primary opacity-20" size={40} />
                <p className="text-lg text-gray-300 mb-8 italic relative z-10 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.author}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
