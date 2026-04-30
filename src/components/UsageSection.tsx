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
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Gamepad2, Video } from 'lucide-react';

const USAGE_TYPES = [
  {
    title: 'Student Usage',
    desc: 'Lightweight & Reliable',
    icon: <GraduationCap size={32} />,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    search: 'student'
  },
  {
    title: 'Office Usage',
    desc: 'High Performance & Productivity',
    icon: <Briefcase size={32} />,
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    search: 'office'
  },
  {
    title: 'Gaming',
    desc: 'Unleash Ultimate Power',
    icon: <Gamepad2 size={32} />,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    search: 'gaming'
  },
  {
    title: 'Editing',
    desc: 'Precision for Creators',
    icon: <Video size={32} />,
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    search: 'editing'
  }
];

export default function UsageSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-black py-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">Shop by <span className="text-primary italic">Usage.</span></h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {USAGE_TYPES.map((item, index) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/catalog?usage=${item.search}`)}
              className={`group relative p-8 rounded-3xl border ${item.borderColor} bg-gradient-to-br ${item.color} flex flex-col items-center text-center hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
            >
              {/* Decorative Background Blob */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-current opacity-10 group-hover:scale-150 transition-transform duration-500 ${item.textColor}`} />
              
              <div className={`${item.textColor} mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                {item.icon}
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                {item.title}
              </h3>
              
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest max-w-[150px]">
                {item.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Explore Collection
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
