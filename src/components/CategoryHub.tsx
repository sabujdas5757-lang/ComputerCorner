import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';

// Define the generic configuration for sub-categories as a fallback.
export default function CategoryHub() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  
  const rawCat = categoryName || '';
  const currentCategory = rawCat.toLowerCase();
  
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentCategory) return;
    
    // Subscribe to Firebase for dynamic cards
    const unsubscribe = onSnapshot(doc(db, 'usageHubs', currentCategory), (docSnap) => {
      if (docSnap.exists() && docSnap.data().cards && docSnap.data().cards.length > 0) {
        setCards(docSnap.data().cards);
        setIsLoading(false);
      } else {
        // If no dynamic cards, redirect to catalog for this category
        navigate(`/catalog/${rawCat}`, { replace: true });
      }
    }, (error) => {
      console.error("Hub fetch error:", error);
      navigate(`/catalog/${rawCat}`, { replace: true });
    });

    return () => unsubscribe();
  }, [currentCategory, navigate, rawCat]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-medium text-sm"
          >
            <Icons.ArrowLeft size={16} />
            Back
          </button>

          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
              {rawCat} <span className="text-[#5eb133]">Hub</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-medium">
              Explore our curated selection by usage. Find the perfect equipment tailored exactly for your needs.
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-10 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center">
            {cards.map((card, index) => {
              const IconComp = (Icons as any)[card.iconName] || Icons.Star;
              return (
                <Link
                  key={card.id}
                  to={`/catalog/${rawCat}?usage=${card.id}`}
                  className="snap-center shrink-0"
                >
                  <div 
                    className={`relative w-[280px] h-[320px] rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-6 transition-transform hover:scale-105 duration-300 ${card.color} border border-white/5`}
                  >
                    <div className={`absolute -bottom-10 -right-10 w-44 h-44 rounded-full ${card.circle} mix-blend-screen pointer-events-none`}></div>
                    
                    <div className={`w-[72px] h-[72px] rounded-3xl ${card.iconBg} flex items-center justify-center ${card.iconColor} mb-8 z-10 shadow-lg`}>
                      <IconComp size={24} />
                    </div>
                    
                    <h2 className="text-[22px] font-black tracking-tight text-center mb-2 z-10 leading-tight">
                      {card.title}
                    </h2>
                    <p className="text-[11px] font-bold tracking-[0.1em] text-center text-gray-300/80 uppercase whitespace-pre-line leading-relaxed z-10">
                      {card.sub}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Contact Section at the Bottom */}
          <div className="mt-12 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 text-white">Need a Recommendation?</h3>
              <p className="text-gray-400">Our tech experts can help you choose the perfect equipment for your specific use-case.</p>
            </div>
            <a 
              href="https://wa.me/917501090919"
              className="px-8 py-4 bg-[#5eb133] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4d9329] transition-all shadow-lg shrink-0 whitespace-nowrap"
            >
              Talk to Expert
            </a>
          </div>

        </div>
      </main>

      <Footer />
      
      <style dangerouslySetInnerHTML={{__html:`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}} />
    </div>
  );
}
