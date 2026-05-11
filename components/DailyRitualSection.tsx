import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

type RitualItem = {
  id: string;
  title: string;
  leftTitle: string;
  leftLines: string[];
  rightTitle: string;
  rightLines: string[];
  glowRight?: boolean;
};

const RITUAL_ITEMS: RitualItem[] = [
  {
    id: 'daily',
    title: 'DAILY RITUALS',
    leftTitle: 'during your ritual',
    leftLines: [
      'Create a slower morning moment',
      'Replace overly sweet drinks',
      'Build a more intentional routine',
    ],
    rightTitle: 'over time',
    rightLines: [
      'Feel more grounded throughout the day',
      'Crave less artificial sweetness',
      'Associate wellness with enjoyment instead of restriction',
    ],
    glowRight: true,
  },
  {
    id: 'notice',
    title: 'WHAT YOU MAY NOTICE',
    leftTitle: 'in the first weeks',
    leftLines: [
      'A brighter, steadier baseline energy',
      'More curiosity about herbs and roots',
      'Less reliance on sugary pick-me-ups',
    ],
    rightTitle: 'as it becomes habit',
    rightLines: [
      'Jamu feels less like a “hack” and more like a pause',
      'Your palate leans cleaner, naturally',
      'Small rituals start to anchor bigger days',
    ],
    glowRight: false,
  },
  {
    id: 'membership',
    title: 'MEMBERSHIP PERKS',
    leftTitle: 'for subscribers',
    leftLines: [
      'First access to seasonal batches',
      'Member-only pricing on restocks',
      'Surprise gifts with qualifying orders',
    ],
    rightTitle: 'the vibe',
    rightLines: [
      'Editorial notes on each formulation',
      'Invites to tastings and pop-ups',
      'A community that treats wellness as culture—not a chore',
    ],
    glowRight: true,
  },
];

const DailyRitualSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('daily');
  const sectionTitleId = useId();

  const toggle = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <section
      id="ritual"
      className="relative overflow-hidden bg-[#F5F2ED] px-5 py-20 md:px-8 md:py-28"
      aria-labelledby={sectionTitleId}
    >
      <div
        className="pointer-events-none absolute -left-[12%] top-[8%] h-[min(380px,70vw)] w-[min(380px,70vw)] rounded-full bg-[#7EB8A8]/30 blur-[72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-8%] top-[22%] h-[min(340px,60vw)] w-[min(340px,60vw)] rounded-full bg-[#F9D067]/35 blur-[68px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[52rem]">
        <h2
          id={sectionTitleId}
          className="font-serif text-center text-[clamp(1.75rem,4.2vw,2.75rem)] font-bold lowercase leading-[1.15] tracking-tight text-[#2D4F3E]"
        >
          build your daily ritual
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center font-condensed text-sm font-medium uppercase tracking-[0.16em] text-[#2D4F3E]/65">
          Small moments add up—no streaks, no guilt, just a drink worth returning to.
        </p>

        <ul className="mt-14 space-y-3 md:mt-16 md:space-y-4">
          {RITUAL_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id}>
                <div
                  className={`overflow-hidden rounded-[1.15rem] border border-[#2D4F3E] bg-white/90 shadow-[0_1px_0_rgba(45,79,62,0.06)] transition-shadow ${
                    isOpen ? 'shadow-[0_12px_40px_rgba(45,79,62,0.08)]' : 'hover:shadow-[0_8px_28px_rgba(45,79,62,0.06)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  >
                    <span className="font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-[#2D4F3E]">
                      {item.title}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2D4F3E]/15 text-[#2D4F3E] transition-colors hover:bg-[#F5F2ED]">
                      {isOpen ? <X className="h-4 w-4" strokeWidth={2} /> : <Plus className="h-4 w-4" strokeWidth={2} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key={`${item.id}-body`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-[#2D4F3E]/12"
                      >
                        <div className="relative px-5 pb-6 pt-5 md:px-6 md:pb-7 md:pt-6">
                          {item.glowRight ? (
                            <div
                              className="pointer-events-none absolute bottom-[12%] right-[4%] h-48 w-48 rounded-full bg-[#F47C3E]/20 blur-[56px] md:h-56 md:w-56"
                              aria-hidden
                            />
                          ) : null}

                          <div className="relative grid gap-8 md:grid-cols-2 md:gap-0">
                            <div className="md:border-r md:border-[#2D4F3E]/12 md:pr-8">
                              <p className="font-condensed text-[11px] font-bold uppercase tracking-[0.18em] text-[#2D4F3E]/80">
                                {item.leftTitle}
                              </p>
                              <ul className="mt-4 space-y-3 font-condensed text-sm font-medium leading-relaxed text-[#2D4F3E]/85 md:text-[15px]">
                                {item.leftLines.map((line) => (
                                  <li key={line} className="max-w-sm">
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="relative md:pl-8">
                              {item.glowRight ? (
                                <div
                                  className="pointer-events-none absolute -right-4 top-1/2 h-[120%] w-[90%] -translate-y-1/2 rounded-full bg-gradient-to-br from-[#F47C3E]/18 via-[#F9D067]/12 to-transparent blur-2xl md:blur-3xl"
                                  aria-hidden
                                />
                              ) : null}
                              <p className="relative font-condensed text-[11px] font-bold uppercase tracking-[0.18em] text-[#2D4F3E]/80">
                                {item.rightTitle}
                              </p>
                              <ul className="relative mt-4 space-y-3 font-condensed text-sm font-medium leading-relaxed text-[#2D4F3E]/85 md:text-[15px]">
                                {item.rightLines.map((line) => (
                                  <li key={line} className="max-w-sm">
                                    {line}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default DailyRitualSection;
