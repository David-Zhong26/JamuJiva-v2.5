import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type RitualColumn = {
  title: string;
  lines: string[];
};

export type RitualAccordionItemData = {
  id: string;
  label: string;
  left: RitualColumn;
  right: RitualColumn;
};

interface RitualAccordionItemProps {
  item: RitualAccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
  glowSide?: 'left' | 'right' | 'both';
}

const RitualAccordionItem: React.FC<RitualAccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  glowSide = 'right',
}) => {
  const panelId = useId();

  return (
    <motion.article
      layout
      className="relative overflow-hidden rounded-2xl border-2 border-[#2D4F3E] bg-[#F9D067]/25 shadow-[0_1px_0_rgba(45,79,62,0.08)]"
      transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      whileHover={{ borderColor: 'rgba(45,79,62,0.95)' }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-7 md:py-5"
      >
        <span className="font-bold text-xs uppercase tracking-widest text-[#2D4F3E]">
          {item.label}
        </span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#2D4F3E]/35 text-lg leading-none text-[#2D4F3E] transition-colors duration-200 hover:bg-[#F9D067]/50"
          aria-hidden
        >
          {isOpen ? '×' : '+'}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t-2 border-[#2D4F3E]"
          >
            <div className="relative grid gap-0 bg-[#F5E8CA]/85 md:grid-cols-2">
              {(glowSide === 'left' || glowSide === 'both') && (
                <div
                  className="pointer-events-none absolute left-[8%] top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#2D4F3E]/20 blur-[56px] md:h-64 md:w-64"
                  aria-hidden
                />
              )}
              {(glowSide === 'right' || glowSide === 'both') && (
                <div
                  className="pointer-events-none absolute right-[6%] top-[42%] h-56 w-56 -translate-y-1/2 rounded-full bg-[#E5C76B]/45 blur-[64px] md:h-72 md:w-72"
                  aria-hidden
                />
              )}

              <div className="relative border-[#2D4F3E]/20 px-6 py-7 md:border-r md:px-8 md:py-9">
                <h3 className="font-serif text-xl font-bold lowercase text-[#2D4F3E] md:text-2xl">
                  {item.left.title}
                </h3>
                <ul className="mt-5 space-y-3 text-sm font-medium uppercase leading-snug tracking-wide text-[#2D4F3E]/82 md:text-[0.95rem]">
                  {item.left.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="relative border-t-2 border-[#2D4F3E]/15 px-6 py-7 md:border-t-0 md:px-8 md:py-9">
                <h3 className="font-serif text-xl font-bold lowercase text-[#2D4F3E] md:text-2xl">
                  {item.right.title}
                </h3>
                <ul className="mt-5 space-y-3 text-sm font-medium uppercase leading-snug tracking-wide text-[#2D4F3E]/82 md:text-[0.95rem]">
                  {item.right.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
};

const RITUAL_ITEMS: RitualAccordionItemData[] = [
  {
    id: 'daily',
    label: 'Daily rituals',
    left: {
      title: 'during your ritual',
      lines: [
        'Create a slower morning moment',
        'Replace overly sweet drinks',
        'Build a more intentional routine',
      ],
    },
    right: {
      title: 'over time',
      lines: [
        'Feel more grounded throughout the day',
        'Crave less artificial sweetness',
        'Associate wellness with enjoyment instead of restriction',
      ],
    },
  },
  {
    id: 'notice',
    label: 'What you may notice',
    left: {
      title: 'during your ritual',
      lines: [
        'A brighter, steadier baseline energy',
        'Less mid-afternoon “crash” chasing',
        'A small cue that anchors your day',
      ],
    },
    right: {
      title: 'over time',
      lines: [
        'More consistent hydration habits',
        'A gentler relationship with stimulants',
        'A ritual you actually look forward to',
      ],
    },
  },
  {
    id: 'membership',
    label: 'Membership perks',
    left: {
      title: 'during your ritual',
      lines: [
        'First access to limited releases',
        'Reserved pricing on restocks',
        'Priority support from our team',
      ],
    },
    right: {
      title: 'over time',
      lines: [
        'Surprise drops and tasting notes',
        'Member-only bundles when we scale',
        'A community built around care—not hustle',
      ],
    },
  },
];

const DailyRitualSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(RITUAL_ITEMS[0]?.id ?? null);

  return (
    <section
      id="ritual"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5E8CA] via-[#F3DFA8]/90 to-[#F5E8CA] px-5 py-20 md:px-10 md:py-28"
    >
      <div
        className="pointer-events-none absolute left-[6%] top-[22%] h-[min(48vw,380px)] w-[min(48vw,380px)] rounded-full bg-[#2D4F3E]/18 blur-[88px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[8%] bottom-[10%] h-80 w-80 rounded-full bg-[#E5C76B]/35 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="font-bold text-xs uppercase tracking-widest text-[#2D4F3E]/70">
          Small moments add up
        </p>
        <h2 className="mt-4 font-serif text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-[#2D4F3E]">
          Build your daily ritual.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-xs font-bold uppercase leading-relaxed tracking-widest text-[#2D4F3E]/72 md:text-sm">
          No streaks, no guilt—just a drink worth returning to.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-14 flex max-w-3xl flex-col gap-3 md:mt-16 md:gap-3.5">
        {RITUAL_ITEMS.map((item, index) => (
          <RitualAccordionItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
            glowSide={index === 0 ? 'both' : index === 1 ? 'left' : 'right'}
          />
        ))}
      </div>
    </section>
  );
};

export default DailyRitualSection;
