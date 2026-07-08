import React, { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ProductShopPage from '../components/ProductShopPage';
import ShopIndex from '../components/ShopIndex';
import ShoppingCart from '../components/ShoppingCart';
import { CartProvider } from '../contexts/CartContext';
import { useMailingList } from '../contexts/MailingListContext';
import { ShopAccessProvider, useShopAccess } from '../contexts/ShopAccessContext';

const ShopContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isEligible, grantAccess, clearAccess, accessMode } = useShopAccess();
  const { openMailingList } = useMailingList();
  const [screeningStep, setScreeningStep] = useState<'location' | 'zip'>('location');
  const [zip, setZip] = useState('');
  const [deliveryZips, setDeliveryZips] = useState<string[]>([]);
  const [zipsLoaded, setZipsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shopMode = useMemo(() => new URLSearchParams(location.search).get('shop'), [location.search]);

  useEffect(() => {
    if (isEligible) return;
    setZipsLoaded(false);
    fetch('/api/delivery-zips')
      .then((r) => r.json())
      .then((data) => {
        setDeliveryZips(data.zips ?? []);
        setZipsLoaded(true);
      })
      .catch(() => {
        setDeliveryZips([]);
        setZipsLoaded(true);
      });
  }, [isEligible]);

  useEffect(() => {
    if (shopMode === 'ny') {
      setScreeningStep('location');
      setError(null);

      if (!isEligible || accessMode !== 'pickup') {
        grantAccess('nyc-food-bazaar', 'pickup', 'NY Indonesian Food Bazaar');
      }
      return;
    }

    if (shopMode === 'ma') {
      setScreeningStep('zip');
      setError(null);

      if (isEligible && accessMode === 'pickup') {
        clearAccess();
      }
      return;
    }

    if (isEligible) {
      clearAccess();
    }

    if (!isEligible) {
      setScreeningStep('location');
      setError(null);
    }
  }, [shopMode, isEligible, accessMode, grantAccess, clearAccess]);

  const handleInMa = () => {
    navigate('/shop?shop=ma');
    setError(null);
  };

  const handleNycBazaar = () => {
    navigate('/shop?shop=ny');
    grantAccess('nyc-food-bazaar', 'pickup', 'NY Indonesian Food Bazaar');
    setError(null);
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = zip.trim();
    if (!/^\d{5}$/.test(normalized)) {
      setError('Enter a valid 5-digit ZIP code.');
      return;
    }
    if (deliveryZips.length === 0) {
      setError('Delivery areas not loaded. Restart npm run dev and check your .env file.');
      return;
    }
    if (!deliveryZips.includes(normalized)) {
      setError(
        `We do not deliver to ${normalized} yet. Add it to DELIVERY_ZIPS in .env if this should work, then restart the server.`
      );
      return;
    }
    grantAccess(normalized);
  };

  if (!isEligible) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] px-8 pb-16 pt-28">
        <div className="w-full max-w-3xl p-6 sm:p-8">
          {screeningStep === 'location' ? (
            <>
              <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-black leading-[1.05] text-[#2D4F3E] sm:text-4xl">
                We&apos;d love to bring Jiva to you!
              </h2>
              <div className="mt-5 space-y-2 text-sm leading-relaxed text-[#2D4F3E]/75 sm:text-base">
                <p>We&apos;re accepting preorders in select areas of Massachusetts.</p>
                <p>Enter your ZIP code to check availability.</p>
                <p>Outside our delivery area? Join the waitlist for nationwide updates!</p>
              </div>
              </div>
              {error ? (
                <p className="mt-4 text-center text-sm text-[#B45309]">{error}</p>
              ) : null}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleInMa}
                  className="rounded-full bg-[#2D4F3E] py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#F47C3E]"
                >
                  Yes, I&apos;m in MA!
                </button>
                <button
                  type="button"
                  onClick={handleNycBazaar}
                  className="rounded-full border border-[#2D4F3E] bg-[#F9EFD4] px-4 py-3.5 text-[11px] font-black uppercase leading-tight tracking-[0.1em] text-[#2D4F3E] transition-colors hover:bg-[#F5E8CA] whitespace-nowrap"
                >
                  NY Indonesian Food Bazaar
                </button>
                <button
                  type="button"
                  onClick={openMailingList}
                  className="rounded-full border border-[#2D4F3E]/30 py-3.5 text-xs font-black uppercase tracking-widest text-[#2D4F3E] transition-colors hover:border-[#2D4F3E]"
                >
                  No :( - join waitlist
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  navigate('/shop');
                  setError(null);
                }}
                className="text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/55 hover:text-[#2D4F3E]"
              >
                ← Back
              </button>
              <h2 className="mt-4 font-serif text-2xl font-black text-[#2D4F3E] sm:text-3xl">
                What&apos;s your ZIP code?
              </h2>
              <p className="mt-3 text-sm text-[#2D4F3E]/75 sm:text-base">
                We deliver to select Massachusetts-area ZIP codes.
              </p>
              <form onSubmit={handleZipSubmit} className="mt-6 space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => {
                    setZip(e.target.value.replace(/\D/g, ''));
                    setError(null);
                  }}
                  placeholder="02108"
                  className="w-full rounded-xl border border-[#2D4F3E]/25 bg-white/60 px-4 py-3.5 text-center font-mono text-lg tracking-widest text-[#2D4F3E] outline-none focus:border-[#2D4F3E]"
                />
                {error ? (
                  <p className="text-center text-sm leading-relaxed text-[#B45309]">{error}</p>
                ) : null}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#F47C3E] py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:brightness-105"
                >
                  Continue to shop
                </button>
                {error ? (
                  <button
                    type="button"
                    onClick={openMailingList}
                    className="w-full text-center text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/70 underline underline-offset-2"
                  >
                    Join the waitlist instead
                  </button>
                ) : null}
              </form>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <CartProvider>
      <main className="bg-[#F5E8CA] pb-16 pt-28">
        <Routes>
          <Route index element={<ShopIndex />} />
          <Route path=":slug" element={<ProductShopPage />} />
        </Routes>
        <ShoppingCart />
      </main>
    </CartProvider>
  );
};

const ShopPage: React.FC = () => (
  <ShopAccessProvider>
    <ShopContent />
  </ShopAccessProvider>
);

export default ShopPage;
