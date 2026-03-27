
import React from 'react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const shellOpacity = useTransform(scrollY, [0, 80], [0, 0.96]);
  const shellBorderOpacity = useTransform(scrollY, [0, 80], [0, 0.12]);
  const textProgress = useTransform(scrollY, [0, 80], [0, 1]);

  const shellBackground = useMotionTemplate`rgba(248, 214, 103, ${shellOpacity})`;
  const shellBorder = useMotionTemplate`rgba(45, 79, 62, ${shellBorderOpacity})`;
  const navTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#2D4F3E']);
  const buttonBackground = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.12)', '#2D4F3E']);
  const buttonTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#FFFFFF']);
  const buttonBorder = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.45)', '#2D4F3E']);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 z-50 w-full"
    >
      <motion.div
        style={{
          backgroundColor: shellBackground,
          borderColor: shellBorder,
        }}
        className="w-full border-b px-6 md:px-10 py-4 transition-colors"
      >
        <div className="flex items-center justify-between gap-6">
          <motion.span style={{ color: navTextColor }} className="font-serif text-2xl font-black tracking-tighter">
            JAMU JIVA
          </motion.span>

          <div className="ml-auto flex items-center gap-6 md:gap-10">
            <motion.div style={{ color: navTextColor }} className="hidden md:flex items-center space-x-10 font-bold text-xs uppercase tracking-widest">
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
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
