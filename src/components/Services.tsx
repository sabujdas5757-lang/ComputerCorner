/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { CheckCircle2, Quote } from 'lucide-react';
import { AMCFEATURES, TESTIMONIALS, WORKSHOP_LOGS } from '../constants';

export default function Services() {
  return (
    <section id="services" className="py-24 bg-bg-dark border-t border-white/5">
      <div className="section-container">
        {/* Workshop Logs */}
        <div id="workshop" className="mb-32">
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
                  <img src={log.image} alt={log.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
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
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" 
                  alt="Computer Corner Tech Hub" 
                  className="w-full h-full object-cover"
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

            <a href="#contact" className="w-full py-5 text-lg font-bold rounded-2xl bg-[#00D991] text-bg-dark hover:bg-[#00BD7E] transition-all duration-300 flex items-center justify-center">
              Get an AMC Quote
            </a>
          </div>
        </div>

        {/* Testimonials */}
        <div id="testimonials">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4">From our customers</p>
            <h2 className="text-5xl font-bold tracking-tight">Real stories from <span className="text-gray-500">Jhargram</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[32px] bg-surface border border-white/5 relative group hover:border-primary transition-all duration-500"
              >
                <div className="text-primary/20 group-hover:text-primary/40 transition-colors absolute top-8 right-8">
                  <Quote size={48} fill="currentColor" />
                </div>
                
                <p className="text-lg text-gray-300 mb-8 leading-relaxed italic relative z-10 font-medium">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.author}</h4>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
