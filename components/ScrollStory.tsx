import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, ChevronDown as ChevronDownIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import backgroundImg from '../materials/background.jpg';
import background2Img from '../materials/background 2.png';
import demoJivaBottle from '../materials/demo jiva.png';
import modelMint from '../materials/model mint.png';
import modelGinger from '../materials/model ginger.png';
import ginger1 from '../materials/ginger 1.png';
import ginger2 from '../materials/ginger 2.png';
import mint1 from '../materials/mint 1.png';
import mint2 from '../materials/mint 2.png';
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
    elements: [
      { src: modelMint, className: 'left-[-1%] top-[10%] w-[12rem] md:w-[16rem] lg:w-[18rem] rotate-[-10deg]' },
      { src: mint1, className: 'left-[10%] bottom-[12%] w-[8rem] md:w-[10rem] lg:w-[12rem] rotate-[10deg]' },
      { src: mint2, className: 'right-[5%] top-[16%] w-[8rem] md:w-[11rem] lg:w-[13rem] rotate-[18deg]' },
    ],
  },
] as const;

const organicEase: [number, number, number, number] = [0.4, 0, 0.2, 1];

const floatingElementVariants = {
  initial: ({ direction }: { direction: 1 | -1; index: number }) => ({
    y: direction === 1 ? 140 : -140,
    opacity: 0,
    filter: 'blur(12px)',
    scale: 0.9,
    rotate: direction === 1 ? 8 : -8,
  }),
  animate: ({ index }: { direction: 1 | -1; index: number }) => ({
    y: [0, -8, 0],
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.85,
      ease: organicEase,
      delay: index * 0.08,
    },
  }),
  exit: ({ direction }: { direction: 1 | -1; index: number }) => ({
    y: direction === 1 ? 160 : -160,
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.92,
    rotate: direction === 1 ? 8 : -8,
    transition: {
      duration: 0.7,
      ease: organicEase,
    },
  }),
};

