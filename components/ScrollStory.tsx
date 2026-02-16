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

  // ——— Section boundaries: longer scroll (1400vh), wider ranges, less sensitivity ———
  // Hero: 0–0.07 | Benefits: 0.12–0.30 | Bottle slides left→bottom: 0.28–0.42 (no spin)
  // Ingredient Carousel: 0.38–0.62 | Tradition: 0.58–0.80 | Flavors: 0.80–1

  // ——— Bottle: no rotation; scroll-controlled slide from left to bottom (lower half visible) ———
  const bottleOpacity = useTransform(smoothProgress, [0, 0.05, 0.14, 0.42, 0.60, 0.75, 0.92, 1], [0, 1, 1, 1, 1, 0.7, 0.4, 0]);
  const bottleScale = useTransform(smoothProgress, [0, 0.08, 0.14, 0.28, 0.42, 0.60, 0.80, 1], [0.9, 1.1, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65]);
  const bottleX = useTransform(smoothProgress, [0, 0.08, 0.14, 0.28, 0.42, 0.62, 1], [0, 0, -220, -220, 0, 0, 0]);
  const bottleY = useTransform(smoothProgress, [0, 0.14, 0.28, 0.42, 0.62, 1], [0, 0, 0, 380, 380, 380]);
  const bottleZIndex = useTransform(smoothProgress, [0, 0.08, 0.14, 0.42, 0.62, 0.80, 1], [5, 30, 30, 20, 15, 10, 5]);

  // ——— Background ———
  const bgImageOpacity = useTransform(smoothProgress, [0, 0.14, 0.22], [1, 0.2, 0]);
  const bgColor = useTransform(
    smoothProgress,
    [0, 0.14, 0.30, 0.42, 0.62, 0.80, 0.88, 1],
    ['#2D4F3E', '#2D4F3E', '#2D4F3E', '#F5F2ED', '#2D4F3E', '#2D4F3E', '#F5F2ED', '#F5F2ED']
  );

  // ——— Section content opacities (wider ranges = slower transitions) ———
  const heroOpacity = useTransform(smoothProgress, [0, 0.04, 0.10, 0.16], [1, 1, 1, 0]);
  const benefitsOpacity = useTransform(smoothProgress, [0.10, 0.18, 0.26, 0.36], [0, 1, 1, 0]);
  const benefitsSlideX = useTransform(smoothProgress, [0.10, 0.22], [60, 0]);
  const ingredientCarouselOpacity = useTransform(smoothProgress, [0.34, 0.42, 0.58, 0.66], [0, 1, 1, 0]);
  const wheelRotate = useTransform(smoothProgress, [0.38, 0.62], [0, 360]);
  const cultureOpacity = useTransform(smoothProgress, [0.54, 0.64, 0.74, 0.84], [0, 1, 1, 0]);
  const cultureSlideX = useTransform(smoothProgress, [0.54, 0.68], [-60, 0]);
  const flavorsOpacity = useTransform(smoothProgress, [0.78, 0.86, 0.94, 1], [0, 1, 1, 1]);
  const flavorsScale = useTransform(smoothProgress, [0.78, 0.88], [0.96, 1]);

  // Ingredient carousel content box: smooth crossfade between titles over scroll
  const carouselTitle1Opacity = useTransform(smoothProgress, [0.38, 0.42, 0.48, 0.52], [0, 1, 1, 0]);
  const carouselTitle2Opacity = useTransform(smoothProgress, [0.48, 0.52, 0.58, 0.62], [0, 1, 1, 0]);
  const carouselTitle3Opacity = useTransform(smoothProgress, [0.58, 0.62, 0.68, 0.72], [0, 1, 1, 0]);

  return (
    <>
      {/* Scroll wrapper: 1400vh — larger sections, less sensitive, cinematic pacing */}
      <div ref={scrollRef} className="relative" style={{ height: '1400vh' }}>
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

          {/* ——— Bottle layer: no spin; scroll-controlled slide left → bottom (lower half visible) ——— */}
          <motion.div
            style={{
              x: bottleX,
              y: bottleY,
              scale: bottleScale,
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
            className="absolute inset-0 z-10 flex flex-col justify-between py-12 md:py-20 px-8 md:px-16 pointer-events-none"
          >
            <div />
            <div className="max-w-4xl space-y-8">
              <div className="bg-white/15 backdrop-blur-sm inline-block px-4 py-2 rounded-full text-white/95 font-medium text-xs tracking-wider">
                HERITAGE MEETS HUSTLE
              </div>
              <h1 className="font-serif text-[clamp(1.9rem,7vw,5.5rem)] font-bold leading-[1.25] text-white/95 tracking-tight">
                DRINK THE <br />
                <span className="text-[#E5C76B]">LIFE YOU</span> <br />
                DESERVE
              </h1>
              <div className="pt-4 flex items-center gap-4 text-[#E5C76B]/90 font-medium tracking-widest text-xs uppercase">
                <span className="w-12 h-px bg-[#E5C76B]/70" />
                Scroll to explore
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
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

          {/* ——— Ingredient Carousel: sticky wheel + content box (Our Ingredients / Our Edge / Crafted Daily) ——— */}
          <motion.div
            style={{ opacity: ingredientCarouselOpacity }}
            className="absolute inset-0 z-[8] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-12 md:gap-16 w-full max-w-2xl px-8">
              <div className="relative h-24 flex items-center justify-center">
                <motion.p style={{ opacity: carouselTitle1Opacity }} className="absolute font-serif text-2xl md:text-3xl font-semibold text-white/95 text-center">
                  Our Ingredients
                </motion.p>
                <motion.p style={{ opacity: carouselTitle2Opacity }} className="absolute font-serif text-2xl md:text-3xl font-semibold text-white/95 text-center">
                  Our Edge
                </motion.p>
                <motion.p style={{ opacity: carouselTitle3Opacity }} className="absolute font-serif text-2xl md:text-3xl font-semibold text-white/95 text-center">
                  Crafted Daily
                </motion.p>
              </div>
              <motion.div
                style={{ rotate: wheelRotate }}
                className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-white/30 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border-2 border-white/20 -m-4" />
                {['Turmeric', 'Ginger', 'Long Pepper'].map((label, i) => {
                  const angle = (i * 120) - 90;
                  return (
                    <div
                      key={label}
                      className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center font-serif font-bold text-white/90 text-xs uppercase"
                      style={{
                        transform: `rotate(${angle}deg) translateY(-5.5rem) rotate(${-angle}deg)`,
                      }}
                    >
                      {label.slice(0, 1)}
                    </div>
                  );
                })}
              </motion.div>
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
