import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, X } from 'lucide-react';
import backgroundImg from '../materials/background.jpg';
import background2Img from '../materials/background 2.png';
import demoJivaCan from '../materials/demo jiva can.png';
import modelMint from '../materials/model mint.png';
import modelGinger from '../materials/model ginger.png';
import ginger1 from '../materials/ginger 1.png';
import ginger2 from '../materials/ginger 2.png';
import mint1 from '../materials/mint 1.png';
import mint2 from '../materials/mint 2.png';
import DailyRitualSection from './DailyRitualSection';
import { supabase } from '../supabase';

const HERO_BG_INTERVAL_MS = 4000;

const BENEFITS_MARQUEE =
  '100% Natural • Indonesian Herbal Blend • No Additives • Gluten Free • Real Ingredients Only';

const PRODUCT_DRINKS = [
  {
    name: 'Bali Gold',
    eyebrow: 'Ginger-rooted daily glow',
    description: 'A bright, grounding Jamu blend with golden spice warmth and clean natural energy.',
    word: 'gold',
    background: 'from-[#EB9C35] via-[#F0B154] to-[#E7A243]',
    accent: '#8A4F12',
    textColor: '#FFF8EE',
    bodyColor: 'rgba(255, 248, 238, 0.92)',
    buttonBg: '#2D4F3E',
    buttonText: '#F5E8CA',
    buttonBorder: 'rgba(45, 79, 62, 0.24)',
    elements: [
      { src: modelGinger, className: 'left-[-2%] top-[8%] w-[13rem] md:w-[17rem] lg:w-[19rem] rotate-[-14deg]' },
      { src: ginger1, className: 'left-[8%] bottom-[14%] w-[9rem] md:w-[12rem] lg:w-[14rem] rotate-[8deg]' },
      { src: ginger2, className: 'right-[4%] top-[14%] w-[10rem] md:w-[13rem] lg:w-[15rem] rotate-[14deg]' },
    ],
  },
  {
    name: 'Mint Reset',
    eyebrow: 'Cooling herbal clarity',
    description: 'Fresh mint notes meet a light herbal finish for an easy, refreshing ritual.',
    word: 'mint',
    background: 'from-[#4E7145] via-[#648858] to-[#567A4A]',
    accent: '#EAF2D8',
    textColor: '#F5F2ED',
    bodyColor: 'rgba(245, 242, 237, 0.9)',
    buttonBg: '#F5F2ED',
    buttonText: '#2D4F3E',
    buttonBorder: 'rgba(245, 242, 237, 0.35)',
    elements: [
      { src: modelMint, className: 'left-[-1%] top-[10%] w-[12rem] md:w-[16rem] lg:w-[18rem] rotate-[-10deg]' },
      { src: mint1, className: 'left-[10%] bottom-[12%] w-[8rem] md:w-[10rem] lg:w-[12rem] rotate-[10deg]' },
      { src: mint2, className: 'right-[5%] top-[16%] w-[8rem] md:w-[11rem] lg:w-[13rem] rotate-[18deg]' },
    ],
  },
] as const;

interface ScrollStoryProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

interface ProductRevealSectionProps {
  onOpenMailingListModal: () => void;
}

