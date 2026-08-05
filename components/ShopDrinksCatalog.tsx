import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import nowPouringBg from '../materials/journal-bg-red.png';
import {
  SHOP_GROUPS,
  formatShopPrice,
  shopGroupDisplayPrice,
  type ShopGroup,
} from '../constants/shopProducts';
import { useShopAccess } from '../contexts/ShopAccessContext';

const DrinkCard: React.FC<{
  group: ShopGroup;
  index: number;
  search: string;
}> = ({ group, index, search }) => {
  const num = String(index + 1).padStart(2, '0');
  const to = `/shop/${group.slug}${search}`;

  return (
    <article className="relative flex h-full flex-col rounded-[1.75rem] bg-[#F6F1E8] px-6 py-7 shadow-[0_22px_60px_rgba(20,8,2,0.22)] sm:px-8 sm:py-8 md:px-9 md:py-9">
      {group.badge ? (
        <div
          className="pointer-events-none absolute right-4 top-4 z-20 flex h-[4.75rem] w-[4.75rem] items-center justify-center sm:right-5 sm:top-5 sm:h-[5.25rem] sm:w-[5.25rem]"
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
            Best
            <br />
            Seller
          </span>
        </div>
      ) : null}

      <div className="grid flex-1 items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_minmax(9rem,42%)] md:gap-4 lg:gap-6">
        <div className="flex min-h-0 min-w-0 flex-col">
          <p className="font-serif text-sm text-[#6F2E1E]/70 sm:text-base">{num}</p>
          <h2 className="mt-2 font-serif text-3xl leading-[0.95] text-[#6F2E1E] sm:text-4xl md:text-[2.6rem]">
            {group.name}
          </h2>
          <div className="mt-3 h-px w-14 bg-[#6F2E1E]/55" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6F2E1E]/85 sm:text-[0.95rem]">
            {group.description}
          </p>

          <div className="mt-auto pt-5">
            <p className="text-base font-black text-[#6F2E1E]">
              {formatShopPrice(shopGroupDisplayPrice(group))} USD
            </p>

            <Link
              to={to}
              className="mt-6 inline-flex w-full max-w-[16rem] items-center justify-between gap-3 rounded-xl border border-[#6F2E1E] px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#6F2E1E] transition-colors hover:bg-[#6F2E1E] hover:text-[#F6F1E8]"
            >
              Add to cart
              <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        <Link
          to={to}
          className="relative mx-auto flex min-h-[12rem] w-full max-w-[14rem] items-center justify-center self-center md:max-w-none md:min-h-[15rem] md:translate-x-1 lg:translate-x-2"
        >
          <img
            src={group.image}
            alt={group.name}
            className="max-h-48 w-auto object-contain drop-shadow-[0_18px_36px_rgba(48,16,4,0.22)] transition-transform duration-300 hover:scale-[1.03] sm:max-h-56 md:max-h-60 lg:max-h-64"
            decoding="async"
          />
        </Link>
      </div>
    </article>
  );
};

const ShopDrinksCatalog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessMode, clearAccess } = useShopAccess();

  const subtitle =
    accessMode === 'pickup'
      ? 'Pick up at the NY Indonesian Food Bazaar on July 11, from 11 AM to 6 PM.'
      : 'Functional drinks rooted in Indonesian heritage, made for modern rituals.';

  return (
    <section className="relative jj-min-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={nowPouringBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#1C100A]/52" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,16,10,0.55)_0%,rgba(28,16,10,0.28)_38%,rgba(28,16,10,0.5)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 md:px-10 md:pb-20 md:pt-28 lg:px-12">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              clearAccess();
              navigate('/shop/drinks');
            }}
            className="text-[11px] font-black uppercase tracking-[0.16em] text-white/80 underline underline-offset-4 hover:text-white"
          >
            {accessMode === 'pickup' ? 'Change pickup or delivery option' : 'Change delivery or pickup option'}
          </button>
        </div>

        <header className="mt-4 max-w-xl md:mt-5">
          <h1 className="font-serif text-5xl leading-none text-white sm:text-6xl md:text-[4.25rem]">
            Our Drinks
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base md:max-w-md">
            {subtitle}
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-7">
          {SHOP_GROUPS.map((group, index) => (
            <DrinkCard
              key={group.id}
              group={group}
              index={index}
              search={location.search}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopDrinksCatalog;
