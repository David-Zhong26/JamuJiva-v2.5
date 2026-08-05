import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import shopHeroImg from '../materials/background 3.png';
import shopDrinksImg from '../materials/shop-drinks.png';
import shopMerchImg from '../materials/shop-merch.png';

const cardClassName =
  'group relative flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-[#F6F1E8] shadow-[0_16px_40px_rgba(48,16,4,0.16)] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none';

const ShopIndex: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-[#F6F1E8]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={shopHeroImg}
            alt=""
            className="h-full w-full object-cover object-[center_22%] brightness-[0.72]"
          />
          <div className="absolute inset-0 bg-[#1A100C]/48" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(96svh,54rem)] max-w-[88rem] flex-col px-4 pb-20 pt-24 sm:px-6 md:min-h-[min(100svh,58rem)] md:px-8 md:pb-24 md:pt-28 lg:px-10">
          <div className="pt-1 md:pt-2">
            <h1 className="font-serif text-5xl leading-none text-white sm:text-6xl md:text-[4.25rem]">
              Shop All
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
              Drinks that uplift. Merch that inspires.
            </p>
          </div>

          <div className="mt-8 flex flex-1 flex-col items-stretch justify-center sm:mt-10 md:mt-12 md:pb-4">
            <div className="flex w-full flex-col items-stretch justify-center gap-5 sm:flex-row sm:items-stretch sm:gap-5 md:gap-6 lg:gap-7">
              <Link to={`/shop/drinks${location.search}`} className={cardClassName}>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE4D8]">
                  <img
                    src={shopDrinksImg}
                    alt="Jiva drinks"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    decoding="async"
                  />
                </div>
                <div className="relative flex items-end gap-3 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-[1.7rem] leading-none text-[#6F2E1E] sm:text-[1.85rem]">
                      Drinks
                    </h2>
                    <p className="mt-1.5 text-sm leading-snug text-[#6F2E1E]/75">
                      Explore our wellness beverages.
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6F2E1E] text-white transition-transform group-hover:scale-105">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/merch" className={cardClassName}>
                <div
                  className="pointer-events-none absolute right-3 top-3 z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center sm:right-4 sm:top-4 sm:h-[4.75rem] sm:w-[4.75rem]"
                  aria-hidden
                >
                  <span
                    className="absolute inset-0 bg-[#F2BBB5]"
                    style={{
                      clipPath:
                        'polygon(50% 0%, 63% 12%, 80% 8%, 82% 26%, 97% 35%, 90% 50%, 97% 65%, 82% 74%, 80% 92%, 63% 88%, 50% 100%, 37% 88%, 20% 92%, 18% 74%, 3% 65%, 10% 50%, 3% 35%, 18% 26%, 20% 8%, 37% 12%)',
                    }}
                  />
                  <span className="relative px-1.5 text-center text-[9px] font-black uppercase leading-tight tracking-[0.06em] text-[#6F2E1E] sm:text-[10px]">
                    Coming
                    <br />
                    Soon
                  </span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE4D8]">
                  <img
                    src={shopMerchImg}
                    alt="Jiva merch"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    decoding="async"
                  />
                </div>
                <div className="relative flex items-end gap-3 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-[1.7rem] leading-none text-[#6F2E1E] sm:text-[1.85rem]">
                      Merch
                    </h2>
                    <p className="mt-1.5 text-sm leading-snug text-[#6F2E1E]/75">
                      Shop our everyday essentials.
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6F2E1E] text-white transition-transform group-hover:scale-105">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopIndex;
