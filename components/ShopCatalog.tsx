import React, { useState } from 'react';
import { SHOP_GROUPS, type ShopGroupId, type ShopProductId } from '../constants/shopProducts';
import { useCart } from '../contexts/CartContext';

const ShopCatalog: React.FC = () => {
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState<Record<ShopGroupId, ShopProductId>>({
    golden_glow: 'golden',
    spiced_ivory: 'spiced',
    mixed: 'mixed_duo',
  });
  const [addQty, setAddQty] = useState<Record<ShopGroupId, number>>({
    golden_glow: 1,
    spiced_ivory: 1,
    mixed: 1,
  });

  const bumpQty = (groupId: ShopGroupId, delta: number) => {
    setAddQty((prev) => ({
      ...prev,
      [groupId]: Math.max(1, Math.min(10, prev[groupId] + delta)),
    }));
  };

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <p className="text-xs font-black uppercase tracking-widest text-[#F47C3E]">Shop</p>
        <h1 className="mt-2 font-serif text-4xl font-black lowercase text-[#2D4F3E] md:text-5xl">
          shop all
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[#2D4F3E]/75 md:text-base">
          Massachusetts-area delivery. I-area delivery. I-area delivery. Pick your flavor and size, then add to cart when you&apos;re ready.
        </p>

        <div className="mt-10 space-y-8">
          {SHOP_GROUPS.map((group) => (
            <article
              key={group.id}
              className="overflow-hidden rounded-2xl border border-[#2D4F3E]/15 bg-[#F9EFD4]/40"
            >
              <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="flex min-h-[200px] items-center justify-center bg-[#F5E8CA] p-8 md:min-h-[240px]">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="max-h-44 w-auto object-contain"
                  />
                </div>

                <div className="flex flex-col p-6 md:p-8">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#2D4F3E]/65">
                    {group.eyebrow}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold lowercase text-[#2D4F3E] md:text-3xl">
                    {group.name.toLowerCase()}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#2D4F3E]/75">{group.description}</p>

                  <p className="mt-6 text-[0.65rem] font-black uppercase tracking-widest text-[#2D4F3E]/55">
                    Choose
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const selected = selectedOption[group.id] === opt.productId;
                      return (
                        <button
                          key={opt.productId}
                          type="button"
                          onClick={() =>
                            setSelectedOption((prev) => ({ ...prev, [group.id]: opt.productId }))
                          }
                          className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
                            selected
                              ? 'border-[#2D4F3E] bg-[#2D4F3E] text-[#F5E8CA]'
                              : 'border-[#2D4F3E]/30 bg-white/50 text-[#2D4F3E] hover:border-[#2D4F3E]/55'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-full border border-[#2D4F3E]/25 bg-white/60">
                      <button
                        type="button"
                        onClick={() => bumpQty(group.id, -1)}
                        className="flex h-10 w-10 items-center justify-center text-lg font-bold text-[#2D4F3E]"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-black text-[#2D4F3E]">
                        {addQty[group.id]}
                      </span>
                      <button
                        type="button"
                        onClick={() => bumpQty(group.id, 1)}
                        className="flex h-10 w-10 items-center justify-center text-lg font-bold text-[#2D4F3E]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => addItem(selectedOption[group.id], addQty[group.id])}
                      className="flex-1 rounded-full bg-[#2D4F3E] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#F47C3E] sm:flex-none"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCatalog;