const ProductRevealSection: React.FC<ProductRevealSectionProps> = ({ onOpenMailingListModal }) => {
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

  const [activeFromScroll, setActiveFromScroll] = useState<'ginger' | 'mint'>('ginger');
  const [purchaseType, setPurchaseType] = useState<'once' | 'subscribe'>('subscribe');
  const [thumbIndex, setThumbIndex] = useState<{ ginger: number; mint: number }>({ ginger: 0, mint: 0 });

  useMotionValueEvent(revealProgress, 'change', (v) => {
    setActiveFromScroll(v >= 50 ? 'mint' : 'ginger');
  });

  const ginger = PRODUCT_DRINKS[0];
  const mint = PRODUCT_DRINKS[1];

  const renderFlavorLayer = (
    flavor: (typeof PRODUCT_DRINKS)[number],
    isMint = false
  ) => {
    const panelKey = isMint ? 'mint' : 'ginger';
    const isActivePanel = activeFromScroll === panelKey;
    const thumbs = isMint
      ? [demoJivaCan, modelMint, mint1]
      : [demoJivaCan, modelGinger, ginger1];
    const mainIdx = thumbIndex[panelKey];
    const mainSrc = thumbs[mainIdx] ?? demoJivaCan;

    return (
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
        <div className="relative z-10 flex h-full min-h-0 items-stretch overflow-y-auto px-4 py-8 md:items-center md:overflow-hidden md:px-8 md:py-10 lg:px-14">
          <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2 md:items-center md:gap-10 lg:gap-14">
            <div className="flex flex-col gap-4 md:flex-row md:gap-5">
              <div className="order-2 flex flex-row justify-center gap-2 md:order-1 md:flex-col md:justify-start">
                {thumbs.map((src, i) => (
                  <button
                    key={`${panelKey}-t-${i}`}
                    type="button"
                    onClick={() =>
                      setThumbIndex((prev) => ({
                        ...prev,
                        [panelKey]: i,
                      }))
                    }
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white/15 p-1 transition-all md:h-16 md:w-16 ${
                      mainIdx === i ? 'border-white shadow-lg ring-2 ring-white/40' : 'border-white/25 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="relative order-1 flex flex-1 items-center justify-center md:order-2">
                <img
                  src={mainSrc}
                  alt={flavor.name}
                  className="relative z-10 h-auto max-h-[min(52vh,28rem)] w-full max-w-[16rem] object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:max-w-[18rem] md:max-h-[min(58vh,32rem)] md:max-w-[20rem] lg:max-w-[22rem]"
                />
                <div className="pointer-events-none absolute bottom-[8%] left-1/2 flex -translate-x-1/2 gap-1.5">
                  {thumbs.map((_, i) => (
                    <span
                      key={`${panelKey}-d-${i}`}
                      className={`h-1.5 w-1.5 rounded-full ${mainIdx === i ? 'bg-white' : 'bg-white/35'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-left">
              <p className="font-condensed text-[11px] font-bold uppercase tracking-[0.22em] text-[#F47C3E] md:text-xs">
                Herbal shot · Limited drop
              </p>
              <h2 className="mt-2 font-serif text-4xl font-black lowercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
                {flavor.name === 'Mint Reset' ? 'mint reset' : 'bali gold'}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[#F9D067]" aria-hidden>
                  ★★★★★
                </span>
                <span className="font-condensed text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: flavor.bodyColor }}>
                  Early tasters · Join the list
                </span>
              </div>

              <p className="mt-5 max-w-md text-sm leading-relaxed md:text-base" style={{ color: flavor.bodyColor }}>
                {flavor.description}
              </p>

              <p className="font-condensed mt-8 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: flavor.bodyColor }}>
                Select an option
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRODUCT_DRINKS.map((d) => {
                  const isGingerCard = d.name === 'Bali Gold';
                  const selected =
                    (isGingerCard && activeFromScroll === 'ginger') || (!isGingerCard && activeFromScroll === 'mint');
                  return (
                    <div
                      key={d.name}
                      className={`relative min-w-[5.5rem] flex-1 rounded-xl border-2 px-3 py-3 text-center transition-all md:min-w-[7rem] ${
                        selected ? 'border-[#2D4F3E] bg-white/20 shadow-md' : 'border-white/25 bg-white/10 hover:border-white/45'
                      }`}
                    >
                      {d.name === 'Bali Gold' ? (
                        <span className="font-condensed absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2D4F3E] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#F9D067]">
                          Flagship
                        </span>
                      ) : null}
                      <span className="font-condensed block text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: flavor.bodyColor }}>
                        {d.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setPurchaseType('once')}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all md:px-5 ${
                    purchaseType === 'once'
                      ? 'border-white/80 bg-white/15'
                      : 'border-white/20 bg-white/5 hover:border-white/35'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-4 w-4 shrink-0 rounded-full border-2 ${
                        purchaseType === 'once' ? 'border-white bg-white' : 'border-white/50'
                      }`}
                    />
                    <span className="font-condensed text-xs font-semibold uppercase tracking-[0.12em]">One-time</span>
                  </span>
                  <span className="font-condensed text-sm font-bold">$48</span>
                </button>

                <div
                  className={`rounded-2xl border-2 px-4 py-3.5 transition-all md:px-5 ${
                    purchaseType === 'subscribe'
                      ? 'border-[#F47C3E] bg-[#F47C3E]/15 shadow-[0_8px_28px_rgba(0,0,0,0.12)]'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPurchaseType('subscribe')}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 rounded-full border-2 ${
                          purchaseType === 'subscribe' ? 'border-[#F47C3E] bg-[#F47C3E]' : 'border-white/50'
                        }`}
                      />
                      <span>
                        <span className="font-condensed block text-xs font-semibold uppercase tracking-[0.12em]">Subscribe & save</span>
                        <span className="mt-2 block text-xs leading-relaxed opacity-90" style={{ color: flavor.bodyColor }}>
                          Free shipping on recurring orders · swap, skip, or cancel anytime
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right font-condensed">
                      <span className="text-xs line-through opacity-70">$48</span>
                      <span className="ml-2 text-sm font-bold text-[#F47C3E]">$40</span>
                    </span>
                  </button>
                  {purchaseType === 'subscribe' ? (
                    <label className="font-condensed mt-4 flex items-center justify-between gap-3 border-t border-white/20 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                      <span>Frequency</span>
                      <select className="rounded-lg border border-white/30 bg-white/90 px-2 py-1.5 text-[#2D4F3E] outline-none">
                        <option>Every 30 days</option>
                        <option>Every 45 days</option>
                        <option>Every 60 days</option>
                      </select>
                    </label>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenMailingListModal}
                style={{
                  backgroundColor: flavor.buttonBg,
                  color: flavor.buttonText,
                  borderColor: flavor.buttonBorder,
                }}
                className="font-condensed mt-6 w-full rounded-full border py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:brightness-105 md:mt-8"
              >
                Add to cart
              </button>

              {!isActivePanel ? (
                <p className="font-condensed mt-3 text-center text-[10px] uppercase tracking-[0.14em] opacity-80" style={{ color: flavor.bodyColor }}>
                  Scroll to compare the other flavor
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative bg-[#F5F2ED]"
      style={{ height: '220vh' }}
    >
      <div
        className="w-full shrink-0 overflow-hidden border-y-2 border-[#2D4F3E] bg-[#F9D067] py-3.5 md:py-4 shadow-[0_6px_28px_rgba(0,0,0,0.22)]"
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

      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ width: gingerWidth }}
          className="absolute inset-y-0 left-0 overflow-hidden"
        >
          <div className="absolute inset-y-0 left-0 w-screen">
            {renderFlavorLayer(ginger)}
          </div>
        </motion.div>

        <motion.div
          style={{ width: mintWidth }}
          className="absolute inset-y-0 right-0 overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 w-screen">
            {renderFlavorLayer(mint, true)}
          </div>
        </motion.div>

        <motion.div
          style={{ left: dividerLeft, opacity: dividerOpacity }}
          className="absolute top-0 z-30 h-full w-[2px] -translate-x-1/2 bg-white/80 shadow-[0_0_0_1px_rgba(45,79,62,0.15),0_0_22px_rgba(255,255,255,0.35)]"
        />
      </div>
    </section>
  );
};

const ScrollStory: React.FC<ScrollStoryProps> = ({ email, setEmail, onJoin, joined }) => {
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [isMailingListOpen, setIsMailingListOpen] = useState(false);
  const [mailingListEmail, setMailingListEmail] = useState('');
  const [mailingListInterests, setMailingListInterests] = useState<string[]>([]);
  const [mailingListSubmitted, setMailingListSubmitted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setHeroBgIndex((i) => (i + 1) % 2), HERO_BG_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  const openMailingListModal = () => {
    setIsMailingListOpen(true);
    setMailingListSubmitted(false);
    setMailingListEmail('');
    setMailingListInterests([]);
  };

  const closeMailingListModal = () => {
    setIsMailingListOpen(false);
  };

  const handleMailingListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const cleanedEmail = mailingListEmail.trim().toLowerCase();
  
    if (!cleanedEmail) {
      alert('Please enter your email.');
      return;
    }
  
    if (mailingListInterests.length === 0) {
      alert('Please select at least one product.');
      return;
    }
  
    const flavorMap: Record<string, string> = {
      'Bali Gold': 'bali_gold',
      'Mint Reset': 'mint_reset',
    };
  
    const mappedFlavors = mailingListInterests.map(
      (name) => flavorMap[name] || name.toLowerCase().replace(/\s+/g, '_')
    );
  
    const { error } = await supabase
      .from('subscribers')
      .insert([
        {
          email: cleanedEmail,
          flavors: mappedFlavors,
        },
      ]);
  
    if (error) {
      if (error.message.toLowerCase().includes('duplicate')) {
        alert('This email is already on the list.');
      } else {
        alert(error.message);
      }
      return;
    }
  
    setMailingListSubmitted(true);
  };

  const toggleMailingListInterest = (productName: string) => {
    setMailingListInterests((current) =>
      current.includes(productName)
        ? current.filter((name) => name !== productName)
        : [...current, productName]
    );
  };

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 md:pb-20 pl-24 pr-12 md:pl-32 md:pr-20 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 bg-[#2D4F3E]" />
        <div className="absolute inset-0 z-0">
          <motion.img
            src={backgroundImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: heroBgIndex === 0 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.img
            src={background2Img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: heroBgIndex === 1 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
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
                onClick={openMailingListModal}
                className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 px-8 py-4 font-black text-white hover:bg-white/25 transition-all"
              >
                JOIN THE DROP <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <ProductRevealSection onOpenMailingListModal={openMailingListModal} />

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
          onClick={openMailingListModal}
          className="inline-flex items-center justify-center rounded-full bg-[#2D4F3E] px-10 py-4 font-black text-white hover:bg-[#F47C3E] transition-all"
        >
          SECURE ACCESS
        </button>
      </section>

      <section id="faq" className="scroll-mt-24 pt-12 pb-24 px-6 bg-[#F5E8CA]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-black text-[#2D4F3E] mb-10 text-center">
            Quick answers
          </h2>
          <FAQAccordion />
        </div>
      </section>

      <AnimatePresence>
        {isMailingListOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2D4F3E]/45 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-[2rem] bg-[#F5F2ED] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
            >
              <button
                type="button"
                aria-label="Close mailing list modal"
                onClick={closeMailingListModal}
                className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2D4F3E]/10 bg-white text-[#2D4F3E] transition-colors hover:bg-[#F9D067]"
              >
                <X className="h-4 w-4" />
              </button>

              {!mailingListSubmitted ? (
                <>
                  <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#F47C3E]">
                    Join The Mailing List
                  </span>
                  <h3 className="font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                    Be the first to hear about the next drop.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#2D4F3E]/75">
                    Enter your email and we&apos;ll keep you posted on launches, restocks, and special releases.
                  </p>

                  <form onSubmit={handleMailingListSubmit} className="mt-8 space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={mailingListEmail}
                      onChange={(e) => setMailingListEmail(e.target.value)}
                      required
                      className="w-full rounded-full border border-[#2D4F3E]/15 bg-white px-6 py-4 text-[#2D4F3E] outline-none transition-colors placeholder:text-[#2D4F3E]/40 focus:border-[#2D4F3E]"
                    />
                    <div className="rounded-[1.5rem] border border-[#2D4F3E]/10 bg-white/70 p-5">
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2D4F3E]">
                        Which products are you interested in?
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#2D4F3E]/65">
                        Select what you&apos;d like to hear about so we can send exclusive deals when we manufacture it.
                      </p>
                      <div className="mt-4 space-y-3">
                        {PRODUCT_DRINKS.map((drink) => {
                          const isChecked = mailingListInterests.includes(drink.name);
                          return (
                            <label
                              key={drink.name}
                              className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                                isChecked
                                  ? 'border-[#2D4F3E] bg-[#F9D067]/35'
                                  : 'border-[#2D4F3E]/10 bg-white hover:border-[#2D4F3E]/25'
                              }`}
                            >
                              <div>
                                <span className="block font-black text-[#2D4F3E]">{drink.name}</span>
                                <span className="block text-sm text-[#2D4F3E]/65">{drink.eyebrow}</span>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleMailingListInterest(drink.name)}
                                className="h-5 w-5 rounded border-[#2D4F3E]/30 text-[#2D4F3E] focus:ring-[#2D4F3E]"
                              />
                            </label>
                          );
                        })}
                      </div>
                      {mailingListInterests.length === 0 ? (
                        <p className="mt-3 text-xs font-medium text-[#F47C3E]">
                          Select at least one product.
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-full bg-[#2D4F3E] px-6 py-4 font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#F47C3E]"
                    >
                      Confirm Signup
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#F47C3E]">
                    You&apos;re In
                  </span>
                  <h3 className="font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                    Congratulations, you&apos;re on the list.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#2D4F3E]/75">
                    We&apos;ll let you know when the next product drop is ready.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#2D4F3E]/70">
                    Interested in: <span className="font-black text-[#2D4F3E]">{mailingListInterests.join(', ')}</span>
                  </p>
                  <button
                    type="button"
                    onClick={closeMailingListModal}
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F47C3E] px-8 py-4 font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#2D4F3E]"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
              <ChevronDown className="w-5 h-5 flex-shrink-0" />
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
