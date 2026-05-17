import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function CustomTopGridSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products: PRODUCTS } = useProducts();
  const { user } = useAuth();
  const isAdmin = user?.email === 'computercorner15@yahoo.com' || user?.email === 'sabujdas5757@gmail.com';
  const [settings, setSettings] = useState({ title: 'Top Picks', subtitle: 'Specially Curated For You' });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'topGrid'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          title: data.title || 'Top Picks',
          subtitle: data.subtitle || 'Specially Curated For You'
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/topGrid');
    });
    return () => unsubscribe();
  }, []);

  const products = PRODUCTS.filter(p => p.isCustomTopGrid).slice(0, 15);

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
    <section className="w-full bg-black py-12 border-b border-white/5">
      <div className="w-full px-4 md:px-6 max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-[#d8b4fe] via-[#e879f9] to-[#c084fc] p-4 rounded-lg shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-lg">
              <Star className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">{settings.title}</h2>
              <p className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest">{settings.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/catalog`)}
            className="bg-black text-white text-[10px] md:text-xs font-black px-6 py-2 rounded-md hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            View All
          </button>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-black p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-black p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>

          {/* Product List */}
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="min-w-[240px] md:min-w-[300px] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl snap-start flex flex-col group/card cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-white/5 p-4">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-purple-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {product.discount || 'FEATURED'}
                  </div>
                  
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/card:scale-110 transition-transform duration-500"
                  />
                  
                  {/* WhatsApp Action */}
                  {!isAdmin && (
                    <a 
                      href={`https://wa.me/917501090919?text=I'm interested in checking availability for: ${product.name}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-4 right-4 bg-[#25D366] text-white p-2 rounded-full shadow-lg opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-[#128C7E] z-20"
                    >
                      <MessageSquare size={18} fill="currentColor" />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-sm md:text-base font-bold text-white line-clamp-3 mb-1 group-hover/card:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {product.brand}
                  </span>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through mb-0.5">
                          {product.oldPrice}
                        </span>
                      )}
                      <span className="text-lg md:text-xl font-black text-white">
                        {product.price.split(' ')[0]}
                      </span>
                    </div>
                    {product.discount && (
                      <span className="text-[10px] font-bold text-purple-500 border border-purple-500/20 px-2 py-0.5 rounded bg-purple-500/5">
                        {product.discount}
                      </span>
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
