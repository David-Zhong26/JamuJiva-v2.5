import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';
import demoJivaBottle from '../materials/demo jiva removed.png';

interface PosterCanvasProps {
  sectionRef: React.RefObject<HTMLElement>;
  posterUrl: string;
  isGenerating: boolean;
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({ 
  sectionRef,
  posterUrl, 
  isGenerating, 
  email, 
  setEmail, 
  onJoin, 
  joined 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // EaseInOut for smooth, premium feel
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const smoothProgress = useTransform(scrollYProgress, (v) => easeInOutCubic(v));

  // Background: subtle scale and fade
  const imageScale = useTransform(smoothProgress, [0, 0.8, 1], [1, 1.15, 1.25]);
  const bgOpacity = useTransform(smoothProgress, [0.5, 0.85, 1], [1, 0.6, 0]);

  // Text: subtle parallax, fades as bottle covers it
  const textY = useTransform(smoothProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(smoothProgress, [0, 0.5, 0.9, 1], [1, 1, 0.4, 0]);

  // Bottle: the main storyline element
  // Initial: opacity 0, scale 0.8, centered
  // On scroll: fades in, scales to match background bottle, moves slightly down, comes in front of text
  const bottleOpacity = useTransform(smoothProgress, [0, 0.18], [0, 1]);
  const bottleScale = useTransform(smoothProgress, [0, 0.25, 0.6], [0.8, 1, 1.15]);
  const bottleY = useTransform(smoothProgress, [0, 0.2, 0.6], [0, 15, 35]);
  const bottleZIndex = useTransform(smoothProgress, [0.32, 0.45], [5, 30]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-7xl aspect-[4/5] md:aspect-[16/9] bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border-[8px] md:border-[16px] border-white group"
    >
      <motion.div style={{ scale: imageScale, opacity: bgOpacity }} className="absolute inset-0 z-0">
        <motion.img 
          src={posterUrl} 
          alt="Jamu Jiva Lifestyle" 
          className="w-full h-full object-cover"
          animate={{ opacity: isGenerating ? 0.3 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D4F3E]/80 via-transparent to-black/30"></div>
      </motion.div>

      {/* Text - sits behind bottle as it scales up (depth effect) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 text-white pointer-events-auto">
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="bg-white text-[#2D4F3E] px-5 py-2 rounded-xl font-black text-xs md:text-sm tracking-tighter rotate-[-2deg] shadow-xl"
          >
            HERITAGE MEETS HUSTLE
          </motion.div>
        </div>

        <motion.div style={{ y: textY, opacity: textOpacity }} className="max-w-4xl">
          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-[clamp(2.5rem,10vw,8.5rem)] font-black leading-[0.8] tracking-tight"
          >
            DRINK THE <br />
            <span className="text-[#F9D067]">LIFE YOU</span> <br />
            DESERVE
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 flex items-center gap-4 text-[#F9D067] font-bold tracking-widest text-xs uppercase"
          >
            <span className="w-12 h-[1px] bg-[#F9D067]"></span>
            Experience the scroll
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="w-full md:max-w-md">
            {!joined ? (
              <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onSubmit={onJoin} 
                className="flex p-1.5 bg-white/20 backdrop-blur-2xl rounded-full border border-white/30"
              >
                <input 
                  type="email" 
                  placeholder="Join the drop..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-6 py-3 focus:outline-none placeholder-white/60 font-semibold"
                />
                <button type="submit" className="bg-white text-[#F47C3E] px-8 py-3 rounded-full font-black hover:bg-[#F9D067] hover:text-[#2D4F3E] transition-all flex items-center gap-2">
                  ACCESS <Send className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#2D4F3E] border border-white/30 px-8 py-4 rounded-full font-black">
                YOU'RE ON THE LIST 🔥
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Bottle - main storyline: fades in, scales up, moves down, comes in front of text */}
      <motion.div
        style={{
          scale: bottleScale,
          y: bottleY,
          opacity: bottleOpacity,
          zIndex: bottleZIndex
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <img
          src={demoJivaBottle}
          alt="Jamu Jiva Bottle"
          className="w-[100%] min-w-[900px] max-w-[1200px] h-auto object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
};

export default PosterCanvas;
