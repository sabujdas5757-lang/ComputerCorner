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

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const DEFAULT_CATEGORIES = [
  { name: 'Laptop', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Motherboard', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'RAM', img: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Graphics Card', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Monitor', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Storage', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Keyboard', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Mouse', img: 'https://images.unsplash.com/photo-1527443195645-1133e7d28990?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Router', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'CCTV', img: 'https://images.unsplash.com/photo-1557597774-9d273625ea3c?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Printer', img: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Processor', img: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'SMPS', img: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Cable', img: 'https://images.unsplash.com/photo-1558489580-faa74691fdc5?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'HDD', img: 'https://images.unsplash.com/photo-1531062991700-40344799751f?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'SSD', img: 'https://images.unsplash.com/photo-1558494949-ef0109586316?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Gaming', img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Office', img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Sound System', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'UPS', img: 'https://images.unsplash.com/photo-1563770660941-20978e870813?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Antivirus', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Biometric', img: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=200&h=200' },
];

export default function CategoryGrid() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<{name: string, img: string}[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const cats = snapshot.docs.map(doc => ({ 
          name: doc.data().name, 
          img: doc.data().img 
        }));
        setCategories(cats);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const firstChild = scrollRef.current.children[0] as HTMLElement;
        const scrollAmount = firstChild ? firstChild.clientWidth + 40 : clientWidth; // gap is 40px (gap-10)
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-black py-12 overflow-hidden border-b border-white/5">
      <div className="w-full px-4 md:px-6">
        <div ref={scrollRef} className="flex items-start gap-10 md:gap-14 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => navigate(`/category-hub/${cat.name.toLowerCase()}`)}
              className="flex flex-col items-center gap-4 group shrink-0 snap-start"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10 overflow-hidden bg-black shadow-2xl group-hover:border-primary group-hover:scale-105 transition-all duration-300 relative">
                <img 
                  src={cat.img} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors text-center max-w-[90px] md:max-w-[120px]">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
