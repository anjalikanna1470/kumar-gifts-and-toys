import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, Heart, ShieldCheck, Truck, Clock, Gift, Award, MapPin, Phone, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function HomePage({ onNavigate, onOpenCustomizer, onSelectProduct }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch featured products
    fetch('/api/products?is_featured=1')
      .then(res => res.json())
      .then(data => setFeaturedProducts(Array.isArray(data) ? data : []))
      .catch(() => setFeaturedProducts([]));

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const whatsappUrl = `https://wa.me/919966327229?text=${encodeURIComponent('Hi Kumar Gifts & Toys, I want to inquire about custom gifts in Ongole!')}`;

  const occasions = [
    { title: '🎂 Birthday Gifts', occasion: 'Birthday' },
    { title: '❤️ Anniversary', occasion: 'Anniversary' },
    { title: '💑 Couple Gifts', occasion: 'Couple' },
    { title: '👶 Kids & Toys', occasion: 'Kids' },
    { title: '🎉 Special Occasions', occasion: 'Special Occasions' },
    { title: '🏠 Housewarming', occasion: 'Housewarming' },
  ];

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 text-white shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-4">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Text */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-200 border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" /> Ongole's Premier Gift & Toy Destination
            </div>

            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight">
              Gifts That Make Every Moment <span className="underline decoration-amber-300 decoration-wavy">Special</span>
            </h1>

            <p className="text-sm sm:text-lg text-rose-100 max-w-xl font-medium leading-relaxed">
              Discover unique gifts, adorable toys and personalized products for every occasion. Turn your memories into meaningful keepsakes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-rose-600 hover:bg-rose-50 font-extrabold text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('customized')}
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Create a Custom Gift
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex items-center justify-center md:justify-start gap-6 text-xs text-rose-100">
              <span className="flex items-center gap-1">✓ Fast Local Turnaround</span>
              <span className="flex items-center gap-1">✓ Reasonable Prices</span>
              <span className="flex items-center gap-1">✓ 4.5★ Rated</span>
            </div>
          </div>

          {/* Right Showcase Image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group">
              <img
                src="/images/hero_banner.png"
                alt="Kumar Gifts & Toys Display"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/30 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                    4.5★
                  </div>
                  <div>
                    <p className="font-bold text-sm">36+ Verified Customer Reviews</p>
                    <p className="text-[10px] text-slate-500 font-normal">Lawyer Pet Extension, Ongole</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            Browse By Category
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Find the Perfect Gift Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.slug })}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-rose-100/60 dark:border-slate-700/60 shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-rose-50 dark:bg-slate-700 p-1 group-hover:scale-108 transition-transform duration-300">
                <img
                  src={cat.image_url || '/images/custom_mug.png'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CUSTOMIZED GIFTS SPOTLIGHT ("Make It Personal ❤️") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300" /> Customization Studio
            </div>

            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl">
              Make It Personal ❤️
            </h2>

            <p className="text-sm sm:text-base text-rose-100">
              Turn your memories and ideas into meaningful gifts. Customize mugs, fluffy heart pillows, 3D acrylic LED photo lamps, and custom collage frames.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold pt-1">
              <span className="bg-white/20 px-3 py-1 rounded-lg">☕ Customized Mugs</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">🛏️ Customized Pillows</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">🖼️ 3D LED Frames</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">🔑 Keychains</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('customized')}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Customize Your Gift Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">
              Popular Choices
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Best Sellers in Ongole
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            View All Products <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpenCustomizer={onOpenCustomizer}
              onClickProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. OCCASION-BASED SHOPPING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Shopping Made Easy
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Shop Gifts By Occasion
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {occasions.map((occ) => (
            <button
              key={occ.occasion}
              onClick={() => onNavigate('shop', { occasion: occ.occasion })}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-rose-100 dark:border-slate-700 hover:border-rose-500 text-center space-y-1 shadow-sm hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white group-hover:text-rose-600">
                {occ.title}
              </h3>
              <span className="text-[10px] text-slate-400 block">Explore Gifts →</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 border border-rose-100 dark:border-slate-700">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">
              Why Choose Kumar Gifts & Toys?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Your satisfaction and smiles are at the heart of everything we craft.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-slate-700 text-rose-600 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Quality Products</h3>
              <p className="text-xs text-slate-400">Curated non-toxic toys and durable sublimation prints.</p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-700 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Reasonable Pricing</h3>
              <p className="text-xs text-slate-400">Best price guarantee for custom mugs and pillows.</p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Fast Turnaround</h3>
              <p className="text-xs text-slate-400">Custom orders prepared & packed within 24 hours.</p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Local Ongole Delivery</h3>
              <p className="text-xs text-slate-400">Doorstep delivery available across Ongole, AP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div>
          <div className="inline-flex items-center gap-1 text-amber-500 font-extrabold text-xl">
            <Star className="w-6 h-6 fill-amber-400" />
            <span>4.5 / 5.0</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-slate-900 dark:text-white mt-1">
            Loved By 36+ Local Customers in Ongole
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-3">
              "Best gift shop on Mangamuru Road! Ordered a customized photo mug for my wife's birthday. Print quality was super crisp."
            </p>
            <span className="text-xs font-bold text-slate-800 dark:text-white">— Srinivas R., Ongole</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-3">
              "Great collection of toys and soft teddy bears at reasonable prices. Staff was very helpful and delivered on time."
            </p>
            <span className="text-xs font-bold text-slate-800 dark:text-white">— Lakshmi K., Lawyer Pet</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-rose-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-3">
              "The heart photo pillow was amazing! Quick custom order turnaround and excellent customer service."
            </p>
            <span className="text-xs font-bold text-slate-800 dark:text-white">— Ramesh B., Ongole</span>
          </div>
        </div>
      </section>

      {/* 8. LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Visit Our Physical Shop</span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl">Kumar Gifts & Toys</h2>
            <p className="text-xs text-slate-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>Mangamuru Road, Lawyer Pet Extension, Ongole, Andhra Pradesh – 523001, India</span>
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Phone: 099663 27229</span>
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Order
              </a>
              <a
                href="tel:09966327229"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> Call Store Now
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden h-64 border border-slate-700 shadow-inner bg-slate-800 flex items-center justify-center relative">
            <iframe
              title="Kumar Gifts & Toys Location"
              src="https://maps.google.com/maps?q=Mangamuru+Road+Lawyer+Pet+Extension+Ongole+523001&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
