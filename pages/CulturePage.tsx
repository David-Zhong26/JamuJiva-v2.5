import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import aboutGingerBg from '../materials/about-ginger-bg.png';

const ABOUT_STICKERS = [
  {
    title: 'Our Mission',
    cardBg: '#F2BBB5',
    textColor: '#6F2E1E',
    buttonBg: 'transparent',
    buttonText: '#8C3F1F',
    showFooter: true,
    ctaLabel: 'Shop all',
    ctaTo: '/shop',
    paragraphs: [
      'Jiva is built for those who refuse to settle for burnout, brain rot, and running on empty.',
      "We are sharing the culture of jamu with a new generation seeking natural energy, balance, and better living. This is bigger than a beverage. It's a movement to connect your soul to the life you deserve to live.",
      "Rooted in Indonesian heritage, Jiva reimagines ancient herbal traditions for today's fast-paced world. We believe feeling good shouldn't be complicated. It should be daily, intentional, and deeply personal.",
    ],
  },
  {
    title: 'How are we different?',
    cardBg: '#F6F1E8',
    textColor: '#6F2E1E',
    buttonBg: 'transparent',
    buttonText: '#8C3F1F',
    showFooter: false,
    paragraphs: [
      'In a market flooded with supplements that promise everything and explain nothing, Jiva stands apart by doing something radical: telling the truth about where it comes from.',
      'A healing tradition passed down long before wellness became an industry, every can carries centuries of Indonesian wisdom rooted in jamu.',
      "But Jiva was never just about the drink. It's about what the drink represents: a slower morning, an intentional pause, the quiet confidence of someone who decided they deserve to feel good every single day.",
      "Jiva is not just a product, but a lifestyle. One built on balance, ancient knowledge, and the belief that vitality isn't a destination. It's how you live.",
    ],
  },
  {
    title: 'The Culture Behind Jiva',
    cardBg: '#B84E2F',
    textColor: '#F8E8DA',
    buttonBg: 'transparent',
    buttonText: '#F8E8DA',
    showFooter: false,
    paragraphs: [
      "Jiva is inspired by jamu, Indonesia's centuries-old herbal wellness tradition rooted in natural ingredients and everyday ritual. For generations, jamu has been a symbol of balance, nourishment, and intentional living.",
      'We created Jiva to honor that heritage while making it more approachable for modern life. Every recipe is thoughtfully crafted with a smoother, more refreshing taste that respects tradition without trying to replace it.',
      "Jiva is rooted in Indonesian culture, reimagined for today. It's our way of introducing more people to the spirit of jamu, through simplicity, care, and everyday wellness.",
    ],
  },
] as const;

type Sticker = (typeof ABOUT_STICKERS)[number];

const INITIAL_STACK = ABOUT_STICKERS.map((_, i) => i);
const BACK_ROTATES = [0, 8, -8] as const;
/** Peak side offset while arcing, then seat at front/back of the deck */
const ARC_SIDE_X = 300;
const ARC_DURATION = 0.82;

const StickerFace: React.FC<{ sticker: Sticker; interactive?: boolean }> = ({
  sticker,
  interactive = false,
}) => (
  <article
    style={{ backgroundColor: sticker.cardBg, color: sticker.textColor }}
    className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] px-7 py-7 shadow-[0_32px_90px_rgba(44,15,4,0.26)] sm:px-9 sm:py-8 md:px-10 md:py-8"
    aria-hidden={!interactive}
  >
    <div
      className={`flex min-h-0 flex-1 flex-col max-w-[33rem] pr-1 ${
        sticker.showFooter ? 'pb-20 md:pb-16' : 'pb-2'
      }`}
    >
      <h1 className="shrink-0 font-serif text-2xl leading-[1.05] sm:text-3xl md:text-[2.75rem]">
        {sticker.title}
      </h1>
      <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain text-sm leading-relaxed sm:mt-6 sm:space-y-3.5 sm:text-[0.95rem] sm:leading-[1.45] md:mt-6 md:space-y-3.5 md:text-[1rem] md:leading-[1.42] [scrollbar-width:thin]">
        {sticker.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>

    {sticker.showFooter ? (
      <Link
        to={sticker.ctaTo ?? '/shop'}
        tabIndex={interactive ? 0 : -1}
        style={{
          borderColor: sticker.buttonText,
          color: sticker.buttonText,
          backgroundColor: sticker.buttonBg,
        }}
        className="absolute bottom-8 left-7 inline-flex items-center justify-center rounded-full border-2 px-7 py-3 text-base font-black uppercase tracking-[0.08em] transition-colors hover:bg-black/10 sm:left-9 sm:px-9 md:bottom-8 md:left-10"
      >
        {sticker.ctaLabel ?? 'Shop all'}
      </Link>
    ) : null}
  </article>
);

function stackPose(depth: number, n: number) {
  return {
    x: 0,
    y: depth * 12,
    scale: 1 - depth * 0.035,
    rotate: BACK_ROTATES[Math.min(depth, BACK_ROTATES.length - 1)],
    opacity: 1,
    zIndex: n - depth,
  };
}

