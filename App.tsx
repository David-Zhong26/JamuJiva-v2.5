import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollStory from './components/ScrollStory';
import Footer from './components/Footer';
import HashScroll from './components/HashScroll';
import ShopPage from './pages/ShopPage';
import { MailingListProvider } from './contexts/MailingListContext';
import { motion, useScroll, useSpring } from 'framer-motion';

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
            </Routes>
          </main>
          <Footer />
        </div>
      </MailingListProvider>
    </BrowserRouter>
  );
};

export default App;
