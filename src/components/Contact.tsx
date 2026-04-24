import React, { useState } from 'react';
import { Phone, MapPin, Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Buy New Product',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const text = `*New Inquiry from Computer Corner Website*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Service:* ${formData.service}%0A` +
      `*Message:* ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/918167489332?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-32 bg-bg-dark border-t border-white/5">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-6">Connect with us</p>
            <h2 className="text-6xl font-bold tracking-tight mb-8">Let's solve your tech needs.</h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Drop by our store in Raghunathpur or give us a call. We're ready to help you pick the right hardware or fix your current setup.
            </p>

            <div className="space-y-10">
              <a 
                href="https://maps.app.goo.gl/WCA8wHJsHJ8CnupcA" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-start gap-6 group cursor-pointer"
              >
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/50 group-hover:text-primary transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Our Location</p>
                   <p className="text-lg font-bold text-white group-hover:text-primary transition-colors">Opp. Street of R.B.M. School</p>
                   <p className="text-sm text-gray-400">Near Spandan Diagnostic, Raghunathpur, Jhargram</p>
                   <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-2 block opacity-0 group-hover:opacity-100 transition-all">Open in Google Maps →</span>
                </div>
              </a>

              <div className="flex items-start gap-6 group cursor-pointer">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/50 group-hover:text-primary transition-all">
                  <Phone size={24} />
                </div>
                <div className="space-y-4">
                   <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Sales Hotline</p>
                     <p className="text-lg font-bold text-white">+91 81674 89332</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Service Desk</p>
                     <p className="text-lg font-bold text-white">+91 95473 75565</p>
                     <p className="text-lg font-bold text-white">+91 90642 60854</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Office Line</p>
                     <p className="text-lg font-bold text-white">+91 75010 90919</p>
                   </div>
                </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/50 group-hover:text-primary transition-all">
                  <Mail size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Support</p>
                   <p className="text-lg font-bold text-white">computercorner15@yahoo.in</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-dark p-12">
            <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all" 
                    placeholder="+91 XXXX XXXX" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Your Hardware/Issue</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-gray-400"
                >
                  <option>Buy New Product</option>
                  <option>Laptop Repair</option>
                  <option>Printer Service</option>
                  <option>AMC Inquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Message</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all resize-none" 
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button type="submit" className="btn-accent w-full py-5 text-lg">Send Message</button>
              
              <div className="pt-4 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <MessageSquare size={14} />
                <p>Or chat with us on WhatsApp for faster response</p>
              </div>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-20 rounded-[40px] overflow-hidden border border-white/10 h-[450px] relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.8732840003!2d86.9922222!3d22.4491667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d95b5b5b5b5b5%3A0x0!2zMjLCsDI2JzU3LjAiTiA4NsKwNTknMzIuMCJF!5e0!3m2!1sen!2sin!4v1713770000000!5m2!1sen!2sin&q=R.B.M.+School+Jhargram"
            className="w-full h-full grayscale invert opacity-70"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="absolute top-6 left-6 bg-surface/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 hidden md:block">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Locate Us</p>
            <p className="text-sm font-bold">Opp. R.B.M. School, Jhargram</p>
          </div>
        </div>
      </div>
    </section>
  );
}
