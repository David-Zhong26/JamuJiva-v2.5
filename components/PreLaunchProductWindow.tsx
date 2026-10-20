import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCT_DRINKS } from '../constants/productDrinks';
import { formatShopPrice } from '../constants/shopProducts';
import { useAuth } from '../contexts/AuthContext';
import goldenGlowCan from '../materials/golden-glow-can-hero.jpg';
import shopDrinksComingSoonBg from '../materials/shop-drinks-coming-soon-bg.png';

const PRELAUNCH_PRICE = {
  compareAtPrice: 6,
  price: 2.99,
  bottleSize: '8 oz',
} as const;

type JoinStatus = 'idle' | 'paying' | 'error';

const PreLaunchProductWindow: React.FC = () => {
  const { session, loading: authLoading } = useAuth();
  const drink = PRODUCT_DRINKS[0];
  const [joined, setJoined] = useState(0);
  const [goal, setGoal] = useState(120);
  const remaining = Math.max(0, goal - joined);
  const progressPct = goal > 0 ? Math.min(100, Math.round((joined / goal) * 100)) : 0;

  const [joinStatus, setJoinStatus] = useState<JoinStatus>('idle');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const joiningRef = useRef(false);
  const lineTotal = Math.round(PRELAUNCH_PRICE.price * quantity * 100) / 100;

  const applyProgress = (data: { joined?: unknown; goal?: unknown }) => {
    if (typeof data.joined === 'number') setJoined(data.joined);
    if (typeof data.goal === 'number' && data.goal > 0) setGoal(data.goal);
  };

  useEffect(() => {
    let active = true;
    const load = () => {
      fetch('/api/prelaunch')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (active && data) applyProgress(data);
        })
        .catch(() => {});
    };

    load();
    const timer = window.setInterval(load, 20000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const handleJoin = async () => {
    if (authLoading || joiningRef.current) return;

    joiningRef.current = true;
    setJoinStatus('paying');
    setJoinError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ source: 'prelaunch', quantity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.url !== 'string') {
        setJoinStatus('error');
        setJoinError(typeof data.error === 'string' ? data.error : 'Checkout could not start. Please try again.');
        return;
      }
      window.location.href = data.url;
    } catch {
      setJoinStatus('error');
      setJoinError('Checkout could not start. Please try again.');
    } finally {
      joiningRef.current = false;
    }
  };

  const buttonLabel = joinStatus === 'paying' ? 'Redirecting…' : 'Join Pre-Launch';

  return (
    <section className="relative jj-min-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={shopDrinksComingSoonBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#120904]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.1),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex jj-min-screen max-w-7xl flex-col px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-32">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-[0_30px_90px_rgba(16,5,0,0.28)]">
              <motion.img
                src={goldenGlowCan}
                alt={drink.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="relative z-10 rounded-[2rem] bg-[#F6F1E8] px-6 py-7 text-[#6F2E1E] shadow-[0_30px_90px_rgba(16,5,0,0.22)] sm:px-8 sm:py-8 md:px-10 md:py-10">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#F47C3E]">
              Pre-Launch
            </p>
            <h1 className="mt-3 font-serif text-5xl font-normal leading-[0.95] tracking-tight text-[#6F2E1E] md:text-[4rem]">
              {drink.name}
            </h1>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[#6F2E1E]/75">
              {drink.eyebrow}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#6F2E1E]/55">
              {PRELAUNCH_PRICE.bottleSize} per bottle
            </p>

            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-[#6F2E1E]/85 md:text-[1.08rem]">
              {drink.descriptionDesktop ?? drink.description}
            </p>

            <div className="mt-8 flex flex-wrap items-baseline gap-3">
              <span className="text-lg font-bold text-[#6F2E1E]/45 line-through">
                {formatShopPrice(PRELAUNCH_PRICE.compareAtPrice)}
              </span>
              <span className="text-3xl font-black text-[#8C3F1F]">
                {formatShopPrice(PRELAUNCH_PRICE.price)}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6F2E1E]/55">
                pre-launch price
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-[#8C3F1F]/20 bg-white/80">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || joinStatus === 'paying'}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="h-11 w-11 text-lg font-black text-[#8C3F1F] disabled:opacity-40"
                >
                  −
                </button>
                <span className="min-w-[1.5rem] text-center text-base font-black text-[#6F2E1E]" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= 20 || joinStatus === 'paying'}
                  onClick={() => setQuantity((current) => Math.min(20, current + 1))}
                  className="h-11 w-11 text-lg font-black text-[#8C3F1F] disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <p className="text-sm font-bold text-[#6F2E1E]/70">
                {quantity === 1 ? '1 bottle' : `${quantity} bottles`} · {formatShopPrice(lineTotal)}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#8C3F1F]/18 bg-[#F9D067]/22 px-5 py-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#8C3F1F]/70">
                    Batch progress
                  </p>
                  <p className="mt-1.5 font-serif text-2xl font-normal text-[#6F2E1E]">
                    {joined}{' '}
                    <span className="text-base text-[#6F2E1E]/55">of {goal} reserved</span>
                  </p>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6F2E1E]/65">
                  {remaining === 0 ? 'Batch full' : `${remaining} to go`}
                </p>
              </div>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#8C3F1F]/15"
                role="progressbar"
                aria-valuenow={joined}
                aria-valuemin={0}
                aria-valuemax={goal}
                aria-label="Pre-launch batch progress"
              >
                <motion.div
                  className="h-full rounded-full bg-[#8C3F1F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#6F2E1E]/75">
                Help us hit {goal} pre-orders to fulfill this first batch.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleJoin()}
              disabled={authLoading || joinStatus === 'paying'}
              className="mt-8 w-full rounded-xl bg-[#8C3F1F] px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 hover:bg-[#A34D27] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[18rem]"
            >
              {buttonLabel}
            </button>
            {joinStatus === 'error' && joinError ? (
              <p className="mt-3 text-center text-sm text-[#8C3F1F]">{joinError}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreLaunchProductWindow;
