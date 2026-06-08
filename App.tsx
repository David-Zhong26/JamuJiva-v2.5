import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollStory from './components/ScrollStory';
import Footer from './components/Footer';
import HashScroll from './components/HashScroll';
import ShopPage from './pages/ShopPage';
import CulturePage from './pages/CulturePage';
import JournalPage from './pages/JournalPage';
import RitualPage from './pages/RitualPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { MailingListProvider } from './contexts/MailingListContext';
import { motion, useScroll, useSpring } from 'framer-motion';

const MerchPlaceholder: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] pt-28 pb-16">
    <div className="text-center">
      <h1 className="font-serif text-4xl md:text-5xl font-black text-[#2D4F3E] mb-4">Merch</h1>
      <p className="text-[#2D4F3E]/70 text-lg">Coming soon.</p>
    </div>
  </main>
);

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <BrowserRouter>
      <MailingListProvider>
        <HashScroll />
        <div className="relative">
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-[#F47C3E] z-[60] origin-left"
            style={{ scaleX }}
          />
          <Navbar />
          <main className="pt-0">
            <Routes>
              <Route path="/" element={<ScrollStory />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/culture" element={<CulturePage />} />
              <Route path="/ritual" element={<RitualPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/merch" element={<MerchPlaceholder />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MailingListProvider>
    </BrowserRouter>
  );
};

export default App;
