import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ProductShopPage from '../components/ProductShopPage';
import ShopDrinksCatalog from '../components/ShopDrinksCatalog';
import ShopIndex from '../components/ShopIndex';
import ShoppingCart from '../components/ShoppingCart';
import journalBg from '../materials/journal-bg-red.png';
import { CartProvider } from '../contexts/CartContext';
import { useMailingList } from '../contexts/MailingListContext';
import { ShopAccessProvider, useShopAccess } from '../contexts/ShopAccessContext';

const PICKUP_EVENTS = [
  {
    id: 'nyc-food-bazaar',
    label: 'NY Indonesian Food Bazaar',
    accessLabel: 'NY Indonesian Food Bazaar',
    shopParam: 'ny',
    active: false,
    archivedAt: '2026-07-13',
  },
] as const;

const DRINKS_PATH = '/shop/drinks';

const DrinksAccessGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isEligible, grantAccess, clearAccess, accessMode } = useShopAccess();
  const { openMailingList } = useMailingList();
  const [screeningStep, setScreeningStep] = useState<'location' | 'zip'>('location');
  const [zip, setZip] = useState('');
  const [deliveryZips, setDeliveryZips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const shopMode = useMemo(() => new URLSearchParams(location.search).get('shop'), [location.search]);
  const activePickupEvents = useMemo(() => PICKUP_EVENTS.filter((event) => event.active), []);
  const nyPickupEvent = PICKUP_EVENTS.find((event) => event.shopParam === 'ny') ?? null;

  useEffect(() => {
    if (isEligible) return;
    fetch('/api/delivery-zips')
      .then((r) => r.json())
      .then((data) => {
        setDeliveryZips(data.zips ?? []);
      })
      .catch(() => {
        setDeliveryZips([]);
      });
  }, [isEligible]);

  useEffect(() => {
    if (shopMode === 'ny') {
      if (!nyPickupEvent?.active) {
        clearAccess();
        setScreeningStep('location');
        setError(null);
        navigate(DRINKS_PATH, { replace: true });
        return;
      }

      setScreeningStep('location');
      setError(null);

      if (!isEligible || accessMode !== 'pickup') {
        grantAccess(nyPickupEvent.id, 'pickup', nyPickupEvent.accessLabel);
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

    if (!isEligible) {
      setScreeningStep('location');
      setError(null);
    }
  }, [shopMode, isEligible, accessMode, grantAccess, clearAccess, navigate, nyPickupEvent]);

  const handleInMa = () => {
    navigate(`${DRINKS_PATH}?shop=ma`);
    setError(null);
  };

  const handlePickupEvent = (eventId: string, accessLabel: string, shopParam: string) => {
    navigate(`${DRINKS_PATH}?shop=${shopParam}`);
    grantAccess(eventId, 'pickup', accessLabel);
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
      setError(`We do not deliver to ${normalized} yet. Join the waitlist for updates!`);
      return;
    }
    grantAccess(normalized);
  };

  if (!isEligible) {
    return (
      <div className="relative flex jj-min-screen items-center justify-center overflow-hidden px-8">
        <div className="absolute inset-0">
          <img src={journalBg} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1C100A]/28" />
        </div>

        <div className="relative z-10 w-full max-w-3xl p-6 sm:p-8">
          {screeningStep === 'location' ? (
            <>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif text-3xl font-black leading-[1.05] text-white sm:text-4xl">
                  We&apos;d love to bring Jiva to you!
                </h2>
                <div className="mt-5 space-y-2 text-sm leading-relaxed text-white/90 sm:text-base">
                  <p>We&apos;re accepting preorders in select areas of Massachusetts.</p>
                  <p>Enter your ZIP code to check availability.</p>
                  <p>Outside our delivery area? Join the waitlist for updates!</p>
                </div>
              </div>
              {error ? <p className="mt-4 text-center text-sm text-[#F9D067]">{error}</p> : null}
              <div
                className={`mt-8 grid gap-3 ${activePickupEvents.length > 0 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
              >
                <button
                  type="button"
                  onClick={handleInMa}
                  className="rounded-full bg-white py-3.5 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#F6F1E8]"
                >
                  Yes, I&apos;m in MA!
                </button>
                {activePickupEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handlePickupEvent(event.id, event.accessLabel, event.shopParam)}
                    className="whitespace-nowrap rounded-full border border-white/85 bg-white/10 px-4 py-3.5 text-[11px] font-black uppercase leading-tight tracking-[0.1em] text-white transition-colors hover:bg-white/20"
                  >
                    {event.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={openMailingList}
                  className="rounded-full border border-white/85 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white/10"
                >
                  No :( - join waitlist
                </button>
              </div>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
                >
                  ← Back to Shop All
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  navigate(DRINKS_PATH);
                  setError(null);
                }}
                className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
              >
                ← Back
              </button>
              <h2 className="mt-4 font-serif text-2xl font-black text-white sm:text-3xl">
                What&apos;s your ZIP code?
              </h2>
              <p className="mt-3 text-sm text-white/90 sm:text-base">
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
                  className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3.5 text-center font-mono text-lg tracking-widest text-white placeholder:text-white/45 outline-none focus:border-white"
                />
                {error ? (
                  <p className="text-center text-sm leading-relaxed text-[#F9D067]">{error}</p>
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
                    className="w-full text-center text-xs font-bold uppercase tracking-widest text-white/80 underline underline-offset-2 hover:text-white"
                  >
                    Join the waitlist instead
                  </button>
                ) : null}
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const ShopContent: React.FC = () => {
  const { isEligible } = useShopAccess();
  const location = useLocation();
  const isShopHub = location.pathname === '/shop' || location.pathname === '/shop/';
  const isDrinksCatalog = location.pathname === '/shop/drinks';
  const isProductDetail = location.pathname.startsWith('/shop/') && !isShopHub && !isDrinksCatalog;
  const isFullBleedGate = !isEligible && (isDrinksCatalog || isProductDetail);
  const isFullBleedShop = isShopHub || isDrinksCatalog || isProductDetail || isFullBleedGate;

  return (
    <CartProvider>
      <main
        className={`pb-0 ${isFullBleedGate || isProductDetail || isDrinksCatalog || isShopHub ? 'bg-transparent' : 'bg-[#F6F1E8]'} ${
          isFullBleedShop ? 'pt-0' : 'pt-20 md:pt-[5.25rem]'
        }`}
      >
        <Routes>
          <Route index element={<ShopIndex />} />
          <Route
            path="drinks"
            element={
              <DrinksAccessGate>
                <ShopDrinksCatalog />
              </DrinksAccessGate>
            }
          />
          <Route
            path=":slug"
            element={
              <DrinksAccessGate>
                <ProductShopPage />
              </DrinksAccessGate>
            }
          />
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
        {isEligible ? <ShoppingCart /> : null}
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
