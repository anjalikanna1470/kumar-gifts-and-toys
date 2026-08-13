import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, ShieldCheck, Truck, HelpCircle } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      <h1 className="font-serif font-bold text-3xl text-center">About Kumar Gifts & Toys</h1>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        Located in the heart of Lawyer Pet Extension, Mangamuru Road, Ongole, <strong>Kumar Gifts & Toys</strong> is your trusted local shop for unique toys, personalized mugs, custom photo pillows, 3D acrylic LED lamps, and curated celebration hampers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 text-center space-y-2">
          <h3 className="font-bold text-sm text-rose-600">Personalized Gifts</h3>
          <p className="text-xs text-slate-500">HD sublimation prints on mugs, pillows, frames, and keychains.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 text-center space-y-2">
          <h3 className="font-bold text-sm text-amber-600">Quality Toys</h3>
          <p className="text-xs text-slate-500">Non-toxic soft plush teddies, remote control cars, and educational puzzles.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 text-center space-y-2">
          <h3 className="font-bold text-sm text-emerald-600">Local Delivery</h3>
          <p className="text-xs text-slate-500">Fast doorstep local delivery across Ongole, Andhra Pradesh.</p>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const whatsappUrl = `https://wa.me/919966327229?text=${encodeURIComponent('Hi Kumar Gifts & Toys, I want to contact the shop in Ongole.')}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-3xl">Contact Kumar Gifts & Toys</h1>
        <p className="text-xs text-slate-500">Visit our shop or reach out for custom orders in Ongole</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-rose-100 dark:border-slate-700 space-y-4 shadow-sm text-xs">
          <h3 className="font-bold text-sm text-rose-600">Store Contact Information</h3>
          <p className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span><strong>Kumar Gifts & Toys</strong><br />Mangamuru Road, Lawyer Pet Extension, Ongole, AP – 523001</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Phone: 099663 27229</span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Store Hours: Daily 9:00 AM – 9:45 PM</span>
          </p>

          <div className="flex gap-3 pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> WhatsApp Chat
            </a>
            <a href="tel:09966327229" className="px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl flex items-center gap-1">
              <Phone className="w-4 h-4" /> Call Store
            </a>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden h-72 border border-slate-300 dark:border-slate-700">
          <iframe
            title="Location Map"
            src="https://maps.google.com/maps?q=Mangamuru+Road+Lawyer+Pet+Extension+Ongole+523001&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const faqs = [
    { q: 'How long does a customized photo mug or pillow take?', a: 'Custom orders are printed and ready for packing within 24 hours at our Ongole shop!' },
    { q: 'Can I upload my own photo for mugs and pillows?', a: 'Yes! Use our Live Customizer tool to upload photos from your smartphone or laptop.' },
    { q: 'Do you offer local delivery in Ongole?', a: 'Yes, we provide fast doorstep local delivery across Ongole, Andhra Pradesh.' },
    { q: 'What payment options are available?', a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and Cards.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in">
      <h1 className="font-serif font-bold text-3xl text-center">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 space-y-1">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-500" /> {f.q}
            </h3>
            <p className="text-xs text-slate-500 pl-6">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
