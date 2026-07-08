import React, { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { cartLineLabel, useCart } from '../contexts/CartContext';
import { cartLineTotal, formatShopPrice, shopProductById } from '../constants/shopProducts';
import { useShopAccess } from '../contexts/ShopAccessContext';

const QuantityStepper: React.FC<{
  value: number;
  onChange: (next: number) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center rounded-lg border border-[#2D4F3E]/20 bg-white">
    <button
      type="button"
      onClick={() => onChange(value - 1)}
      className="flex h-9 w-9 items-center justify-center text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/40"
      aria-label="Decrease quantity"
    >
      <Minus className="h-3.5 w-3.5" />
    </button>
    <span className="min-w-[2rem] text-center text-sm font-black tabular-nums text-[#2D4F3E]">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="flex h-9 w-9 items-center justify-center text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/40"
      aria-label="Increase quantity"
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  </div>
);

const CartPanel: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { lines, itemCount, setQuantity, removeItem, clearCart } = useCart();
  const { zip, accessMode, accessLabel } = useShopAccess();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const visibleError =
    accessMode === 'pickup' && error?.toLowerCase().includes('zip code') ? null : error;

  const subtotal = lines.reduce(
    (sum, line) => sum + cartLineTotal(line.productId, line.quantity),
    0
  );

  useEffect(() => {
    setError(null);
  }, [accessMode, accessLabel, zip]);

  const handleCheckout = async () => {
    if (lines.length === 0) return;
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zip,
          fulfillmentType: accessMode,
          accessLabel,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed.');
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('No checkout URL returned.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#FAF6EC]">
      <div className="flex items-center justify-between border-b border-[#2D4F3E]/10 px-5 py-5 md:px-6">
        <h2 className="font-serif text-2xl font-bold lowercase tracking-tight text-[#2D4F3E]">
          my shopping cart
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2D4F3E]/15 text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/35"
          aria-label="Close cart"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
        {lines.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9D067]/35">
              <ShoppingBag className="h-7 w-7 text-[#2D4F3E]/45" />
            </div>
            <p className="font-serif text-lg font-bold text-[#2D4F3E]">Your cart is empty</p>
            <p className="mt-2 max-w-[14rem] text-sm leading-relaxed text-[#2D4F3E]/60">
              Choose a flavor and tap <span className="font-bold">Add to cart</span>.
            </p>
          </div>
        ) : (
          <ul className="space-y-5">
            {lines.map((line) => {
              const product = shopProductById(line.productId);
              const lineTotal = cartLineTotal(line.productId, line.quantity);
              return (
                <li
                  key={line.productId}
                  className="flex gap-4 border-b border-[#2D4F3E]/8 pb-5 last:border-0"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F5E8CA] p-2">
                    <img
                      src={product.image}
                      alt=""
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold leading-snug text-[#2D4F3E]">
                          {cartLineLabel(line)}
                        </p>
                        <p className="mt-1 text-xs text-[#2D4F3E]/55">{product.variantLabel}</p>
                        <p className="mt-1 text-xs font-bold text-[#2D4F3E]/65">
                          {formatShopPrice(product.price)} each
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <button
                          type="button"
                          onClick={() => removeItem(line.productId)}
                          className="p-1 text-[#2D4F3E]/40 transition-colors hover:text-[#F47C3E]"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-black tabular-nums text-[#2D4F3E]">
                          {formatShopPrice(lineTotal)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper
                        value={line.quantity}
                        onChange={(q) => setQuantity(line.productId, q)}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div
        className="border-t border-[#2D4F3E]/10 bg-[#FAF6EC] px-5 py-5 md:px-6"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        {zip ? (
          <p className="mb-3 text-center text-xs text-[#2D4F3E]/55">
            {accessMode === 'pickup' ? (
              <>
                Pickup at <span className="font-bold text-[#2D4F3E]">{accessLabel || 'NY Indonesian Food Bazaar'}</span>
              </>
            ) : (
              <>
                Delivering to <span className="font-mono font-bold text-[#2D4F3E]">{zip}</span>
              </>
            )}
          </p>
        ) : null}

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-bold uppercase tracking-widest text-[#2D4F3E]/70">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-base font-black tabular-nums text-[#2D4F3E]">
            {formatShopPrice(subtotal)}
          </span>
        </div>

        {visibleError ? <p className="mb-3 text-center text-sm text-[#B45309]">{visibleError}</p> : null}

        <button
          type="button"
          disabled={lines.length === 0 || checkingOut}
          onClick={handleCheckout}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F47C3E] py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {checkingOut ? 'Redirecting…' : 'Checkout'}
          {!checkingOut ? <ArrowRight className="h-4 w-4" /> : null}
        </button>

        {lines.length > 0 ? (
          <button
            type="button"
            onClick={clearCart}
            className="mt-3 w-full text-center text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/50 hover:text-[#2D4F3E]"
          >
            Clear cart
          </button>
        ) : null}
      </div>
    </div>
  );
};

const ShoppingCart: React.FC = () => {
  const { isOpen, setOpen, itemCount } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-[#2D4F3E] px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg md:bottom-auto md:right-6 md:top-28"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-4 w-4" />
        Cart
        {itemCount > 0 ? (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#F47C3E] px-1 text-[0.65rem]">
            {itemCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[65] bg-[#2D4F3E]/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={`fixed bottom-0 right-0 top-0 z-[66] flex w-full max-w-md flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}
      >
        <CartPanel onClose={() => setOpen(false)} />
      </aside>
    </>
  );
};

export default ShoppingCart;
