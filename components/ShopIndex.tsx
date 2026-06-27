import React from 'react';
import { Link } from 'react-router-dom';
import { SHOP_GROUPS } from '../constants/shopProducts';

const ShopIndex: React.FC = () => (
  <section className="py-10 md:py-14">
    <div className="mx-auto max-w-5xl px-5 md:px-10">
      <h1 className="mt-2 font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl">
        Shop All
      </h1>
      <p className="mt-3 text-sm text-[#2D4F3E]/75 md:text-base md:whitespace-nowrap">
        Massachusetts-area delivery. Pick a flavor to choose your size and add to cart.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SHOP_GROUPS.map((group) => (
          <Link
            key={group.id}
            to={`/shop/${group.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-[#2D4F3E]/15 bg-[#F9EFD4]/40 transition-colors duration-300 hover:border-[#2D4F3E]/35 hover:bg-[#F6E7B8]"
          >
            {group.badge ? (
              <span className="absolute right-4 top-4 z-10 rounded-md bg-[#2D4F3E] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white">
                {group.badge}
              </span>
            ) : null}
            <div className="flex min-h-[200px] items-center justify-center bg-[#F5E8CA] p-8 transition-colors duration-300 group-hover:bg-[#F4E2A8]">
              <img
                src={group.image}
                alt={group.name}
                className="max-h-40 w-auto rounded-2xl object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-6 transition-colors duration-300 group-hover:bg-[#F6E7B8]">
              <h2 className="font-serif text-2xl font-bold text-[#2D4F3E]">{group.name}</h2>
              {group.eyebrow ? (
                <p className="mt-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#2D4F3E]/65">
                  {group.eyebrow}
                </p>
              ) : null}
              <p className="mt-2 text-sm leading-relaxed text-[#2D4F3E]/75">{group.description}</p>
              <span
                className={`inline-block text-xs font-black uppercase tracking-widest text-[#F47C3E] group-hover:text-[#2D4F3E] ${
                  group.id === 'mixed' ? 'mt-12' : 'mt-4'
                }`}
              >
                Shop now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default ShopIndex;
