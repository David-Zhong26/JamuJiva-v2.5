import React, { useState } from 'react';
import { motion } from 'framer-motion';
import demoJivaBottle from '../materials/demo jiva.png';
import { PRODUCT_DRINKS, type ProductDrink } from '../constants/productDrinks';

interface FlavorShopSectionProps {
  onOpenMailingListModal: () => void;
}

type PurchaseMode = 'once' | 'subscribe';

const FlavorShopSection: React.FC<FlavorShopSectionProps> = ({ onOpenMailingListModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<PurchaseMode>('subscribe');
  const [frequency, setFrequency] = useState('Every 30 days');

  const drink: ProductDrink = PRODUCT_DRINKS[activeIndex] ?? PRODUCT_DRINKS[0];

  return (
    <section id="benefits" className="relative border-y border-[#1a1a1a]/90 bg-[#F5F2ED] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="relative">
            <div
              className="pointer-events-none absolute left-1/2 top-[42%] h-[min(72vw,420px)] w-[min(72vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 blur-[72px]"
              style={{
                background:
                  drink.slug === 'mint-reset'
                    ? 'radial-gradient(circle, rgba(78,113,69,0.35) 0%, rgba(244,124,62,0.12) 55%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(235,156,53,0.45) 0%, rgba(244,124,62,0.14) 55%, transparent 72%)',
              }}
              aria-hidden
            />

            <div className="relative flex min-h-[320px] items-center justify-center md:min-h-[420px]">
              <motion.img
                key={drink.slug}
                src={demoJivaBottle}
                alt={drink.name}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 h-auto w-[min(78vw,22rem)] max-w-none object-contain drop-shadow-[0_28px_70px_rgba(0,0,0,0.18)] md:w-[min(42vw,28rem)]"
              />
            </div>
          </div>

          <div className="relative z-10">
            <p className="font-condensed text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#1a1a1a]/55">
              Select a flavor
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold lowercase tracking-tight text-[#1a1a1a] md:text-5xl">
              {drink.shortLabel.toLowerCase()}
            </h2>
            <p className="mt-3 max-w-md font-condensed text-sm font-medium uppercase leading-relaxed tracking-[0.12em] text-[#1a1a1a]/65">
              {drink.eyebrow}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {PRODUCT_DRINKS.map((item, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative flex min-w-[7.5rem] flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 md:min-w-[8.5rem] ${
                      selected
                        ? 'border-[#1a1a1a] shadow-[0_0_0_2px_#1a1a1a]'
                        : 'border-[#1a1a1a]/35 hover:border-[#1a1a1a]/65'
                    }`}
                  >
                    {item.badge ? (
                      <span className="absolute left-2 top-2 z-10 bg-[#1a1a1a] px-2 py-0.5 font-condensed text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white">
                        {item.badge}
                      </span>
                    ) : null}
                    <div className={`relative aspect-[4/3] w-full ${item.cardTint}`}>
                      <img
                        src={item.thumb}
                        alt=""
                        className="absolute inset-0 m-auto h-[88%] w-auto object-contain drop-shadow-md"
                      />
                    </div>
                    <div className="border-t border-[#1a1a1a]/20 bg-[#FDFCF8] px-3 py-2">
                      <span className="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]">
                        {item.shortLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-base leading-relaxed text-[#1a1a1a]/78 md:text-[1.05rem]">
              {drink.description}
            </p>

            <div className="mt-10 space-y-3">
              <button
                type="button"
                onClick={() => setMode('once')}
                className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-colors md:px-5 ${
                  mode === 'once'
                    ? 'border-[#1a1a1a] bg-white'
                    : 'border-[#1a1a1a]/35 bg-white/70 hover:border-[#1a1a1a]/55'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      mode === 'once' ? 'border-[#1a1a1a]' : 'border-[#1a1a1a]/35'
                    }`}
                  >
                    {mode === 'once' ? <span className="h-2 w-2 rounded-full bg-[#1a1a1a]" /> : null}
                  </span>
                  <span className="font-condensed text-sm font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]">
                    One-time purchase
                  </span>
                </span>
                <span className="font-condensed text-sm font-semibold text-[#1a1a1a]">
                  ${drink.priceOneTime}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('subscribe')}
                className={`flex w-full flex-col gap-4 rounded-xl border px-4 py-4 text-left transition-colors md:px-5 ${
                  mode === 'subscribe'
                    ? 'border-[#1a1a1a] border-2 bg-[#fdecef]/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'
                    : 'border-[#1a1a1a]/35 bg-white/70 hover:border-[#1a1a1a]/55'
                }`}
              >
                <div className="flex w-full items-start justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        mode === 'subscribe' ? 'border-[#1a1a1a]' : 'border-[#1a1a1a]/35'
                      }`}
                    >
                      {mode === 'subscribe' ? <span className="h-2 w-2 rounded-full bg-[#1a1a1a]" /> : null}
                    </span>
                    <span className="font-condensed text-sm font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]">
                      Subscribe &amp; save
                    </span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-2 font-condensed text-sm font-semibold">
                    <span className="text-[#1a1a1a]/40 line-through">${drink.priceOneTime}</span>
                    <span className="text-[#1a1a1a]">${drink.priceSubscribe}</span>
                  </span>
                </div>
                <ul className="space-y-1.5 pl-7 font-condensed text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#1a1a1a]/72 md:text-xs">
                  <li>{drink.perUnit}</li>
                  <li>Free shipping on recurring orders</li>
                  <li>Cancel or pause anytime</li>
                </ul>
                <label className="block pl-7">
                  <span className="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]/55">
                    Frequency
                  </span>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 w-full cursor-pointer rounded-lg border border-[#1a1a1a]/35 bg-white px-3 py-2.5 font-condensed text-xs font-medium uppercase tracking-[0.1em] text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a]"
                  >
                    <option>Every 30 days</option>
                    <option>Every 45 days</option>
                    <option>Every 60 days</option>
                  </select>
                </label>
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenMailingListModal}
              className="mt-6 w-full rounded-full bg-[#F47C3E] py-4 font-condensed text-sm font-semibold uppercase tracking-[0.2em] text-white transition-transform duration-200 hover:brightness-[1.03] active:scale-[0.99]"
            >
              Add to cart
            </button>
            <p className="mt-3 text-center text-xs text-[#1a1a1a]/45">
              You&apos;ll confirm interest on the list—no charge until we ship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlavorShopSection;
