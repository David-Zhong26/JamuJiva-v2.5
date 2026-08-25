import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flower2, Heart, Leaf, Sparkles } from 'lucide-react';
import background3Img from '../materials/background 3.png';
import background4Img from '../materials/background 4.png';
import heroMobileImg from '../materials/hero-mobile.png';
import artworkImg from '../materials/Artwork.png';
import whiteLogo from '../materials/white jiva logo.png';
import DailyRitualSection from './DailyRitualSection';

const HERO_BG_INTERVAL_MS = 4000;

const HERO_BACKGROUNDS_DESKTOP = [background3Img, background4Img] as const;
/** Mobile cover: same carousel rhythm, but swap bg4 for the vertical motion still. */
const HERO_BACKGROUNDS_MOBILE = [background3Img, heroMobileImg] as const;

const BENEFITS_MARQUEE_ITEMS = [
  '100% Natural',
  'Indonesian Herbal Blend',
  'No Additives',
  'No Added Sugar',
  'Gluten Free',
  'Real Ingredients Only',
] as const;

const HomePromoCards: React.FC = () => {
  return (
    <section className="bg-[#E3D6C8]">
      <div className="grid gap-px md:grid-cols-2">
        <article className="flex flex-col bg-[#F2BBB5] px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12">
          <div className="flex min-h-[19rem] w-full max-w-md flex-1 flex-col pb-2 pt-8 lg:min-h-[21rem] lg:pb-4 lg:pt-10">
            <h2 className="font-serif text-4xl leading-[0.9] text-[#6F2E1E] sm:text-5xl">
              Ancient wisdom.
              <br />
              Modern you.
            </h2>
            <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-black md:text-base">
              Jamu has been Indonesia&apos;s wellness secret for centuries. We blend traditional
              ingredients with modern science to support your body, mind, and everyday balance.
            </p>
            <Link
              to="/culture"
              className="mt-auto mb-2 inline-flex items-center gap-3 pt-6 text-sm font-black uppercase tracking-[0.14em] text-[#6F2E1E] md:mb-3"
            >
              About us
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </Link>
          </div>
        </article>

        <article className="flex flex-col bg-[#F6F1E8] px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12">
          <div className="flex min-h-[19rem] w-full max-w-md flex-1 flex-col pb-2 pt-8 lg:min-h-[21rem] lg:pb-4 lg:pt-10">
            <h2 className="font-serif text-4xl leading-[0.9] text-[#6F2E1E] sm:text-5xl">
              Rooted in nature,
              <br />
              powered by function.
            </h2>
            <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-black md:text-base">
              Thoughtfully sourced ingredients that work in harmony with your body.
            </p>
            <Link
              to="/shop"
              className="mt-auto mb-2 inline-flex items-center gap-3 pt-6 text-sm font-black uppercase tracking-[0.14em] text-[#6F2E1E] md:mb-3"
            >
              Shop all
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </Link>
          </div>
        </article>
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
      className="overflow-hidden bg-[#F6F1E8] flex items-center px-5 py-10 sm:px-8 md:px-16 md:py-14 lg:px-24"
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
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-[#2D4F3E] px-6 py-3 font-black uppercase tracking-widest text-xs text-[#2D4F3E] transition-all hover:bg-[#2D4F3E] hover:text-[#F6F1E8] sm:mt-8 sm:px-8 sm:py-4 sm:text-sm"
          >
            Learn more
          </Link>
        </div>
        <div className="relative flex items-center justify-center translate-x-4 lg:translate-x-8 lg:justify-end">
          <motion.img
            src={artworkImg}
            alt="Jiva artwork"
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

  const brandFeatures = [
    { icon: Flower2, label: 'Functional ingredients' },
    { icon: Heart, label: 'Daily ritual' },
    { icon: Sparkles, label: 'No compromise on taste' },
    { icon: Leaf, label: 'Made for modern living' },
  ] as const;

  useEffect(() => {
    const t = setInterval(
      () => setHeroBgIndex((i) => (i + 1) % HERO_BACKGROUNDS_DESKTOP.length),
      HERO_BG_INTERVAL_MS
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        id="hero"
        className="relative bg-[#F6F1E8]"
      >
        <div className="sticky top-0 jj-h-screen overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            {/* Mobile: motion-blur still instead of background 4 */}
            {HERO_BACKGROUNDS_MOBILE.map((src, index) => (
              <motion.img
                key={`mobile-${index}`}
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
                initial={false}
                animate={{ opacity: heroBgIndex === index ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              />
            ))}
            {/* Desktop: keep background 3 / 4 carousel */}
            {HERO_BACKGROUNDS_DESKTOP.map((src, index) => (
              <motion.img
                key={`desktop-${index}`}
                src={src}
                alt=""
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
                initial={false}
                animate={{ opacity: heroBgIndex === index ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,16,24,0.32),rgba(0,0,0,0.1)_18%,rgba(0,0,0,0.18)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_55%)]" />
          </div>
        </div>

        <div className="relative z-10 jj-neg-screen-mt">
          <div className="flex jj-min-screen w-full items-center justify-center px-6 pb-12 pt-28 text-center pointer-events-none sm:px-8 md:px-12 md:pb-16 md:pt-36">
            <div className="flex max-w-[44rem] flex-col items-center">
              <h1 className="font-serif text-[clamp(2.1rem,4.8vw,3.75rem)] font-normal leading-[0.96] tracking-tight text-white">
                Drink the Life
                <br />
                You Deserve
              </h1>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/90 md:mt-6 md:text-sm">
                WITH
              </p>
              <img
                src={whiteLogo}
                alt="Jiva"
                className="mt-2 w-[min(44vw,16rem)] max-w-[16rem] md:mt-3 md:w-[min(36vw,18rem)] md:max-w-[18rem]"
                decoding="async"
              />
              <div className="pointer-events-auto mt-24 md:mt-28 lg:mt-32">
                <Link
                  to="/shop"
                  className="inline-flex items-center rounded-full border border-white/75 bg-white/5 px-9 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white backdrop-blur-[2px] transition-all hover:bg-white/12 sm:px-12 sm:text-base"
                >
                  SHOP ALL
                </Link>
              </div>
            </div>
          </div>

          <div className="-mt-64 pointer-events-none flex min-h-[76vh] items-center justify-center px-6 pb-14 pt-28 text-center sm:px-8 md:-mt-72 md:min-h-[80vh] md:px-10 md:pb-16">
            <div className="max-w-4xl translate-y-3 md:translate-y-4">
              <p className="mx-auto max-w-4xl text-base font-medium leading-relaxed text-white md:text-[1.35rem] md:leading-[1.35]">
                Jiva is a modern wellness ritual that reconnects you to your soul, one sip at a time.
              </p>
              <p className="mt-2 text-base font-black text-white md:text-[1.35rem]">
                Rooted in ancient remedies. Crafted for today.
              </p>

              <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 md:mt-12 md:grid-cols-4">
                {brandFeatures.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-3 text-white">
                    <Icon className="h-7 w-7 stroke-[1.7] md:h-8 md:w-8" />
                    <span className="max-w-[9rem] text-[0.62rem] font-black uppercase leading-tight tracking-[0.14em] md:text-[0.68rem]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomePromoCards />

      <div
        className="w-full shrink-0 overflow-hidden border-y border-[#2D4F3E] bg-[#F9D067] py-3.5 md:py-4 shadow-[0_6px_28px_rgba(0,0,0,0.12)]"
        aria-hidden
      >
        <div className="jj-benefits-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="inline-flex shrink-0 items-center gap-5 whitespace-nowrap pl-10 pr-6 font-lato text-xs font-bold uppercase tracking-[0.14em] text-[#6F2E1E] sm:gap-6 sm:text-sm md:pl-16 md:pr-10 md:gap-8 md:text-base md:tracking-[0.18em]"
            >
              {BENEFITS_MARQUEE_ITEMS.map((item) => (
                <React.Fragment key={`${copy}-${item}`}>
                  <span>{item}</span>
                  {/* Trailing dot so copies join seamlessly (last → first of next loop) */}
                  <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-[#6F2E1E]" aria-hidden />
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      <DailyRitualSection />

    </>
  );
};

export default ScrollStory;
