import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ritualLifestyleImg from '../materials/ritual-lifestyle.png';

const DURING_LINES = [
  'Create a slower morning moment',
  'Replace overly sweet drinks',
  'Build a more intentional routine',
];

const OVER_TIME_LINES = [
  'Feel more grounded throughout the day',
  'Crave less artificial sweetness',
  'Associate wellness with enjoyment instead of restriction',
];

const DailyRitualSection: React.FC = () => {
  return (
    <section
      id="ritual"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5E8CA] via-[#F3DFA8]/90 to-[#F5E8CA] px-5 py-16 md:px-10 md:py-24"
    >
      <div
        className="pointer-events-none absolute left-[6%] top-[18%] h-[min(42vw,320px)] w-[min(42vw,320px)] rounded-full bg-[#2D4F3E]/14 blur-[72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[6%] bottom-[12%] h-72 w-72 rounded-full bg-[#E5C76B]/28 blur-[72px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
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
          className="text-left"
        >
          <p className="font-bold text-xs uppercase tracking-widest text-[#2D4F3E]/70">
            Small moments add up
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-tight text-[#2D4F3E]">
            Start your ritual.
          </h2>
          <p className="mt-4 max-w-md text-xs font-bold uppercase leading-relaxed tracking-widest text-[#2D4F3E]/72 md:text-sm">
            No streaks, no guilt—just a drink worth returning to.
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold lowercase text-[#2D4F3E] md:text-2xl">
                during your ritual
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.8rem] font-medium uppercase leading-snug tracking-wide text-[#2D4F3E]/85 md:text-sm">
                {DURING_LINES.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold lowercase text-[#2D4F3E] md:text-2xl">
                over time
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.8rem] font-medium uppercase leading-snug tracking-wide text-[#2D4F3E]/85 md:text-sm">
                {OVER_TIME_LINES.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/shop?pack=case30"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#F47C3E] px-8 py-4 text-center text-sm font-black uppercase tracking-widest text-white transition-transform hover:brightness-[1.03] active:scale-[0.99] sm:w-auto"
            >
              Shop product details
            </Link>
            <p className="text-center text-[0.7rem] font-medium uppercase tracking-wider text-[#2D4F3E]/65 sm:text-left md:text-xs">
              One-time case · 30 bottles — select on the next page
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyRitualSection;
