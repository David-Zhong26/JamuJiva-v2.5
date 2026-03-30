import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ScrollStory from './components/ScrollStory';
import Footer from './components/Footer';
import { motion, useScroll, useSpring } from "framer-motion";
import { supabase } from './supabase';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      alert('Please enter your email.');
      return;
    }

    const { error } = await supabase
      .from('subscribers')
      .insert([{ email: cleanedEmail }]);

    if (error) {
      alert(error.message);
      return;
    }

    setJoined(true);
    setEmail('');
  };

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#F47C3E] z-[60] origin-left"
        style={{ scaleX }}
      />
      <Navbar />
      <main className="pt-0">
        <ScrollStory
          email={email}
          setEmail={setEmail}
          onJoin={handleJoin}
          joined={joined}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;