/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquare, Star, Shield, Truck, RotateCcw, Home } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ProductDetail() {
  const { products: PRODUCTS } = useProducts();
  const { productId } = useParams();
  const product = PRODUCTS.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(product?.image || '');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <Link to="/" className="text-primary font-bold hover:underline mb-2 block">Back to Home</Link>
          <Link to="/catalog" className="text-gray-400 font-bold hover:underline">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-primary selection:text-bg-dark">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="w-full px-6">
          <div className="flex items-center gap-6 mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group">
              <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Home</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">Back to Catalog</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-6">
              <motion.div 
                layoutId={`img-${product.id}`}
                className="aspect-square rounded-[40px] overflow-hidden bg-white/5 border border-white/10"
              >
                {activeImage && (
                  <img 
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
              
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImage === img ? 'border-primary' : 'border-transparent opacity-50'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-8">
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 block">
                  {product.brand} • {product.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-white">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through font-bold">{product.oldPrice}</span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="px-3 py-1 bg-primary text-bg-dark text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.discount}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Genuine Product</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Brand Warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Fast Delivery</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Within Jhargram Area</p>
                  </div>
                </div>
              </div>

              <a 
                href={`https://wa.me/917501090919?text=I'm interested in buying: ${product.name}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-primary text-bg-dark rounded-3xl font-black text-base uppercase tracking-widest hover:scale-[1.02] transition-all shadow-glow active:scale-95"
              >
                <MessageSquare size={20} fill="currentColor" />
                Check Availability on WhatsApp
              </a>
            </div>
          </div>

          {/* Detailed Specifications */}
          {product.specifications && (
            <div className="mt-24">
              <div className="mb-12">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Technical Data</p>
                <h2 className="text-4xl font-bold tracking-tight">Specifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-[32px] overflow-hidden">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex bg-bg-dark p-6 group hover:bg-white/5 transition-colors">
                    <span className="w-1/3 text-sm font-bold text-gray-500 uppercase tracking-widest">{key}</span>
                    <span className="w-2/3 text-sm font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="mt-24">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Feedback</p>
                <h2 className="text-4xl font-bold tracking-tight">Customer Reviews</h2>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Star size={16} className="text-primary fill-current" />
                <span className="text-sm font-black">4.8 / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(product.reviews || [
                { user: 'Verified Customer', rating: 5, comment: 'Excellent product and very friendly store staff.', date: 'Recently' }
              ]).map((review, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{review.user}</span>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={12} className="text-primary fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 italic leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
