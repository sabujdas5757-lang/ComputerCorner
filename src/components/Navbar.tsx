/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare, LayoutGrid, Facebook, Instagram, Youtube, User as UserIcon, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#products' },
    { name: 'Catalog', href: '#catalog' },
    { name: 'Workshop', href: '#workshop' },
    { name: 'AMC', href: '#amc' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`transition-all duration-300 ${
        scrolled ? 'bg-bg-dark/95 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/catalog" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-white/10 group-hover:border-primary transition-colors">
            <img 
              src="/logo.jpg" 
              alt="Computer Corner" 
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                // Fallback concentric C logo if image not uploaded yet
                target.src = 'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 80 25 A 35 35 0 1 0 80 75" fill="none" stroke="%235eb133" stroke-width="14" stroke-linecap="square" /><path d="M 66 38 A 18 18 0 1 0 66 62" fill="none" stroke="%230f0f0f" stroke-width="14" stroke-linecap="square" /></svg>';
              }}
            />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-primary transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Computer</span>
            <span className="text-lg font-extrabold tracking-tight text-[#5eb133] group-hover:text-green-400 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Corner</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 pr-6 border-r border-white/10">
            <a 
              href="https://www.facebook.com/computercornerjgm/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              title="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a 
              href="https://www.instagram.com/computer_corner_15?igsh=MWQ5c2w0aGp2eHdpeQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a 
              href="https://www.youtube.com/@computercorner15" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
              title="YouTube"
            >
              <Youtube size={16} />
            </a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex flex-row items-center gap-2">
                {user.email === 'computercorner@gmail.com' && (
                  <Link 
                    to="/admin"
                    className="flex items-center justify-center p-2 text-primary hover:text-white transition-colors bg-white/5 border border-white/10 rounded-xl"
                    title="Admin Portal"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 p-2 text-gray-400 hover:text-red-400 transition-colors bg-white/5 border border-white/10 rounded-xl"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-primary transition-colors bg-white/5 border border-white/10 rounded-xl"
                title="Sign In"
              >
                <UserIcon size={20} />
              </button>
            )}
            <a 
              href="tel:8167489332"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#00D991] text-bg-dark font-black text-xs hover:bg-[#00BD7E] transition-all duration-300 shadow-lg shadow-primary/20"
            >
              <MessageSquare size={14} fill="currentColor" />
              <span>Call Now</span>
            </a>
            <Link 
              to="/catalog" 
              className="p-2 text-gray-400 hover:text-primary transition-colors bg-white/5 border border-white/10 rounded-xl"
              title="Search"
            >
              <Search size={20} />
            </Link>
            <Link 
              to="/quick-access" 
              className="p-2 text-gray-400 hover:text-primary transition-colors bg-white/5 border border-white/10 rounded-xl"
              title="Quick Access"
            >
              <LayoutGrid size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
           <a 
            href="tel:8167489332"
            className="btn-accent py-2 px-4 text-xs rounded-lg"
          >
            <Phone size={14} />
            <span>Call</span>
          </a>
          <button 
            className="p-1 text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-surface border-b border-white/5 p-8 md:hidden flex flex-col gap-6 text-center"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-lg font-bold text-white uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/catalog"
              className="text-lg font-bold text-primary uppercase tracking-widest border border-primary/20 p-4 rounded-2xl bg-primary/5 flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Search size={20} /> Search
            </Link>
            <Link 
              to="/quick-access"
              className="text-lg font-bold text-primary uppercase tracking-widest border border-primary/20 p-4 rounded-2xl bg-primary/5"
              onClick={() => setIsOpen(false)}
            >
              Quick Access Hub
            </Link>

            {user?.email === 'computercorner@gmail.com' && (
              <Link 
                to="/admin"
                className="text-lg font-bold text-primary uppercase tracking-widest border border-primary/20 p-4 rounded-2xl bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                Admin Portal
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-lg font-bold text-red-400 uppercase tracking-widest border border-red-500/20 p-4 rounded-2xl bg-red-500/5 mx-auto w-full flex justify-center items-center gap-2"
              >
                <LogOut size={20} /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsOpen(false);
                }}
                className="text-lg font-bold text-white uppercase tracking-widest border border-white/20 p-4 rounded-2xl bg-white/5 mx-auto w-full flex justify-center items-center gap-2"
              >
                <UserIcon size={20} /> Sign In
              </button>
            )}
            
            <div className="flex justify-center gap-8 pt-4 border-t border-white/5">
              <a href="https://www.facebook.com/computercornerjgm/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://www.instagram.com/computer_corner_15?igsh=MWQ5c2w0aGp2eHdpeQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://www.youtube.com/@computercorner15" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
