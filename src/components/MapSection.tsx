/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';

export default function MapSection() {
  return (
    <section className="w-full bg-black py-20 overflow-hidden border-b border-white/5">
      <div className="w-full px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Info Side */}
          <div className="lg:col-span-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Visit our store</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
              Located in the Heart of <span className="text-primary italic">Jhargram.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Address</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    COMPUTER CORNER<br />
                    Raghunathpur, Jhargram<br />
                    West Bengal - 721507
                  </p>
                </div>
              </div>
              <a 
                href="https://www.google.com/maps/dir//COMPUTER+CORNER,+Raghunathpur,+Jhargram,+West+Bengal+721507/@22.4501905,86.9839462,17z"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all group"
              >
                <Navigation size={18} className="group-hover:rotate-12 transition-transform" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Map Side */}
          <div className="lg:col-span-2 relative h-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.4442657738206!2d86.9839462!3d22.4501905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d4133f6b9c9e9%3A0x6d9f8c6b7e8b9b9b!2sCOMPUTER%20CORNER!5e0!3m2!1sen!2sin!4v1714421000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
            {/* Overlay to catch clicks and encourage interactions */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black/20 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
