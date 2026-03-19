
import React from 'react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl pt-0"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 px-8 py-4 rounded-full shadow-2xl flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-serif text-2xl font-black text-[#2D4F3E] tracking-tighter">JAMU JIVA</span>
        </div>
        
        <div className="hidden md:flex space-x-10 text-[#2D4F3E] font-bold text-xs uppercase tracking-widest">
          <a href="#benefits" className="hover:text-[#F47C3E] transition-colors">Benefits</a>
          <a href="#story" className="hover:text-[#F47C3E] transition-colors">Culture</a>
          <a href="#waitlist" className="hover:text-[#F47C3E] transition-colors">Drops</a>
        </div>

        <a 
          href="#waitlist" 
          className="bg-[#2D4F3E] text-white px-6 py-2.5 rounded-full font-black text-xs hover:bg-[#F47C3E] transition-all"
        >
          JOIN THE LIST
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
