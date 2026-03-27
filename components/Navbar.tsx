
import React from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const shellOpacity = useTransform(scrollY, [0, 80], [0, 0.96]);
  const shellBorderOpacity = useTransform(scrollY, [0, 80], [0, 0.12]);
  const shellShadowOpacity = useTransform(scrollY, [0, 80], [0, 0.16]);
  const textProgress = useTransform(scrollY, [0, 80], [0, 1]);

  const shellBackground = useMotionTemplate`rgba(245, 242, 237, ${shellOpacity})`;
  const shellBorder = useMotionTemplate`rgba(45, 79, 62, ${shellBorderOpacity})`;
  const shellShadow = useMotionTemplate`0 18px 40px rgba(45, 79, 62, ${shellShadowOpacity})`;
  const navTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#2D4F3E']);
  const buttonBackground = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.12)', '#2D4F3E']);
  const buttonTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#FFFFFF']);
  const buttonBorder = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.45)', '#2D4F3E']);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl pt-0"
    >
      <motion.div
        style={{
          backgroundColor: shellBackground,
          borderColor: shellBorder,
          boxShadow: shellShadow,
        }}
        className="border px-8 py-4 rounded-full backdrop-blur-xl flex justify-between items-center transition-colors"
      >
        <div className="flex items-center">
          <motion.span style={{ color: navTextColor }} className="font-serif text-2xl font-black tracking-tighter">
            JAMU JIVA
          </motion.span>
        </div>
        
        <motion.div style={{ color: navTextColor }} className="hidden md:flex space-x-10 font-bold text-xs uppercase tracking-widest">
          <a href="#benefits" className="hover:text-[#F47C3E] transition-colors">Benefits</a>
          <a href="#ingredients" className="hover:text-[#F47C3E] transition-colors">Ingredients</a>
          <a href="#story" className="hover:text-[#F47C3E] transition-colors">Culture</a>
          <a href="#waitlist" className="hover:text-[#F47C3E] transition-colors">Drops</a>
        </motion.div>

        <motion.a 
          href="#waitlist" 
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
            borderColor: buttonBorder,
          }}
          className="px-6 py-2.5 rounded-full font-black text-xs border hover:bg-[#F47C3E] transition-all"
        >
          JOIN THE LIST
        </motion.a>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
