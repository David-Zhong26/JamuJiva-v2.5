import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react';
import backgroundImg from '../materials/background.jpg';
import background2Img from '../materials/background 2.png';
import background3Img from '../materials/background 3.png';
import background4Img from '../materials/background 4.png';
import demoJivaBottle from '../materials/demo jiva can.png';
import DailyRitualSection from './DailyRitualSection';
import { PRODUCT_DRINKS } from '../constants/productDrinks';
import { useMailingList } from '../contexts/MailingListContext';

const HERO_BG_INTERVAL_MS = 4000;

const HERO_BACKGROUNDS = [
  backgroundImg,
  background2Img,
  background3Img,
  background4Img,
] as const;

const BENEFITS_MARQUEE =
  '100% Natural • Indonesian Herbal Blend • No Additives • Gluten Free • Real Ingredients Only';

const ProductRevealSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const revealProgress = useTransform(scrollYProgress, [0.12, 0.82], [0, 100]);
  const gingerWidth = useTransform(revealProgress, (v) => `${100 - v}%`);
  const mintWidth = useTransform(revealProgress, (v) => `${v}%`);
  const dividerLeft = useTransform(revealProgress, (v) => `${100 - v}%`);
  const dividerOpacity = useTransform(scrollYProgress, [0.08, 0.12, 0.9, 1], [0, 1, 1, 0]);

  const ginger = PRODUCT_DRINKS[0];
  const mint = PRODUCT_DRINKS[1];

  const renderFlavorLayer = (flavor: (typeof PRODUCT_DRINKS)[number], isMint = false) => (
    <div
      className="absolute inset-0"
      style={{
        color: flavor.textColor,
        background: isMint
          ? 'linear-gradient(135deg, #4E7145 0%, #648858 45%, #567A4A 100%)'
          : 'linear-gradient(135deg, #EB9C35 0%, #F0B154 45%, #E7A243 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_52%)]" />
      <div className="relative z-10 flex h-full items-center px-8 py-12 md:px-14">
        <div className="grid w-full items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          <div className="text-left">
            <h2 className="font-serif text-5xl font-black leading-[0.9] text-white md:text-7xl">
              {flavor.name === 'Mint Reset' ? 'MINT' : 'GINGER'}
            </h2>
            <p
              className="mt-5 text-sm font-black uppercase tracking-[0.2em] md:text-base"
              style={{ color: flavor.bodyColor }}
            >
              {flavor.eyebrow}
            </p>
          </div>

          <div className="relative mx-auto flex items-center justify-center">
            <img
              src={demoJivaBottle}
              alt={flavor.name}
              className="relative z-10 h-auto w-[22rem] max-w-none object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.22)] md:w-[28rem] lg:w-[32rem]"
            />
          </div>

          <div className="max-w-sm justify-self-end text-left">
            <p className="text-base leading-relaxed md:text-lg" style={{ color: flavor.bodyColor }}>
              {flavor.description}
            </p>
            <Link
              to="/shop"
              style={{
                backgroundColor: flavor.buttonBg,
                color: flavor.buttonText,
                borderColor: flavor.buttonBorder,
              }}
              className="mt-8 inline-flex items-center justify-center rounded-full border px-8 py-4 font-black uppercase tracking-[0.14em] transition-all hover:brightness-105"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="benefits" className="relative bg-[#F5F2ED]" style={{ height: '220vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ width: gingerWidth }} className="absolute inset-y-0 left-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-screen">{renderFlavorLayer(ginger)}</div>
        </motion.div>

        <motion.div style={{ width: mintWidth }} className="absolute inset-y-0 right-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-screen">{renderFlavorLayer(mint, true)}</div>
        </motion.div>

        <motion.div
          style={{ left: dividerLeft, opacity: dividerOpacity }}
          className="absolute top-0 z-30 h-full w-[2px] -translate-x-1/2 bg-white/80 shadow-[0_0_0_1px_rgba(45,79,62,0.15),0_0_22px_rgba(255,255,255,0.35)]"
        />
      </div>
    </section>
  );
};

const ScrollStory: React.FC = () => {
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const { openMailingList } = useMailingList();

  useEffect(() => {
    const t = setInterval(
      () => setHeroBgIndex((i) => (i + 1) % HERO_BACKGROUNDS.length),
      HERO_BG_INTERVAL_MS
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 md:pb-20 pl-24 pr-12 md:pl-32 md:pr-20 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 bg-[#2D4F3E]" />
        <div className="absolute inset-0 z-0">
          {HERO_BACKGROUNDS.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={false}
              animate={{ opacity: heroBgIndex === index ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D4F3E]/90 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 flex flex-col min-h-[calc(100vh-6rem)] justify-between pointer-events-none">
          <div className="bg-white/15 backdrop-blur-sm inline-block w-fit px-4 py-2 rounded-full text-white/95 font-medium text-xs tracking-wider">
            HERITAGE MEETS HUSTLE
          </div>
          <div className="flex-1 flex flex-col justify-end gap-8 pb-4">
            <div>
              <h1 className="font-serif text-[clamp(1.75rem,5vw,4rem)] font-bold leading-tight text-white/95 tracking-tight">
                DRINK THE <span className="text-[#E5C76B]">LIFE YOU</span> DESERVE
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
              <button
                type="button"
                onClick={openMailingList}
                className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 px-8 py-4 font-black text-white hover:bg-white/25 transition-all"
              >
                JOIN THE DROP <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div
        className="w-full shrink-0 overflow-hidden border-y border-[#2D4F3E] bg-[#F9D067] py-3.5 md:py-4 shadow-[0_6px_28px_rgba(0,0,0,0.12)]"
        aria-hidden
      >
        <div className="jj-benefits-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="inline-flex shrink-0 items-center whitespace-nowrap pl-10 pr-6 md:pl-16 md:pr-10 font-black text-[#1e3d30] text-xs sm:text-sm md:text-base uppercase tracking-[0.12em] md:tracking-[0.18em]"
            >
              {BENEFITS_MARQUEE}
              <span className="mx-8 md:mx-12 inline-block text-[#F47C3E]">•</span>
              {BENEFITS_MARQUEE}
              <span className="mx-8 md:mx-12 inline-block text-[#F47C3E]">•</span>
              {BENEFITS_MARQUEE}
              <span className="mx-8 md:mx-12 inline-block text-[#F47C3E]">•</span>
              {BENEFITS_MARQUEE}
              <span className="mx-8 md:mx-12 inline-block text-[#F47C3E]">•</span>
            </span>
          ))}
        </div>
      </div>

      <ProductRevealSection />

      <DailyRitualSection />

      {/* ——— Culture ——— */}
      <section
        id="story"
        className="min-h-screen bg-[#F5E8CA] flex items-center pl-8 md:pl-24 lg:pl-52 pr-8 md:pr-48 py-20"
      >
        <div className="max-w-lg">
          <span className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block">
            The Origin Story
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-6">
            ROOTED IN <span className="text-[#F47C3E]">TRADITION.</span>
          </h2>
          <p className="text-[#2D4F3E]/85 font-medium text-lg leading-relaxed">
            In the misty mornings of Solo, the Mbok Jamu begins her ritual. Jamu Jiva was born to bring this act of care to NYC and LA—a lifestyle of intentional vitality.
          </p>
        </div>
      </section>

      {/* ——— Flavors + CTA ——— */}
      <section
        id="waitlist"
        className="min-h-screen bg-[#F5E8CA] flex flex-col items-center justify-center px-8 py-20"
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
        <button
          type="button"
          onClick={openMailingList}
          className="inline-flex items-center justify-center rounded-full bg-[#2D4F3E] px-10 py-4 font-black text-white hover:bg-[#F47C3E] transition-all"
        >
          SECURE ACCESS
        </button>
      </section>

      <section id="faq" className="pt-12 pb-24 px-6 bg-[#F5E8CA]">
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
