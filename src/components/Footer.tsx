/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark border-t border-white/5 py-20">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-white/10">
                <span className="font-bold text-primary text-xs">CC</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight">Computer</span>
                <span className="text-sm font-bold tracking-tight text-gray-400">Corner</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your one-stop destination for premium hardware sales and expert service in Jhargram. Authorized partners for industry-leading brands.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Store Inventory</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider text-white">
              <li><Link to="/catalog/Laptops" className="hover:text-primary transition-colors">Gaming Desktops & Laptops</Link></li>
              <li><Link to="/catalog/CCTV" className="hover:text-primary transition-colors">CCTV & DSLR Cameras</Link></li>
              <li><Link to="/catalog/Printers" className="hover:text-primary transition-colors">Printers & Xerox</Link></li>
              <li><Link to="/catalog" className="hover:text-primary transition-colors">TV, AC & Sound Systems</Link></li>
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Inverters & Online UPS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider text-white">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Digital Catalog</Link></li>
              <li><a href="#workshop" className="hover:text-primary transition-colors">Service Workshop</a></li>
              <li><a href="#amc" className="hover:text-primary transition-colors">AMC Maintenance</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Support Desk</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Direct Contact</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-primary mt-1" />
                <p className="text-sm text-gray-400">Opp. Street of R.B.M. School, Near Spandan Diagnostic, Raghunathpur, Jhargram, WB 721507</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-primary" />
                  <div className="text-sm text-gray-400 leading-tight">
                    <p className="font-bold text-white mb-1 uppercase tracking-tighter text-[10px]">Sales</p>
                    <p>+91 81674 89332</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-primary" />
                  <div className="text-sm text-gray-400 leading-tight">
                    <p className="font-bold text-white mb-1 uppercase tracking-tighter text-[10px]">Service</p>
                    <p>+91 95473 75565</p>
                    <p>+91 90642 60854</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-primary" />
                  <div className="text-sm text-gray-400 leading-tight">
                    <p className="font-bold text-white mb-1 uppercase tracking-tighter text-[10px]">Office</p>
                    <p>+91 75010 90919</p>
                  </div>
                </div>
              </div>
              <a 
                href="https://wa.me/918167489332"
                className="btn-accent w-full py-4 text-xs font-black flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                ORDER VIA WHATSAPP
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest text-center md:text-left">
            © {currentYear} COMPUTER CORNER JHARGRAM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
