import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventsAdminPage from './pages/EventsAdminPage';
import FaqPage from './pages/FaqPage';
import JournalPage from './pages/JournalPage';
import RitualPage from './pages/RitualPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { MailingListProvider } from './contexts/MailingListContext';
import shopMerchImg from './materials/shop-merch.png';

const MerchPlaceholder: React.FC = () => (
  <main className="relative flex jj-min-screen items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={shopMerchImg}
        alt=""
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#3A1A10]/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_55%)]" />
    </div>
    <div className="relative z-10 px-6 pb-16 pt-28 text-center">
      <h1 className="font-serif text-5xl leading-none text-[#F6F1E8] sm:text-6xl md:text-[4.25rem]">
        Merch
      </h1>
      <p className="mt-4 text-base text-white/90 sm:text-lg">Coming soon.</p>
    </div>
  </main>
);

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith('/admin');

  return (
    <div className="relative">
      <Navbar />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<ScrollStory />} />
          <Route path="/shop/success" element={<ShopSuccessPage />} />
          <Route path="/shop/cancel" element={<ShopCancelPage />} />
          <Route path="/shop/*" element={<ShopPage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/admin/events" element={<EventsAdminPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/ritual" element={<RitualPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/merch" element={<MerchPlaceholder />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </main>
      {hideFooter ? null : <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MailingListProvider>
        <HashScroll />
        <AppShell />
        <Analytics />
        <SpeedInsights />
      </MailingListProvider>
    </BrowserRouter>
  );
};

export default App;
