import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react';
import demoJiva from '../materials/demo jiva.jpg';
import demoJivaBottle from '../materials/demo jiva removed.png';

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface ScrollStoryProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const ScrollStory: React.FC<ScrollStoryProps> = ({ email, setEmail, onJoin, joined }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useTransform(scrollYProgress, (v) => easeInOutCubic(v));

  // ——— Section boundaries (slower scroll, more hold time) ———
  // Hero: 0–0.10 hold | Hero→Benefits: 0.10–0.18 bottle shrinks + moves left
  // Benefits: 0.18–0.38 hold (bottle floats left, dark green bg) | 0.38–0.48 transition
  // Ingredients: 0.48–0.70 hold | 0.70–0.78 transition | Culture: 0.78–0.90 | Flavors: 0.90–1.00

  // ——— Bottle transforms (main storyline element) ———
  // Hero: appears in center, covers background bottle. Then shrinks + moves left into Benefits.
  // Benefits: floats on left (hold). Dark green bg holds for reading.
  const bottleOpacity = useTransform(smoothProgress, [0, 0.05, 0.18, 0.48, 0.70, 0.90, 0.98, 1], [0, 1, 1, 1, 1, 1, 0.6, 0]);
  const bottleScale = useTransform(smoothProgress, [0, 0.10, 0.18, 0.48, 0.70, 0.90, 0.98, 1], [0.9, 1.15, 0.9, 1.05, 1.05, 0.95, 0.85, 0.75]);
  const bottleX = useTransform(smoothProgress, [0, 0.10, 0.18, 0.38, 0.48, 0.70, 0.78, 0.90, 1], [0, 0, -220, -220, 0, 0, 220, 220, 0]);
  const bottleY = useTransform(smoothProgress, [0, 0.18, 0.48, 0.70, 0.78, 0.90, 1], [0, 0, 0, 0, 40, 40, 20]);
  const bottleRotate = useTransform(smoothProgress, [0.46, 0.52], [0, 360]);
  const bottleZIndex = useTransform(smoothProgress, [0, 0.08, 0.18, 0.48, 0.70, 0.90, 1], [5, 30, 30, 25, 25, 15, 5]);

  // ——— Background ———
  const bgImageOpacity = useTransform(smoothProgress, [0, 0.18, 0.24], [1, 0.2, 0]);
  const bgColor = useTransform(
    smoothProgress,
    [0, 0.18, 0.38, 0.48, 0.70, 0.78, 0.90, 1],
    ['#2D4F3E', '#2D4F3E', '#2D4F3E', '#F5F2ED', '#2D4F3E', '#F5F2ED', '#F5F2ED', '#F5F2ED']
  );

  // ——— Section content opacities ———
  const heroOpacity = useTransform(smoothProgress, [0, 0.05, 0.12, 0.20], [1, 1, 1, 0]);
  const benefitsOpacity = useTransform(smoothProgress, [0.14, 0.22, 0.34, 0.48], [0, 1, 1, 0]);
  const benefitsSlideX = useTransform(smoothProgress, [0.14, 0.24], [80, 0]);
  const ingredientsContainerOpacity = useTransform(smoothProgress, [0.44, 0.52, 0.64, 0.70], [0, 1, 1, 0]);
  const ingredientsPopScale1 = useTransform(smoothProgress, [0.52, 0.56], [0, 1]);
  const ingredientsPopScale2 = useTransform(smoothProgress, [0.54, 0.58], [0, 1]);
  const ingredientsPopScale3 = useTransform(smoothProgress, [0.56, 0.60], [0, 1]);
  const ingredientsCardsOpacity = useTransform(smoothProgress, [0.52, 0.56, 0.62, 0.66], [0, 1, 1, 0]);
  const cultureOpacity = useTransform(smoothProgress, [0.72, 0.80, 0.86, 0.96], [0, 1, 1, 0]);
  const cultureSlideX = useTransform(smoothProgress, [0.72, 0.82], [-80, 0]);
  const flavorsOpacity = useTransform(smoothProgress, [0.90, 0.96, 1], [0, 1, 1]);
  const flavorsScale = useTransform(smoothProgress, [0.90, 0.96], [0.95, 1]);

  return (
    <>
      {/* Scroll wrapper: 900vh for longer sections and slower transitions */}
      <div ref={scrollRef} className="relative" style={{ height: '900vh' }}>
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background */}
          <motion.div
            style={{ backgroundColor: bgColor }}
            className="absolute inset-0 z-0"
          />
          <motion.div
            style={{ opacity: bgImageOpacity }}
            className="absolute inset-0 z-0"
          >
            <img
              src={demoJiva}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D4F3E]/90 via-transparent to-black/20" />
          </motion.div>

          {/* ——— Bottle layer (storyline anchor) ——— */}
          <motion.div
            style={{
              x: bottleX,
              y: bottleY,
              scale: bottleScale,
              rotate: bottleRotate,
              opacity: bottleOpacity,
              zIndex: bottleZIndex,
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src={demoJivaBottle}
              alt="Jamu Jiva"
              className="w-[95%] min-w-[600px] max-w-[1100px] h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* ——— Hero content (0.00–0.25) ——— */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16 pointer-events-none"
          >
            <div />
            <div className="max-w-4xl">
              <div className="bg-white/20 backdrop-blur-sm inline-block px-4 py-2 rounded-full text-white font-bold text-xs tracking-wider mb-6">
                HERITAGE MEETS HUSTLE
              </div>
              <h1 className="font-serif text-[clamp(2.5rem,10vw,8rem)] font-black leading-[0.9] text-white tracking-tight">
                DRINK THE <br />
                <span className="text-[#F9D067]">LIFE YOU</span> <br />
                DESERVE
              </h1>
              <div className="mt-10 flex items-center gap-4 text-[#F9D067] font-bold tracking-widest text-xs uppercase">
                <span className="w-12 h-px bg-[#F9D067]" />
                Scroll to explore
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                  <ChevronDown className="w-4 h-4 inline" />
                </motion.div>
              </div>
            </div>
            <div className="pointer-events-auto">
              {!joined ? (
                <form onSubmit={onJoin} className="flex p-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 max-w-md">
                  <input
                    type="email"
                    placeholder="Join the drop..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent px-6 py-3 focus:outline-none placeholder-white/70 font-semibold text-white"
                  />
                  <button
                    type="submit"
                    className="bg-white text-[#F47C3E] px-8 py-3 rounded-full font-black hover:bg-[#F9D067] hover:text-[#2D4F3E] transition-all flex items-center gap-2"
                  >
                    ACCESS <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="bg-[#2D4F3E] border border-white/30 px-8 py-4 rounded-full font-black text-white">
                  YOU'RE ON THE LIST
                </div>
              )}
            </div>
          </motion.div>

          {/* ——— Benefits (0.25–0.45) ——— */}
          <motion.div
            style={{ opacity: benefitsOpacity, x: benefitsSlideX }}
            className="absolute inset-0 z-[8] flex items-center justify-end pr-8 md:pr-20 pl-20 pointer-events-none"
          >
            <div className="max-w-lg text-right">
              <span className="text-[#F9D067] font-black tracking-widest uppercase text-sm mb-4 block">
                The Modern Elixir
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                Centuries of <span className="italic text-[#F9D067]">Wisdom</span> In Every Sip.
              </h2>
              <div className="space-y-4 text-white/90 font-medium text-lg">
                <p>Raw roots from Central Java. Cold-pressed ginger and turmeric.</p>
                <p>Metabolism-igniting, sustained focus. No jitters.</p>
                <p>Curcumin and natural anti-inflammatories for the modern nomad.</p>
              </div>
            </div>
          </motion.div>

          {/* ——— Ingredients: bottle spins, 3 pics pop out from center (radiating outward), then disappear ——— */}
          <motion.div
            style={{ opacity: ingredientsContainerOpacity }}
            className="absolute inset-0 z-[8] flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-full max-w-4xl h-[70%] flex items-center justify-center">
              {[
                { title: 'Turmeric', desc: 'Pure Central Javanese', color: '#F9D067', angle: -120, scaleVal: ingredientsPopScale1 },
                { title: 'Ginger', desc: 'Cold-press ritual', color: '#F47C3E', angle: 0, scaleVal: ingredientsPopScale2 },
                { title: 'Long Pepper', desc: 'Bio-available blend', color: '#2D4F3E', angle: 120, scaleVal: ingredientsPopScale3 },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  style={{
                    scale: item.scaleVal,
                    opacity: ingredientsCardsOpacity,
                    position: 'absolute',
                    rotate: item.angle,
                    y: -110,
                  }}
                  className="origin-center flex flex-col items-center"
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-white/50 shadow-2xl backdrop-blur-sm w-24 h-24 md:w-28 md:h-28"
                    style={{ backgroundColor: `${item.color}dd`, transform: `rotate(${-item.angle}deg)` }}
                  >
                    <span className="font-serif text-2xl md:text-3xl font-black text-white">{item.title.slice(0, 1)}</span>
                    <span className="font-bold text-white/90 text-xs mt-0.5 uppercase tracking-wider">{item.title}</span>
                  </div>
                  <p className="text-white/90 text-sm font-medium mt-2 max-w-[100px] text-center" style={{ transform: `rotate(${-item.angle}deg)` }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ——— Culture / Story (0.65–0.80) ——— */}
          <motion.div
            style={{ opacity: cultureOpacity, x: cultureSlideX }}
            className="absolute inset-0 z-[8] flex items-center pl-8 md:pl-20 pr-20 pointer-events-none"
          >
            <div className="max-w-lg">
              <span className="text-[#F9D067] font-black tracking-widest uppercase text-sm mb-4 block">
                The Origin Story
              </span>
              <h2 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                ROOTED IN <span className="text-[#F47C3E]">TRADITION.</span>
              </h2>
              <p className="text-white/90 font-medium text-lg leading-relaxed">
                In the misty mornings of Solo, the Mbok Jamu begins her ritual. Jamu Jiva was born to bring this act of care to NYC and LA—a lifestyle of intentional vitality.
              </p>
            </div>
          </motion.div>

          {/* ——— Flavors + CTA (0.80–1.00) ——— */}
          <motion.div
            style={{ opacity: flavorsOpacity, scale: flavorsScale }}
            className="absolute inset-0 z-[8] flex flex-col items-center justify-center px-8 pointer-events-auto"
          >
            <span className="text-[#F47C3E] font-black tracking-widest uppercase text-sm mb-4">
              The First Drop
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] text-center mb-8">
              BE THE FIRST TO SIP.
            </h2>
            <p className="text-[#2D4F3E]/80 text-lg md:text-xl text-center max-w-2xl mb-10">
              Limited release of our seasonal "Bali Gold" brew. Only 5,000 cases.
            </p>
            {!joined ? (
              <form onSubmit={onJoin} className="flex flex-col sm:flex-row gap-4 max-w-xl w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-8 py-4 rounded-full border-2 border-[#2D4F3E]/20 bg-white focus:outline-none focus:border-[#2D4F3E] font-medium text-[#2D4F3E]"
                />
                <button
                  type="submit"
                  className="bg-[#2D4F3E] text-white px-10 py-4 rounded-full font-black hover:bg-[#F47C3E] transition-all"
                >
                  SECURE ACCESS
                </button>
              </form>
            ) : (
              <div className="bg-[#2D4F3E] text-white px-10 py-6 rounded-3xl font-black text-xl shadow-xl">
                YOU'RE IN. Check your inbox.
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <section className="py-24 px-6 bg-[#F5F2ED]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-black text-[#2D4F3E] mb-10 text-center">
            Quick answers
          </h2>
          <FAQAccordion />
        </div>
      </section>
    </>
  );
};

const faqItems = [
  {
    q: 'What is Jamu?',
    a: 'Jamu is a traditional Indonesian herbal medicine, often served as a tonic. Our version is cold-pressed and bio-optimized for modern lifestyles.',
  },
  {
    q: 'When will Jamu Jiva launch?',
    a: 'Our first drop—"Bali Gold"—launches soon. Join the list to be notified and secure early access.',
  },
  {
    q: 'Where is it available?',
    a: 'We ship to the continental US. NYC and LA will get the first batches.',
  },
];

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqItems.map((item, i) => (
        <motion.div
          key={item.q}
          initial={false}
          className="border border-[#2D4F3E]/10 rounded-2xl overflow-hidden bg-white"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-[#2D4F3E] hover:bg-[#2D4F3E]/5 transition-colors"
          >
            {item.q}
            {openIndex === i ? (
              <ChevronUp className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 flex-shrink-0" />
            )}
          </button>
          <motion.div
            initial={false}
            animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-[#2D4F3E]/70 font-medium leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default ScrollStory;
