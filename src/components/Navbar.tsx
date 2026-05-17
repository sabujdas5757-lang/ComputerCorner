/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Search, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

import { checkIfAdmin } from '../utils/admin';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = checkIfAdmin(user?.email);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-black border-b border-white/10 relative">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-2 flex justify-between items-center h-16 md:h-20">
        {/* Logo Section */}
        <div className="flex flex-col items-start relative z-20">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-white/10 group-hover:border-primary transition-colors">
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
            <div className="flex flex-col leading-none">
              <div className="flex flex-row">
                <span className="text-lg md:text-2xl font-extrabold tracking-tight text-white group-hover:text-primary transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>Computer</span>
                <span className="text-lg md:text-2xl font-extrabold tracking-tight text-[#5eb133] group-hover:text-green-400 transition-colors ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>Corner</span>
              </div>
            </div>
          </Link>
          
          <a 
            href="https://maps.app.goo.gl/bnvqKkYyeE5LaY3z5"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full hover:border-primary/50 transition-all hover:bg-white/10 group ml-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-[#888] group-hover:text-primary transition-colors whitespace-nowrap">The Ultimate Solution</span>
          </a>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-4xl mx-12">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input 
              type="text" 
              placeholder="Search for products, brands and more"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-800 rounded-sm py-2.5 px-4 pr-12 focus:outline-none shadow-sm placeholder:text-gray-400 text-sm font-medium"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800">
              <Search size={22} strokeWidth={2.5} />
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4 relative z-20">
          {/* Admin Icon for Mobile */}
          {isAdmin && (
            <Link 
              to="/admin"
              className="md:hidden p-2 text-primary hover:bg-white/10 rounded-full transition-colors"
              title="Admin Panel"
            >
              <ShieldCheck size={22} />
            </Link>
          )}

          {/* Mobile Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Search size={22} />
          </button>

          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link 
                to="/admin"
                className="text-primary hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border border-primary/20 px-3 py-1.5 rounded-lg bg-primary/5"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}
            <Link 
              to="/quick-access"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-lg bg-white/5"
            >
              <MessageSquare size={14} />
              Contact Us
            </Link>
          </div>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              {!isAdmin && (
                <Link
                  to="/profile"
                  className="bg-primary/10 text-primary border border-primary/20 font-bold px-3 py-2 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs hover:bg-primary hover:text-black transition-all shadow-sm flex items-center gap-2"
                >
                  <UserIcon size={14} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-white/10 text-white border border-white/10 font-bold px-3 py-2 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs hover:bg-white/20 transition-all shadow-sm flex items-center gap-2"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary text-black font-black px-4 py-2 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs hover:bg-primary/90 transition-all shadow-lg flex items-center gap-2"
            >
              <UserIcon size={14} className="sm:hidden" />
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Join</span>
            </button>
          )}
          {/* Extra Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/5 flex items-center justify-center"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-white/10 z-10 shadow-2xl"
          >
            <div className="w-full px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Quick Links</h3>
                <div className="flex flex-col gap-3">
                  <Link to="/catalog" onClick={() => setIsOpen(false)} className="text-white hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm">Products Catalog</Link>
                  {user && !isAdmin && (
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="text-white hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm text-green-400">My Profile</Link>
                  )}
                  <Link to="/quick-access" onClick={() => setIsOpen(false)} className="text-white hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm">Contact Us & Support</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-primary hover:text-white transition-colors font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">Contact Info</h3>
                <div className="flex flex-col gap-3">
                  <span className="text-gray-400 text-sm">Raghunathpur, Jhargram</span>
                  <span className="text-gray-400 text-sm">+91 75010 90919</span>
                  <span className="text-gray-400 text-sm">computercorner15@yahoo.com</span>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <Link 
                  to="/quick-access" 
                  onClick={() => setIsOpen(false)}
                  className="bg-white text-black p-4 rounded-xl text-center font-black uppercase tracking-widest text-xs hover:bg-primary transition-colors"
                >
                  Contact Us Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-primary/50 transition-all font-medium"
                  autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                  <Search size={22} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
