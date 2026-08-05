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
import journalBg from '../materials/journal-bg-red.png';

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
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-[#F6F1E8] p-2 transition-colors duration-300 group-hover:bg-[#F4E2A8]">
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
    return <Navigate to={`/shop/drinks${location.search}`} replace />;
  }

  const drinkMeta =
    group.id === 'golden_glow'
      ? PRODUCT_DRINKS[0]
      : group.id === 'spiced_ivory'
        ? PRODUCT_DRINKS[1]
        : null;

  const otherFlavors = SHOP_GROUPS.filter((g) => g.id !== group.id);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={journalBg} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#120904]/22" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-32">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
          <div className="relative">
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[2rem] shadow-[0_30px_90px_rgba(16,5,0,0.24)]">
              <img
                src={journalBg}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#3A1A10]/18" />
              <motion.img
                key={group.slug}
                src={group.image}
                alt={group.name}
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 h-[92%] w-[96%] object-contain drop-shadow-[0_18px_40px_rgba(16,5,0,0.22)]"
              />
            </div>
          </div>

          <div className="relative z-10 rounded-[2rem] bg-[#F6F1E8] px-6 py-7 text-[#6F2E1E] shadow-[0_30px_90px_rgba(16,5,0,0.22)] sm:px-8 sm:py-8 md:px-10 md:py-10">
            <h1 className="font-serif text-5xl font-normal leading-[0.95] tracking-tight text-[#6F2E1E] md:text-[4rem]">
              {group.name}
            </h1>
            {group.eyebrow ? (
              <p className="mt-3 max-w-md text-sm font-bold uppercase leading-relaxed tracking-widest text-[#6F2E1E]/75">
                {group.eyebrow}
              </p>
            ) : null}
            <p className={`${group.eyebrow ? 'mt-2' : 'mt-3'} ${SHOP_BOTTLE_SIZE_CLASS.replace('#2D4F3E', '#6F2E1E')}`}>
              {shopGroupSizeLabel(group, 'product')}
            </p>

            <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-[#6F2E1E]/85 md:text-[1.08rem]">
              {drinkMeta?.description ?? group.description}
            </p>

            <p className="mt-10 text-[0.65rem] font-black uppercase tracking-widest text-[#8C3F1F]/65">
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
                        ? 'border-[#8C3F1F] bg-[#F9EFD4]'
                        : 'border-[#8C3F1F]/24 bg-[#F9D067]/18 hover:border-[#8C3F1F]/45'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-[#8C3F1F]' : 'border-[#8C3F1F]/35'
                        }`}
                      >
                        {selected ? <span className="h-2 w-2 rounded-full bg-[#8C3F1F]" /> : null}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest text-[#6F2E1E]">
                        {opt.label}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-2 text-sm font-black">
                      {opt.compareAtPrice != null ? (
                        <span className="text-[#6F2E1E]/45 line-through">
                          {formatShopPrice(opt.compareAtPrice)}
                        </span>
                      ) : null}
                      <span className="text-[#6F2E1E]">{formatShopPrice(opt.price)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-3xl font-black text-[#8C3F1F]">
              {formatShopPrice(
                group.options.find((opt) => opt.productId === selectedProductId)?.price ?? group.options[0].price
              )}
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-xl border border-[#8C3F1F]/25 bg-white/65">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-lg font-bold text-[#6F2E1E]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-black text-[#6F2E1E]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-lg font-bold text-[#6F2E1E]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => addItem(selectedProductId, quantity)}
                className="flex-1 rounded-xl bg-[#8C3F1F] px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 hover:bg-[#A34D27] active:scale-[0.99] sm:min-w-[18rem]"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {otherFlavors.length > 0 ? (
          <div className="mt-12 rounded-[1.5rem] bg-[#F6F1E8] px-6 py-7 shadow-[0_18px_50px_rgba(16,5,0,0.16)] md:mt-14 md:px-8">
            <p className="text-xs font-black uppercase tracking-widest text-[#F47C3E]">
              Explore
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[#6F2E1E] md:text-3xl">
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
