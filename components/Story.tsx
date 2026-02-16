
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import demoJiva from '../materials/demo jiva.jpg';

const Story: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const img1Opacity = useTransform(scrollYProgress, [0, 0.33], [1, 0]);
  const img2Opacity = useTransform(scrollYProgress, [0.33, 0.66], [0, 1]);
  const img2Scale = useTransform(scrollYProgress, [0.33, 0.66], [0.8, 1]);

  return (
    <section id="story" ref={containerRef} className="relative h-[300vh] bg-[#2D4F3E] text-[#F5F2ED]">
      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Sticky Text */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-24 z-10">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#F9D067] font-black tracking-widest uppercase text-sm mb-6"
          >
            The Origin Story
          </motion.span>
          <h2 className="font-serif text-5xl md:text-8xl font-black mb-8 leading-[0.9]">
            ROOTED IN <br /> <span className="text-[#F47C3E]">TRADITION.</span>
          </h2>
          <div className="max-w-lg space-y-6 text-xl opacity-80 font-medium">
            <p>
              In the misty mornings of Solo, the Mbok Jamu begins her ritual. Carrying baskets of hand-ground tonics, she is the keeper of her village's health.
            </p>
            <p>
              Jamu Jiva was born from a desire to bring this act of care to the fast-paced streets of NYC and LA. We don't just sell a drink; we share a lifestyle of intentional vitality.
            </p>
          </div>
        </div>

        {/* Right: Changing Imagery */}
        <div className="flex-1 relative">
          <motion.div 
            style={{ opacity: img1Opacity }}
            className="absolute inset-0 bg-cover bg-center"
          >
            <img src={demoJiva} alt="Jamu Story" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            style={{ opacity: img2Opacity, scale: img2Scale }}
            className="absolute inset-0 bg-cover bg-center"
          >
            <img src={demoJiva} alt="Jamu Story" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </section>
  );
};

export default Story;
