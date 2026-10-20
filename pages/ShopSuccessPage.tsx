import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const RIBBON_COLORS = ['#8C3F1F', '#F47C3E', '#F9D067', '#F2BBB5', '#E7C4A8', '#A34D27'];

function makeRibbons() {
  return Array.from({ length: 42 }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    duration: 2.2 + Math.random() * 1.5,
    width: index % 3 === 0 ? 7 : 5,
    height: 12 + Math.random() * 16,
    color: RIBBON_COLORS[index % RIBBON_COLORS.length],
    drift: -60 + Math.random() * 120,
    spin: 180 + Math.random() * 540,
  }));
}

const RibbonBurst: React.FC = () => {
  const ribbons = useMemo(() => makeRibbons(), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes jj-ribbon-fall {
          0% { transform: translate3d(0, -18vh, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translate3d(var(--drift), 108vh, 0) rotate(var(--spin)); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jj-ribbon { display: none; }
        }
      `}</style>
      {ribbons.map((ribbon) => (
        <span
          key={ribbon.id}
          className="jj-ribbon absolute top-0 block rounded-sm"
          style={{
            left: `${ribbon.left}%`,
            width: ribbon.width,
            height: ribbon.height,
            backgroundColor: ribbon.color,
            animation: `jj-ribbon-fall ${ribbon.duration}s ${ribbon.delay}s ease-in forwards`,
            ['--drift' as string]: `${ribbon.drift}px`,
            ['--spin' as string]: `${ribbon.spin}deg`,
          }}
        />
      ))}
    </div>
  );
};

const ShopSuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const isPreorder = params.get('preorder') === '1';
  const [synced, setSynced] = useState<'idle' | 'paid' | 'pending' | 'error'>('idle');

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    fetch('/api/orders/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.payment_status === 'paid') setSynced('paid');
        else if (data) setSynced('pending');
        else setSynced('error');
      })
      .catch(() => {
        if (active) setSynced('error');
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <main className="flex jj-min-screen items-center justify-center bg-[#F6F1E8] px-8 pb-16 pt-28">
      {isPreorder ? <RibbonBurst /> : null}
      <div className={`relative z-10 text-center ${isPreorder ? 'max-w-2xl' : 'max-w-md'}`}>
        <h1 className="font-serif text-4xl font-black text-[#8C3F1F]">
          {isPreorder ? "You're officially part of Jiva." : 'Thank you for your order!'}
        </h1>
        {isPreorder ? (
          <div className="mt-4 space-y-4 text-[#8C3F1F]/75">
            <p>Thank you for believing in us and being one of our earliest supporters.</p>
            <p>
              Your early-bird reservation is confirmed! We&apos;re working behind the scenes to bring Jiva to life, and
              we&apos;ll keep you updated on our launch and what&apos;s coming next.
            </p>
            <p>We can&apos;t wait to share Jiva with you.</p>
          </div>
        ) : (
          <p className="mt-4 text-[#8C3F1F]/75">
            {synced === 'paid'
              ? 'Payment is confirmed. The order is saved with the address and total Stripe collected.'
              : 'Stripe is confirming the payment. Your receipt will arrive by email, and the order will show in your account after that confirmation.'}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/account"
            className="inline-flex rounded-full bg-[#8C3F1F] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E]"
          >
            {isPreorder ? 'View my preorder' : 'View orders'}
          </Link>
          <Link
            to="/"
            className="inline-flex rounded-full border border-[#8C3F1F]/20 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-[#8C3F1F] hover:border-[#F47C3E] hover:text-[#F47C3E]"
          >
            {isPreorder ? 'Back to home' : 'Back home'}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ShopSuccessPage;