const CulturePage: React.FC = () => {
  /** Front of stack = first index */
  const [stack, setStack] = useState<number[]>(INITIAL_STACK);
  /** Ghost card currently peeling off the top toward the back of the deck */
  const [outgoing, setOutgoing] = useState<{
    id: number;
    dir: 1 | -1;
    mode: 'out' | 'in';
  } | null>(null);
  /** Bottom card temporarily hidden while it lands under the deck after flying */
  const [settlingId, setSettlingId] = useState<number | null>(null);
  const flyLock = useRef(false);

  const isAnimating = Boolean(outgoing);

  const navigateSticker = (dir: 1 | -1) => {
    if (isAnimating || flyLock.current) return;
    flyLock.current = true;

    if (dir > 0) {
      // Top peels right, arcs under the deck
      const top = stack[0];
      setOutgoing({ id: top, dir: 1, mode: 'out' });
      setSettlingId(top);
      setStack((prev) => [...prev.slice(1), prev[0]]);
    } else {
      // Bottom peels left, arcs up to become the new top
      const bottom = stack[stack.length - 1];
      setOutgoing({ id: bottom, dir: -1, mode: 'in' });
      setSettlingId(bottom);
      setStack((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    }
  };

  const onFlyComplete = () => {
    if (!flyLock.current) return;
    flyLock.current = false;
    setOutgoing(null);
    requestAnimationFrame(() => setSettlingId(null));
  };

  const n = stack.length;
  // Back → front paint order
  const renderOrder = [...stack].reverse();

  const outgoingSticker = outgoing ? ABOUT_STICKERS[outgoing.id] : null;

  return (
    <main className="relative w-full overflow-x-hidden bg-[#8C3F1F] md:min-h-[100dvh]">
      <div className="absolute inset-0">
        <img
          src={aboutGingerBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#7A2E14]/76" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_54%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-5 sm:px-8 md:min-h-[100dvh] md:px-10">
        <div className="relative flex flex-1 items-start justify-center pb-28 pt-24 md:min-h-[100dvh] md:items-center md:pb-0 md:pt-14 md:-translate-y-4 lg:-translate-y-6">
          <button
            type="button"
            onClick={() => navigateSticker(-1)}
            aria-label="Previous section"
            disabled={isAnimating}
            className="absolute left-0 top-1/2 z-30 hidden -translate-y-1/2 text-white transition-opacity hover:opacity-75 disabled:opacity-40 md:inline-flex"
          >
            <ChevronLeft className="h-20 w-20 stroke-[1.25]" />
          </button>

          <div className="relative w-full max-w-[50rem] px-2 sm:px-8 md:px-16">
            <div className="relative h-[min(72dvh,42rem)] min-h-[36rem] sm:h-[38rem] sm:min-h-0 md:h-[34rem]">
              {renderOrder.map((stickerIndex) => {
                const depth = stack.indexOf(stickerIndex);
                const isTop = depth === 0;
                const isHidden =
                  // hide stack copy while its ghost is flying in/out
                  settlingId === stickerIndex;

                const pose = stackPose(depth, n);

                return (
                  <motion.div
                    key={ABOUT_STICKERS[stickerIndex].title}
                    className="absolute inset-0 will-change-transform"
                    style={{ transformOrigin: '50% 80%', pointerEvents: isTop && !isAnimating ? 'auto' : 'none' }}
                    initial={false}
                    animate={{
                      ...pose,
                      opacity: isHidden ? 0 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 340,
                      damping: 30,
                      mass: 0.85,
                      opacity: { duration: 0.15 },
                    }}
                  >
                    <StickerFace
                      sticker={ABOUT_STICKERS[stickerIndex]}
                      interactive={isTop && !isAnimating}
                    />
                  </motion.div>
                );
              })}

              {/* Flying ghost: out = top arcs under deck; in = bottom arcs to top */}
              <AnimatePresence>
                {outgoing && outgoingSticker ? (
                  <motion.div
                    key={`fly-${outgoing.mode}-${outgoingSticker.title}`}
                    className="absolute inset-0 will-change-transform"
                    style={{ transformOrigin: '50% 70%', pointerEvents: 'none' }}
                    initial={
                      outgoing.mode === 'out'
                        ? {
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            opacity: 1,
                            zIndex: 50,
                          }
                        : (() => {
                            const back = stackPose(n - 1, n);
                            return {
                              x: 0,
                              y: back.y + 6,
                              rotate: back.rotate,
                              scale: back.scale * 0.98,
                              opacity: 1,
                              zIndex: 1,
                            };
                          })()
                    }
                    animate={
                      outgoing.mode === 'out'
                        ? (() => {
                            const back = stackPose(n - 1, n);
                            return {
                              x: [0, outgoing.dir * ARC_SIDE_X, 0],
                              y: [0, -64, back.y + 6],
                              rotate: [0, outgoing.dir * 22, back.rotate],
                              scale: [1, 1.04, back.scale * 0.98],
                              opacity: 1,
                              zIndex: [50, 45, 1],
                            };
                          })()
                        : (() => {
                            const back = stackPose(n - 1, n);
                            return {
                              // Bottom → side → becomes new top
                              x: [0, outgoing.dir * ARC_SIDE_X, 0],
                              y: [back.y + 6, -64, 0],
                              rotate: [back.rotate, outgoing.dir * 22, 0],
                              scale: [back.scale * 0.98, 1.04, 1],
                              opacity: 1,
                              zIndex: [1, 45, 50],
                            };
                          })()
                    }
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: ARC_DURATION,
                      times: [0, 0.42, 1],
                      ease: [
                        [0.33, 0.0, 0.2, 1],
                        [0.22, 1, 0.36, 1],
                      ],
                    }}
                    onAnimationComplete={onFlyComplete}
                  >
                    <StickerFace sticker={outgoingSticker} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateSticker(1)}
            aria-label="Next section"
            disabled={isAnimating}
            className="absolute right-0 top-1/2 z-30 hidden -translate-y-1/2 text-white transition-opacity hover:opacity-75 disabled:opacity-40 md:inline-flex"
          >
            <ChevronRight className="h-20 w-20 stroke-[1.25]" />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => navigateSticker(-1)}
            aria-label="Previous section"
            disabled={isAnimating}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 text-white disabled:opacity-40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => navigateSticker(1)}
            aria-label="Next section"
            disabled={isAnimating}
            className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 text-white disabled:opacity-40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default CulturePage;
