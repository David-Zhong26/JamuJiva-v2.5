import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';
import backgroundImg from '../materials/background.png';
import background3Img from '../materials/background 3.png';
import background4Img from '../materials/background 4.png';
import demoJivaBottle from '../materials/jiva can.png';
import artworkImg from '../materials/Artwork.png';
import DailyRitualSection from './DailyRitualSection';
import { PRODUCT_DRINKS } from '../constants/productDrinks';
import { useMailingList } from '../contexts/MailingListContext';

const HERO_BG_INTERVAL_MS = 4000;

const HERO_BACKGROUNDS = [
  backgroundImg,
  background3Img,
  background4Img,
] as const;

const BENEFITS_MARQUEE =
  '100% Natural • Indonesian Herbal Blend • No Additives • No Added Sugar • Gluten Free • Real Ingredients Only';

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

  const goldenGlow = PRODUCT_DRINKS[0];
  const spicedIvory = PRODUCT_DRINKS[1];

  const renderFlavorLayer = (flavor: (typeof PRODUCT_DRINKS)[number]) => (
    <div
      className="absolute inset-0"
      style={{
        color: flavor.textColor,
        background: flavor.backgroundGradient,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_52%)]" />
      <div
        className={`relative z-10 flex h-full flex-col justify-end gap-5 overflow-visible px-5 pb-10 pt-24 sm:px-8 md:justify-center md:gap-8 md:px-14 md:py-12${
          flavor.slug === 'spiced-ivory' ? ' md:translate-x-2' : ''
        }`}
      >
        <img
          src={demoJivaBottle}
          alt={flavor.name}
          className="pointer-events-none absolute left-1/2 top-[38%] z-0 jj-vh-can h-[50vh] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain sm:jj-vh-can-sm sm:h-[58vh] md:top-1/2 md:h-[95vh]"
        />
        <div
          className={`pointer-events-none absolute top-[max(2.75rem,calc(env(safe-area-inset-top)+1.5rem))] z-20 flex items-center gap-1.5 whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-widest md:hidden ${
            flavor.slug === 'spiced-ivory' ? 'right-[1.375rem]' : 'right-5'
          }`}
          style={{ color: flavor.bodyColor }}
          aria-hidden
        >
          Scroll to explore
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-3.5 w-3.5 stroke-[3]" />
          </motion.div>
        </div>
        <div
          className={`relative z-10 grid w-full gap-6 md:grid-cols-2 md:items-center md:gap-8 md:pl-0${
            flavor.slug === 'spiced-ivory' ? ' pl-4' : flavor.slug === 'bali-gold' ? ' pl-4' : ''
          }`}
        >
          <div className="text-left">
            <h2
              className="font-serif text-4xl font-black leading-[0.9] sm:text-5xl md:text-7xl"
              style={{ color: flavor.textColor }}
            >
              {flavor.name.split(' ').map((word, index, words) => (
                <React.Fragment key={word}>
                  {word.toUpperCase()}
                  {index < words.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </h2>
            <p
              className="mt-5 text-sm font-black uppercase tracking-[0.2em] md:text-base"
              style={{ color: flavor.bodyColor }}
            >
              {flavor.eyebrow}
            </p>
          </div>

          <div className="max-w-sm text-left md:col-start-2 md:mr-8 md:justify-self-end lg:mr-12">
            <p
              className="text-sm leading-relaxed sm:text-base md:min-h-[6.75rem] md:text-lg lg:min-h-[7.25rem]"
              style={{ color: flavor.bodyColor }}
            >
              {'descriptionDesktop' in flavor && flavor.descriptionDesktop ? (
                <>
                  <span className="md:hidden">{flavor.description}</span>
                  <span className="hidden md:inline">{flavor.descriptionDesktop}</span>
                </>
              ) : (
                flavor.description
              )}
            </p>
            <Link
              to="/shop"
              style={{
                backgroundColor: flavor.buttonBg,
                color: flavor.buttonText,
                borderColor: flavor.buttonBorder,
              }}
              className="mt-5 inline-flex items-center justify-center rounded-full border px-6 py-3 text-xs font-black uppercase tracking-[0.14em] transition-all hover:brightness-105 sm:mt-8 sm:px-8 sm:py-4 sm:text-sm md:mt-6"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="benefits" className="relative jj-vh-section-220 bg-[#F5F2ED] md:bg-[#F5F2ED]">
      <div className="sticky top-0 jj-vh-screen overflow-hidden">
        <motion.div style={{ width: gingerWidth }} className="absolute inset-y-0 left-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-screen">{renderFlavorLayer(goldenGlow)}</div>
        </motion.div>

        <motion.div style={{ width: mintWidth }} className="absolute inset-y-0 right-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-screen">{renderFlavorLayer(spicedIvory)}</div>
        </motion.div>

        <motion.div
          style={{ left: dividerLeft, opacity: dividerOpacity }}
          className="absolute top-0 z-30 h-full w-[2px] -translate-x-1/2 bg-white/80 shadow-[0_0_0_1px_rgba(45,79,62,0.15),0_0_22px_rgba(255,255,255,0.35)]"
        />
      </div>
    </section>
  );
};

const WhyJivaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 1.25', 'start 0.25'],
  });

  const artworkX = useTransform(scrollYProgress, [0, 1], ['100vw', '0vw']);
  const artworkOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="overflow-hidden bg-[#F5E8CA] flex items-center px-5 py-10 sm:px-8 md:px-16 md:py-14 lg:px-24"
    >
      <div className="mx-auto grid max-w-6xl translate-x-3 items-center gap-8 sm:translate-x-4 md:translate-x-6 md:gap-12 lg:grid-cols-[1fr_minmax(0,1fr)] lg:translate-x-8 lg:gap-16">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-4 md:mb-6">
            Why <span className="text-[#F47C3E]">Jiva?</span>
          </h2>
          <div className="space-y-4 text-[#2D4F3E]/85 font-medium text-base leading-relaxed md:text-lg">
            <p>
              Jiva is Sanskrit for the living soul: the vital force that animates us, connects us
              to the earth, and carries the wisdom of those who came before.
            </p>
            <p>
              It is not a concept. It is what you are and how you live.
            </p>
            <p>
              For centuries, Indonesian healers understood this. They knew that to heal the body was
              to heal the soul. Turmeric ground at dawn, ginger steeped with intention, and herbs
              passed down through generations were never just medicine. They were a ritual of
              remembrance. A way of saying you are worth caring for.
            </p>
            <p>
              Jiva is that belief, bottled.
            </p>
          </div>
          <Link
            to="/culture"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#2D4F3E] px-6 py-3 font-black uppercase tracking-widest text-xs text-[#2D4F3E] transition-all hover:bg-[#2D4F3E] hover:text-[#F5E8CA] sm:mt-8 sm:px-8 sm:py-4 sm:text-sm"
          >
            Learn more
          </Link>
        </div>
        <div className="relative flex items-center justify-center translate-x-4 lg:translate-x-8 lg:justify-end">
          <motion.img
            src={artworkImg}
            alt="Jamu Jiva artwork"
            style={{ x: artworkX, opacity: artworkOpacity }}
            className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl object-contain will-change-transform"
          />
        </div>
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
        className="relative flex jj-vh-screen flex-col justify-end overflow-hidden px-5 pb-10 sm:px-8 md:px-12 md:pb-16 lg:pl-32 lg:pr-20"
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

        <div className="relative z-10 flex flex-col justify-end pointer-events-none">
          <div className="flex flex-col justify-end gap-8 pb-4">
            <div>
              <h1 className="font-serif text-[clamp(1.75rem,5vw,4rem)] font-bold leading-tight text-white/95 tracking-tight">
                DRINK THE <span className="text-[#E5C76B]">LIFE YOU DESERVE</span>
              </h1>
              <div className="hidden items-center gap-4 pt-4 text-xs font-medium uppercase tracking-widest text-[#E5C76B]/90 md:flex">
                <span className="h-px w-12 bg-[#E5C76B]/70" />
                Scroll to explore
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
                  <ChevronDown className="inline h-4 w-4" />
                </motion.div>
              </div>
            </div>
            <div className="pointer-events-auto">
              <button
                type="button"
                onClick={openMailingList}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-6 py-3 text-sm font-black text-white backdrop-blur-xl transition-all hover:bg-white/25 sm:gap-3 sm:px-8 sm:py-4"
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

      <WhyJivaSection />

      {/* ——— Flavors + CTA ——— */}
      <section
        id="waitlist"
        className="bg-[#F5E8CA] flex flex-col items-center justify-center px-5 py-10 sm:px-8 md:py-14"
      >
        <span className="text-[#F47C3E] font-black tracking-widest uppercase text-sm mb-3">
          The First Drop
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-black text-[#2D4F3E] text-center mb-6 md:mb-8">
          BE THE FIRST TO SIP.
        </h2>
        <button
          type="button"
          onClick={openMailingList}
          className="inline-flex items-center justify-center rounded-full bg-[#2D4F3E] px-10 py-4 font-black text-white hover:bg-[#F47C3E] transition-all"
        >
          SECURE ACCESS
        </button>
      </section>

    </>
  );
};

export default ScrollStory;
