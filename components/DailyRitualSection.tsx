import React from 'react';
import { motion } from 'framer-motion';
import ritualLifestyleImg from '../materials/ritual-lifestyle.png';

const DailyRitualSection: React.FC = () => {
  return (
    <section
      id="ritual"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5E8CA] via-[#F3DFA8]/90 to-[#F5E8CA] px-5 py-12 md:px-10 md:py-20"
    >
      <div
        className="pointer-events-none absolute left-[6%] top-[18%] h-[min(42vw,320px)] w-[min(42vw,320px)] rounded-full bg-[#2D4F3E]/14 blur-[72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[6%] bottom-[12%] h-72 w-72 rounded-full bg-[#E5C76B]/28 blur-[72px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid translate-x-3 items-center gap-8 sm:translate-x-4 md:translate-x-6 md:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:translate-x-8 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border-2 border-[#2D4F3E]/25 bg-[#F5E8CA]"
          >
            <img
              src={ritualLifestyleImg}
              alt="Jamu Jiva wellness shot on a sunlit table"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[180px] items-center justify-center lg:min-h-[360px] lg:pl-4 xl:pl-8"
          >
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-tight text-[#2D4F3E] lg:-translate-x-2">
              Coming soon.
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DailyRitualSection;
