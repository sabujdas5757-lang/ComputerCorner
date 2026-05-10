import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart, Flame } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function HotSellingSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products: PRODUCTS } = useProducts();
  const [settings, setSettings] = useState({ title: 'Hot Selling', subtitle: 'Our most popular gear this month' });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'hotSelling'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          title: data.title || 'Hot Selling',
          subtitle: data.subtitle || 'Our most popular gear this month'
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/hotSelling');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: scrollLeft + clientWidth, behavior: 'smooth' });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const products = PRODUCTS.filter(p => p.isHotSelling).slice(0, 15);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-[#0a0a0a] py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Flame className="text-bg-dark" size={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">{settings.title}</h2>
              <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest mt-1">{settings.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/catalog?hotSelling=true')}
            className="self-start md:self-center px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
          >
            Explore All
          </button>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-white text-black p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:bg-primary hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-white text-black p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center hover:bg-primary hover:scale-110 active:scale-95"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>

          {/* Product List */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory perspective-1000"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="min-w-[280px] md:min-w-[340px] bg-black rounded-[2rem] overflow-hidden shadow-2xl snap-start flex flex-col group/card cursor-pointer border border-white/10 relative"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Hot Badge */}
                <div className="absolute top-6 left-6 z-20 bg-black text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/30 flex items-center gap-1.5 backdrop-blur-sm shadow-xl">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  Trending
                </div>



                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5 flex items-center justify-center p-8 group-hover/card:bg-primary/5 transition-colors duration-500">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/card:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Quick Action */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 shadow-2xl">
                      <ShoppingCart size={16} />
                      View Details
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 bg-black">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white line-clamp-3 leading-tight group-hover/card:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="mt-2 text-2xl font-black text-white">
                    {product.price.split(' ')[0]}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Live Deal</span>
                      {product.oldPrice && (
                        <span className="text-xs text-red-500/60 line-through font-bold">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {product.discount}
                      </div>
                    )}
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
