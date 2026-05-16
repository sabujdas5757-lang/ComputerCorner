import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TopBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const b = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBanners(b.filter((ban: any) => ban.active !== false));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'banners');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <section className="w-full relative px-4 md:px-6 pt-6 pb-6 max-w-7xl mx-auto">
      <div className="w-full relative h-[200px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-black">
        <AnimatePresence initial={false}>
          {banners.map((banner, idx) => (
            idx === currentIndex && (
              <motion.a
                key={banner.id}
                href={banner.link || '#'}
                target={banner.link?.startsWith('http') ? '_blank' : '_self'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 block w-full h-full"
              >
                <div className="w-full h-full relative">
                   {/* Background Image */}
                   <img 
                     src={banner.image} 
                     alt={banner.title || 'Banner'} 
                     className="w-full h-full object-cover" 
                   />
                   
                   {/* Fallback Overlay if text is needed, though user image has baked-in design, keeping in case */}
                   {banner.title && (
                     <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-r from-black/80 to-transparent">
                        <div className="max-w-xl">
                          <h2 className="text-white text-2xl md:text-3xl font-bold font-sans tracking-tight leading-tight">{banner.title}</h2>
                          {banner.subtitle && (
                            <p className="text-white text-sm md:text-base mt-3 font-medium">{banner.subtitle}</p>
                          )}
                          <div className="mt-5 px-6 py-2.5 bg-white text-black font-bold rounded hover:bg-gray-100 transition-colors inline-block text-xs md:text-sm cursor-pointer shadow-md">
                            Shop Now
                          </div>
                        </div>
                     </div>
                   )}
                </div>
              </motion.a>
            )
          ))}
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.preventDefault(); handlePrev(); }}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition opacity-0 group-hover:opacity-100 z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); handleNext(); }}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition opacity-0 group-hover:opacity-100 z-20"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Carousel Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
