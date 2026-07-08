import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCT_DRINKS } from '../constants/productDrinks';
import {
  SHOP_BOTTLE_SIZE_CLASS,
  SHOP_GROUPS,
  formatShopPrice,
  shopGroupBySlug,
  shopGroupDisplayPrice,
  shopGroupSizeLabel,
  type ShopGroup,
  type ShopProductId,
} from '../constants/shopProducts';
import { useCart } from '../contexts/CartContext';

const FlavorCard: React.FC<{ group: ShopGroup; compact?: boolean }> = ({ group, compact }) => {
  const location = useLocation();

  return (
    <Link
      to={`/shop/${group.slug}${location.search}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-[#2D4F3E]/30 bg-[#F9EFD4]/35 text-left transition-all duration-300 hover:border-[#2D4F3E]/55 hover:bg-[#F6E7B8] ${
        compact ? 'min-w-[7.5rem] md:min-w-[8.5rem]' : ''
      }`}
    >
      {group.badge ? (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-[#2D4F3E] px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-widest text-white">
          {group.badge}
        </span>
      ) : null}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-[#F5E8CA] p-2 transition-colors duration-300 group-hover:bg-[#F4E2A8]">
        <img
          src={group.image}
          alt={group.name}
          className="absolute inset-0 m-auto h-[88%] w-auto rounded-xl object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="border-t border-[#2D4F3E]/20 bg-[#F9D067]/35 px-3 py-2 transition-colors duration-300 group-hover:bg-[#F6E7B8]">
        <span className="text-[0.65rem] font-black uppercase tracking-widest text-[#2D4F3E]">
          {group.name}
        </span>
        <span className="mt-0.5 block text-[0.6rem] font-bold text-[#2D4F3E]/65">
          ${shopGroupDisplayPrice(group)}
        </span>
      </div>
    </Link>
  );
};

const ProductShopPage: React.FC = () => {
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const group = slug ? shopGroupBySlug(slug) : undefined;
  const { addItem } = useCart();

  const [selectedProductId, setSelectedProductId] = useState<ShopProductId>(
    group?.options[0]?.productId ?? 'golden'
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (group?.options[0]) {
      setSelectedProductId(group.options[0].productId);
      setQuantity(1);
    }
  }, [group?.id, group?.options]);

  if (!group) {
    return <Navigate to={`/shop${location.search}`} replace />;
  }

  const drinkMeta =
    group.id === 'golden_glow'
      ? PRODUCT_DRINKS[0]
      : group.id === 'spiced_ivory'
        ? PRODUCT_DRINKS[1]
        : null;

  const heroImage = group.image;
  const otherFlavors = SHOP_GROUPS.filter((g) => g.id !== group.id);

  return (
    <section className="border-b-2 border-[#2D4F3E]/10 py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Link
          to={`/shop${location.search}`}
          className="text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/55 hover:text-[#2D4F3E]"
        >
          ← Shop All
        </Link>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="relative">
            <div className="relative flex min-h-[280px] items-center justify-center md:min-h-[420px]">
              <motion.img
                key={group.slug}
                src={heroImage}
                alt={group.name}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 h-auto w-[min(78vw,22rem)] max-w-none rounded-2xl object-contain md:w-[min(42vw,28rem)]"
              />
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-[#2D4F3E] md:text-5xl">
              {group.name}
            </h1>
            {group.eyebrow ? (
              <p className="mt-3 max-w-md text-sm font-bold uppercase leading-relaxed tracking-widest text-[#2D4F3E]/75">
                {group.eyebrow}
              </p>
            ) : null}
            <p className={`${group.eyebrow ? 'mt-2' : 'mt-3'} ${SHOP_BOTTLE_SIZE_CLASS}`}>
              {shopGroupSizeLabel(group, 'product')}
            </p>

            <p className="mt-8 text-base font-medium leading-relaxed text-[#2D4F3E]/85 md:text-[1.05rem]">
              {drinkMeta?.description ?? group.description}
            </p>

            <p className="mt-10 text-[0.65rem] font-black uppercase tracking-widest text-[#2D4F3E]/55">
              Choose size
            </p>
            <div className="mt-3 space-y-3">
              {group.options.map((opt) => {
                const selected = selectedProductId === opt.productId;
                return (
                  <button
                    key={opt.productId}
                    type="button"
                    onClick={() => {
                      setSelectedProductId(opt.productId);
                      setQuantity(1);
                    }}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-colors md:px-5 ${
                      selected
                        ? 'border-[#2D4F3E] bg-[#F9EFD4]'
                        : 'border-[#2D4F3E]/30 bg-[#F9D067]/20 hover:border-[#2D4F3E]/50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-[#2D4F3E]' : 'border-[#2D4F3E]/35'
                        }`}
                      >
                        {selected ? <span className="h-2 w-2 rounded-full bg-[#2D4F3E]" /> : null}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest text-[#2D4F3E]">
                        {opt.label}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-2 text-sm font-black">
                      {opt.compareAtPrice != null ? (
                        <span className="text-[#2D4F3E]/45 line-through">
                          {formatShopPrice(opt.compareAtPrice)}
                        </span>
                      ) : null}
                      <span className="text-[#2D4F3E]">{formatShopPrice(opt.price)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-[#2D4F3E]/25 bg-white/60">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-[#2D4F3E]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-black text-[#2D4F3E]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex h-10 w-10 items-center justify-center text-lg font-bold text-[#2D4F3E]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => addItem(selectedProductId, quantity)}
                className="flex-1 rounded-full bg-[#F47C3E] py-4 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 hover:brightness-[1.03] active:scale-[0.99] sm:flex-none sm:px-10"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {otherFlavors.length > 0 ? (
          <div className="mt-16 border-t border-[#2D4F3E]/10 pt-12">
            <p className="text-xs font-black uppercase tracking-widest text-[#F47C3E]">
              Explore
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[#2D4F3E] md:text-3xl">
              Other Flavors
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {otherFlavors.map((flavor) => (
                <FlavorCard key={flavor.id} group={flavor} compact />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductShopPage;
