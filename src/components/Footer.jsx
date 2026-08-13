import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Heart, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const whatsappUrl = `https://wa.me/919966327229?text=${encodeURIComponent('Hi Kumar Gifts & Toys, I want to inquire about custom gifts in Ongole.')}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Store Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-serif font-black text-lg">
                K
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Kumar Gifts & Toys
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Your trusted local destination for unique, thoughtful, and personalized gifts in Ongole, Andhra Pradesh. Turn your memories and ideas into meaningful gifts.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
              <a 
                href="tel:09966327229"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" /> Call Store
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-rose-400 transition-colors">Home Page</button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-rose-400 transition-colors">All Products & Toys</button>
              </li>
              <li>
                <button onClick={() => onNavigate('customized')} className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Customized Gift Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-rose-400 transition-colors">Special Offers & Discounts</button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-rose-400 transition-colors">Track Order Status</button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="text-slate-500 hover:text-amber-400 transition-colors">Store Admin Portal</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-rose-400 transition-colors">About Our Ongole Store</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-rose-400 transition-colors">Contact Us & Google Map</button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-rose-400 transition-colors">Frequently Asked Questions</button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-rose-400 transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping')} className="hover:text-rose-400 transition-colors">Shipping & Local Delivery Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('returns')} className="hover:text-rose-400 transition-colors">Return & Refund Policy</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Location & Hours */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Visit Store in Ongole
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  <strong>Kumar Gifts & Toys</strong><br />
                  Mangamuru Road, Lawyer Pet Extension,<br />
                  Ongole, Andhra Pradesh – 523001
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Open Daily: 9:00 AM – 9:45 PM</span>
              </div>

              <a 
                href="https://maps.google.com/?q=Mangamuru+Road+Lawyer+Pet+Extension+Ongole+523001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-rose-400 hover:text-rose-300 underline pt-1"
              >
                Get Google Maps Directions →
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Kumar Gifts & Toys. All rights reserved. Lawyer Pet Extension, Ongole, AP – 523001.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for gift lovers in Ongole
          </p>
        </div>

      </div>
    </footer>
  );
}
