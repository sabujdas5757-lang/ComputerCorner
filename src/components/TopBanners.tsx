import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (banners.length === 0) return null;

  return (
    <section className="w-full bg-black border-b border-white/5 relative overflow-hidden">
      <div className="w-full mx-auto relative h-[250px] md:h-[400px]">
        <AnimatePresence initial={false}>
          {banners.map((banner, idx) => (
            idx === currentIndex && (
              <motion.a
                key={banner.id}
                href={banner.link || '#'}
                target={banner.link?.startsWith('http') ? '_blank' : '_self'}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 block w-full h-full"
              >
                <div className="w-full h-full bg-black relative">
                   <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-contain md:object-cover" />
                   {banner.title && (
                     <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h2 className="text-white text-xl md:text-3xl font-bold font-sans">{banner.title}</h2>
                        {banner.subtitle && (
                          <p className="text-gray-300 text-xs md:text-sm mt-1">{banner.subtitle}</p>
                        )}
                     </div>
                   )}
                </div>
              </motion.a>
            )
          ))}
        </AnimatePresence>

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
