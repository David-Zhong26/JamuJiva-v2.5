import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCT_DRINKS, type ProductDrink } from '../constants/productDrinks';

interface FlavorShopSectionProps {
  onOpenMailingListModal: () => void;
}

type PurchaseMode = 'once' | 'subscribe';

const FlavorShopSection: React.FC<FlavorShopSectionProps> = ({ onOpenMailingListModal }) => {
  const [searchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<PurchaseMode>('subscribe');
  const [frequency, setFrequency] = useState('Every 30 days');

  const drink: ProductDrink = PRODUCT_DRINKS[activeIndex] ?? PRODUCT_DRINKS[0];

  useEffect(() => {
    if (searchParams.get('pack') === 'case30') {
      setMode('once');
    }
  }, [searchParams]);

  return (
    <section id="shop" className="relative border-y-2 border-[#2D4F3E] bg-[#F5E8CA] py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="relative">
            <div className="relative flex min-h-[320px] items-center justify-center md:min-h-[420px]">
              <motion.img
                key={drink.slug}
                src={drink.bottleImage}
                alt={drink.name}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 h-auto w-[min(78vw,22rem)] max-w-none object-contain md:w-[min(42vw,28rem)]"
              />
            </div>
          </div>

          <div className="relative z-10">
            {searchParams.get('pack') === 'case30' ? (
              <p className="mb-6 rounded-xl border border-[#2D4F3E]/25 bg-[#F9D067]/35 px-4 py-3 text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-[#2D4F3E] md:text-xs">
                Case pack (30 bottles): we&apos;ve highlighted{' '}
                <span className="text-[#2D4F3E]">One-time purchase</span> below—pick your flavor, then add to cart.
              </p>
            ) : null}
            <p className="font-bold text-xs uppercase tracking-widest text-[#2D4F3E]/65">
              Select a flavor
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold lowercase tracking-tight text-[#2D4F3E] md:text-5xl">
              {drink.shortLabel.toLowerCase()}
            </h2>
            <p className="mt-3 max-w-md text-sm font-bold uppercase leading-relaxed tracking-widest text-[#2D4F3E]/75">
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
                        ? 'border-[#2D4F3E] shadow-[0_0_0_2px_#2D4F3E]'
                        : 'border-[#2D4F3E]/30 hover:border-[#2D4F3E]/55'
                    }`}
                  >
                    {item.badge ? (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-[#2D4F3E] px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-widest text-white">
                        {item.badge}
                      </span>
                    ) : null}
                    <div className={`relative aspect-[4/3] w-full ${item.cardTint}`}>
                      <img
                        src={item.thumb}
                        alt=""
                        className="absolute inset-0 m-auto h-[88%] w-auto object-contain"
                      />
                    </div>
                    <div className="border-t border-[#2D4F3E]/20 bg-[#F9D067]/35 px-3 py-2">
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#2D4F3E]">
                        {item.shortLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-base font-medium leading-relaxed text-[#2D4F3E]/85 md:text-[1.05rem]">
              {drink.description}
            </p>

            <div className="mt-10 space-y-3">
              <button
                type="button"
                onClick={() => setMode('once')}
                className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-colors md:px-5 ${
                  mode === 'once'
                    ? 'border-[#2D4F3E] bg-[#F9EFD4]'
                    : 'border-[#2D4F3E]/30 bg-[#F9D067]/20 hover:border-[#2D4F3E]/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      mode === 'once' ? 'border-[#2D4F3E]' : 'border-[#2D4F3E]/35'
                    }`}
                  >
                    {mode === 'once' ? <span className="h-2 w-2 rounded-full bg-[#2D4F3E]" /> : null}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#2D4F3E]">
                    One-time purchase
                  </span>
                </span>
                <span className="text-sm font-black text-[#2D4F3E]">
                  ${drink.priceOneTime}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('subscribe')}
                className={`flex w-full flex-col gap-4 rounded-xl border px-4 py-4 text-left transition-colors md:px-5 ${
                  mode === 'subscribe'
                    ? 'border-2 border-[#2D4F3E] bg-[#F9D067]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                    : 'border-[#2D4F3E]/30 bg-[#F9EFD4]/60 hover:border-[#2D4F3E]/50'
                }`}
              >
                <div className="flex w-full items-start justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        mode === 'subscribe' ? 'border-[#2D4F3E]' : 'border-[#2D4F3E]/35'
                      }`}
                    >
                      {mode === 'subscribe' ? <span className="h-2 w-2 rounded-full bg-[#2D4F3E]" /> : null}
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#2D4F3E]">
                      Subscribe &amp; save
                    </span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-2 text-sm font-black">
                    <span className="text-[#2D4F3E]/45 line-through">${drink.priceOneTime}</span>
                    <span className="text-[#2D4F3E]">${drink.priceSubscribe}</span>
                  </span>
                </div>
                <ul className="space-y-1.5 pl-7 text-[0.7rem] font-bold uppercase tracking-widest text-[#2D4F3E]/75 md:text-xs">
                  <li>{drink.perUnit}</li>
                  <li>Free shipping on recurring orders</li>
                  <li>Cancel or pause anytime</li>
                </ul>
                <label className="block pl-7">
                  <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#2D4F3E]/60">
                    Frequency
                  </span>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 w-full cursor-pointer rounded-lg border border-[#2D4F3E]/35 bg-[#F9EFD4] px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-[#2D4F3E] outline-none transition-colors focus:border-[#2D4F3E]"
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
              className="mt-6 w-full rounded-full bg-[#F47C3E] py-4 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 hover:brightness-[1.03] active:scale-[0.99]"
            >
              Add to cart
            </button>
            <p className="mt-3 text-center text-xs font-medium text-[#2D4F3E]/55">
              You&apos;ll confirm interest on the list—no charge until we ship.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlavorShopSection;