interface ScrollStoryProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const IngredientsSection: React.FC = () => (
  <section
    id="ingredients"
    className="min-h-screen bg-[#F5E8CA] flex items-center justify-center px-8 py-20"
  >
    <div className="max-w-5xl w-full grid gap-8 md:grid-cols-3">
      {[
        {
          title: 'GINGER',
          text: 'Cold-pressed from Central Java. Bright spice, clean energy, and no jittery crash.',
        },
        {
          title: 'TURMERIC',
          text: 'Pure curcumin and natural anti-inflammatories for a grounding daily ritual.',
        },
        {
          title: 'TAMARIND',
          text: 'A warm, balancing finish that rounds out the blend with depth and character.',
        },
      ].map((item) => (
        <div key={item.title} className="rounded-[2rem] border border-[#2D4F3E]/10 bg-white px-8 py-10 text-center shadow-sm">
          <span className="text-[#A76D2A] font-black tracking-widest uppercase text-sm block mb-4">
            Natural Ingredient
          </span>
          <h3 className="font-serif text-3xl md:text-4xl font-black text-[#2D4F3E] mb-4">
            {item.title}
          </h3>
          <p className="text-[#2D4F3E]/75 font-medium leading-relaxed">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const ScrollStory: React.FC<ScrollStoryProps> = ({ email, setEmail, onJoin, joined }) => {
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [selectedDrinkIndex, setSelectedDrinkIndex] = useState(0);
  const [drinkDirection, setDrinkDirection] = useState<1 | -1>(1);
  const [isMailingListOpen, setIsMailingListOpen] = useState(false);
  const [mailingListEmail, setMailingListEmail] = useState('');
  const [mailingListInterests, setMailingListInterests] = useState<string[]>([]);
  const [mailingListSubmitted, setMailingListSubmitted] = useState(false);
  const selectedDrink = PRODUCT_DRINKS[selectedDrinkIndex];

  useEffect(() => {
    const t = setInterval(() => setHeroBgIndex((i) => (i + 1) % 2), HERO_BG_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  const showPreviousDrink = () => {
    setDrinkDirection(-1);
    setSelectedDrinkIndex((i) => (i - 1 + PRODUCT_DRINKS.length) % PRODUCT_DRINKS.length);
  };

  const showNextDrink = () => {
    setDrinkDirection(1);
    setSelectedDrinkIndex((i) => (i + 1) % PRODUCT_DRINKS.length);
  };

  const showDrinkAtIndex = (index: number) => {
    if (index === selectedDrinkIndex) return;
    setDrinkDirection(index > selectedDrinkIndex ? 1 : -1);
    setSelectedDrinkIndex(index);
  };

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

      {/* ——— Benefits ——— */}
      <section
        id="benefits"
        className="min-h-screen bg-[#F5F2ED] flex flex-col"
      >
        {/* Scrolling announcement bar — warm gold on brand green section for contrast */}
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

        <div className="relative flex flex-1 items-center justify-center px-6 py-10 md:px-10 md:py-14">
          <div className={`absolute inset-0 bg-gradient-to-br ${selectedDrink.background}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_56%)]" />

          <button
            type="button"
            aria-label="Previous product drink"
            onClick={showPreviousDrink}
            className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-[#2D4F3E]/15 bg-white/85 text-[#2D4F3E] shadow-lg backdrop-blur hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Next product drink"
            onClick={showNextDrink}
            className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full border border-[#2D4F3E]/15 bg-white/85 text-[#2D4F3E] shadow-lg backdrop-blur hover:bg-white transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="relative z-10 flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center justify-center overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 px-6 py-12 shadow-[0_20px_80px_rgba(45,79,62,0.12)] backdrop-blur-sm md:px-12">
            <AnimatePresence mode="wait" custom={drinkDirection}>
              <motion.div
                key={selectedDrink.name}
                className="absolute inset-0"
                custom={drinkDirection}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
              >
                {selectedDrink.elements.map((element, index) => (
                  <motion.img
                    key={`${selectedDrink.name}-${element.src}`}
                    src={element.src}
                    alt=""
                    custom={{ direction: drinkDirection, index }}
                    variants={floatingElementVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`pointer-events-none absolute ${element.className}`}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={drinkDirection}>
              <motion.div
                key={`${selectedDrink.name}-word`}
                custom={drinkDirection}
                initial={{ opacity: 0, y: drinkDirection === 1 ? 80 : -80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: drinkDirection === 1 ? 80 : -80 }}
                transition={{ duration: 0.75, ease: organicEase }}
                className="pointer-events-none absolute inset-x-0 bottom-[14%] z-0 text-center font-serif text-[24vw] font-black uppercase tracking-[-0.08em] text-[#A76D2A]/20 md:text-[18vw]"
              >
                {selectedDrink.word}
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 grid w-full items-center gap-8 md:grid-cols-[0.9fr_auto_1fr]">
              <div className="hidden md:block" />

              <AnimatePresence mode="wait" custom={drinkDirection}>
                <motion.div
                  key={`${selectedDrink.name}-product`}
                  custom={drinkDirection}
                initial={{ opacity: 0, scale: 0.92, rotate: drinkDirection === 1 ? 4 : -4, y: drinkDirection === 1 ? 28 : -28 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.07, 1],
                    rotate: [0, drinkDirection === 1 ? 4 : -4, 0],
                    y: [18, -8, 0],
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    rotate: drinkDirection === 1 ? 5 : -5,
                    y: drinkDirection === 1 ? 36 : -36,
                  }}
                  transition={{ duration: 0.9, ease: organicEase }}
                  className="mx-auto flex flex-col items-center"
                >
                  <img
                    src={demoJivaBottle}
                    alt={selectedDrink.name}
                    className="relative z-10 h-auto w-[32rem] max-w-none md:w-[46rem] lg:w-[58rem] object-contain drop-shadow-[0_28px_60px_rgba(45,79,62,0.2)]"
                  />
                  <button
                    type="button"
                    onClick={openMailingListModal}
                    className="mt-6 inline-flex items-center rounded-full border border-[#2D4F3E]/20 bg-white/90 px-6 py-3 text-sm font-black text-[#2D4F3E] shadow-md transition-colors hover:bg-white"
                  >
                    Shop now
                  </button>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait" custom={drinkDirection}>
                <motion.div
                  key={`${selectedDrink.name}-text`}
                  custom={drinkDirection}
                initial={{ opacity: 0, y: drinkDirection === 1 ? 40 : -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: drinkDirection === 1 ? 40 : -40 }}
                  transition={{ duration: 0.75, ease: organicEase }}
                  className="text-center md:text-left"
                >
                  <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#2D4F3E]/70">
                    Product Selection
                  </span>
                  <h2 className="font-serif text-4xl font-black leading-none md:text-6xl" style={{ color: selectedDrink.accent }}>
                    {selectedDrink.name}
                  </h2>
                  <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-[#2D4F3E]/70">
                    {selectedDrink.eyebrow}
                  </p>
                  <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#2D4F3E]/80 md:mx-0 md:text-lg">
                    {selectedDrink.description}
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
                    {PRODUCT_DRINKS.map((drink, index) => (
                      <button
                        key={drink.name}
                        type="button"
                        aria-label={`Show ${drink.name}`}
                        onClick={() => showDrinkAtIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === selectedDrinkIndex ? 'w-10 bg-[#2D4F3E]' : 'w-2.5 bg-[#2D4F3E]/25 hover:bg-[#2D4F3E]/45'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <IngredientsSection />

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

      <section className="pt-12 pb-24 px-6 bg-[#F5E8CA]">
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
