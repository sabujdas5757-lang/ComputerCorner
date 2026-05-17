import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { checkIfAdmin } from '../utils/admin';

export default function HotSellingSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products: PRODUCTS } = useProducts();
  const { user } = useAuth();
  const isAdmin = checkIfAdmin(user?.email);
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

  const products = PRODUCTS.filter(p => p.isHotSelling).slice(0, 15);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0] as HTMLElement;
      const scrollAmount = firstChild ? firstChild.clientWidth + 24 : scrollRef.current.clientWidth;
      const scrollTo = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount 
        : scrollRef.current.scrollLeft + scrollAmount;
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

      <div className="w-full px-4 md:px-6 max-w-[1920px] mx-auto relative z-10">
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
                className="min-w-[280px] md:min-w-[340px] bg-white rounded-[2rem] overflow-hidden shadow-xl snap-start flex flex-col group/card cursor-pointer border border-gray-100 relative"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Hot Badge */}
                <div className="absolute top-6 left-6 z-20 bg-white text-[#ff5722] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#ff5722]/30 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                  <span className="w-1.5 h-1.5 bg-[#ff5722] rounded-full animate-pulse" />
                  Trending
                </div>



                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white flex items-center justify-center p-8 group-hover/card:bg-gray-50 transition-colors duration-500 border-b border-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/card:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Quick Action */}
                  <div className="absolute inset-0 bg-[#25D366]/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10 pointer-events-none">
                    {!isAdmin && (
                      <a 
                        href={`https://wa.me/917501090919?text=I'm interested in checking availability for: ${product.name}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#25D366] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 shadow-2xl pointer-events-auto hover:bg-[#128C7E] active:scale-95"
                      >
                        <MessageSquare size={16} />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-[#5eb133] uppercase tracking-[0.2em]">{product.brand}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-black line-clamp-3 leading-tight group-hover/card:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="mt-2 text-2xl font-black text-black">
                    {product.price.split(' ')[0]}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Live Deal</span>
                      {product.oldPrice && (
                        <span className="text-xs text-red-500/60 line-through font-bold">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>
                    {product.discount && (
                      <div className="bg-[#5eb133]/10 text-[#5eb133] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#5eb133]/20">
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
