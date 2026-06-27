import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import ScrollStory from './components/ScrollStory';
import Footer from './components/Footer';
import HashScroll from './components/HashScroll';
import ShopPage from './pages/ShopPage';
import ShopCancelPage from './pages/ShopCancelPage';
import ShopSuccessPage from './pages/ShopSuccessPage';
import CulturePage from './pages/CulturePage';
import FaqPage from './pages/FaqPage';
import JournalPage from './pages/JournalPage';
import RitualPage from './pages/RitualPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { MailingListProvider } from './contexts/MailingListContext';

const MerchPlaceholder: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] pt-28 pb-16">
    <div className="text-center">
      <h1 className="font-serif text-4xl md:text-5xl font-black text-[#2D4F3E] mb-4">Merch</h1>
      <p className="text-[#2D4F3E]/70 text-lg">Coming soon.</p>
    </div>
  </main>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MailingListProvider>
        <HashScroll />
        <div className="relative">
          <Navbar />
          <main className="pt-0">
            <Routes>
              <Route path="/" element={<ScrollStory />} />
              <Route path="/shop/success" element={<ShopSuccessPage />} />
              <Route path="/shop/cancel" element={<ShopCancelPage />} />
              <Route path="/shop/*" element={<ShopPage />} />
              <Route path="/culture" element={<CulturePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/ritual" element={<RitualPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/merch" element={<MerchPlaceholder />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </MailingListProvider>
    </BrowserRouter>
  );
};

export default App;
