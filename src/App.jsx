import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import CustomGiftBuilderModal from './components/CustomGiftBuilderModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AboutPage, ContactPage, FAQPage } from './pages/InfoPages';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState(null);

  const navigate = (page, params = {}) => {
    setActivePage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomizer = (product) => {
    setCustomizerProduct(product);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            
            <div className="min-h-screen flex flex-col justify-between bg-amber-50/40 dark:bg-slate-900 transition-colors">
              
              {/* Top Navigation */}
              <Navbar
                activePage={activePage}
                onNavigate={navigate}
                onOpenSearch={() => setIsSearchOpen(true)}
              />

              {/* Main Content Area */}
              <main className="flex-1">
                {activePage === 'home' && (
                  <HomePage
                    onNavigate={navigate}
                    onOpenCustomizer={handleOpenCustomizer}
                    onSelectProduct={(prod) => navigate('product', { id: prod.id })}
                  />
                )}

                {activePage === 'shop' && (
                  <ShopPage
                    initialCategory={pageParams.category}
                    initialOccasion={pageParams.occasion}
                    onOpenCustomizer={handleOpenCustomizer}
                    onSelectProduct={(prod) => navigate('product', { id: prod.id })}
                  />
                )}

                {activePage === 'customized' && (
                  <ShopPage
                    initialCategory="customized-gifts"
                    onOpenCustomizer={handleOpenCustomizer}
                    onSelectProduct={(prod) => navigate('product', { id: prod.id })}
                  />
                )}

                {activePage === 'offers' && (
                  <ShopPage
                    sortBy="price_low"
                    onOpenCustomizer={handleOpenCustomizer}
                    onSelectProduct={(prod) => navigate('product', { id: prod.id })}
                  />
                )}

                {activePage === 'product' && (
                  <ProductDetailPage
                    productIdOrSlug={pageParams.id}
                    onOpenCustomizer={handleOpenCustomizer}
                    onProceedToCheckout={() => navigate('checkout')}
                  />
                )}

                {activePage === 'checkout' && (
                  <CheckoutPage
                    onNavigate={navigate}
                  />
                )}

                {activePage === 'track' && (
                  <OrderTrackingPage
                    initialQuery={pageParams.query}
                  />
                )}

                {activePage === 'account' && (
                  <AccountPage onNavigate={navigate} />
                )}

                {activePage === 'wishlist' && (
                  <AccountPage onNavigate={navigate} />
                )}

                {activePage === 'login' && (
                  <LoginPage onNavigate={navigate} />
                )}

                {activePage === 'admin-login' && (
                  <AdminLoginPage onNavigate={navigate} />
                )}

                {activePage === 'admin' && (
                  <AdminDashboardPage onNavigate={navigate} />
                )}

                {activePage === 'about' && <AboutPage />}
                {activePage === 'contact' && <ContactPage />}
                {activePage === 'faq' && <FAQPage />}
              </main>

              {/* Footer */}
              <Footer onNavigate={navigate} />

              {/* Sticky Mobile Bottom Bar */}
              <MobileBottomNav activePage={activePage} onNavigate={navigate} />

              {/* Slide-out Cart Drawer */}
              <CartDrawer onProceedToCheckout={() => navigate('checkout')} />

              {/* Global Search Modal */}
              <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onOpenCustomizer={handleOpenCustomizer}
                onSelectProduct={(prod) => navigate('product', { id: prod.id })}
              />

              {/* Interactive Live Customizer Modal */}
              <CustomGiftBuilderModal
                product={customizerProduct}
                isOpen={Boolean(customizerProduct)}
                onClose={() => setCustomizerProduct(null)}
              />

              {/* Floating WhatsApp Button */}
              <WhatsAppFloatingButton />

            </div>

          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
