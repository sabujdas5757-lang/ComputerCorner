/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Phone, ShoppingBag, MapPin, MessageSquare, Heart, Facebook, Instagram, Youtube } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export default function QuickAccess() {
  const { products: PRODUCTS } = useProducts();
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigation back to Home */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <Home size={20} />
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Quick Access Hub</span>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart size={16} className="text-primary fill-current" />
          </div>
        </div>

        {/* Thank You Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary mb-6">
            Thank You for Visiting
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            We're here to help <span className="text-gray-500">you grow.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Thank you for choosing TP Computer Corner. We value your trust in our sales, services, and tech solutions.
          </p>
        </motion.div>

        {/* Contact Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <a 
            href="https://wa.me/917501090919" 
            target="_blank" 
            rel="noreferrer"
            className="p-6 bg-white/5 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group"
          >
            <div className="w-12 h-12 bg-[#00D991]/10 rounded-2xl flex items-center justify-center text-[#00D991] mb-6 shadow-glow transition-transform group-hover:scale-110">
              <MessageSquare size={24} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-2">Chat Support</h3>
            <p className="text-gray-400 text-sm">Instant response via WhatsApp for any queries.</p>
          </a>

          <a 
            href="tel:8167489332" 
            className="p-6 bg-white/5 border border-white/5 rounded-[32px] hover:border-primary/30 transition-all group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
              <Phone size={24} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-2">Direct Call</h3>
            <p className="text-gray-400 text-sm">Speak with our certified tech experts now.</p>
          </a>
        </div>

        {/* Social Media Links */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Connect with us</span>
              <h2 className="text-3xl font-bold">Follow Our Journey</h2>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <a 
              href="https://www.facebook.com/computercornerjgm/" 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-all group"
            >
              <Facebook size={32} className="text-gray-400 group-hover:text-[#1877F2] transition-colors mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Facebook</span>
            </a>
            <a 
              href="https://www.instagram.com/computer_corner_15" 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30 transition-all group"
            >
              <Instagram size={32} className="text-gray-400 group-hover:text-[#E4405F] transition-colors mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Instagram</span>
            </a>
            <a 
              href="https://www.youtube.com/@computercorner15" 
              target="_blank" 
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-[#FF0000]/10 hover:border-[#FF0000]/30 transition-all group"
            >
              <Youtube size={32} className="text-gray-400 group-hover:text-[#FF0000] transition-colors mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">YouTube</span>
            </a>
          </div>
        </div>

        {/* Product Catalog Preview */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Catalog Preview</span>
              <h2 className="text-3xl font-bold">Featured Products</h2>
            </div>
            <Link to="/catalog" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">See All →</Link>
          </div>

          <div className="space-y-4">
            {PRODUCTS.slice(0, 3).map((product) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-colors group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.brand}</p>
                </div>
                <div className="text-right">
                  <div className="text-primary font-black text-sm">{product.price}</div>
                  <div className="text-[10px] text-gray-600 line-through">{product.oldPrice}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-8 border-t border-white/10 mt-12 pb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs text-gray-400">Near Spandan Diagnostic, Jhargram</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Established 2016</p>
        </div>
      </div>
    </div>
  );
}
