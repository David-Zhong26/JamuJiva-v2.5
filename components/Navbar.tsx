import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Instagram, Menu, X } from 'lucide-react';
import colorLogo from '../materials/Jiva (8）.png';
import whiteLogo from '../materials/white jiva logo.png';

const PAGE_BG = '#F6F1E8';
const PAGE_BG_SOFT = 'rgba(246, 241, 232, 0.86)';
const NAV_BROWN = '#8C3F1F';
const PAGE_BG_BOTTOM_FADE =
  'linear-gradient(180deg, rgba(246, 241, 232, 0.86) 0%, rgba(246, 241, 232, 0.86) 80%, rgba(246, 241, 232, 0) 100%)';
const HERO_LOGO_HEIGHT = 38;
const COMPACT_LOGO_HEIGHT = 38;
const NAV_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
const MOBILE_HEADER_PADDING_TOP = 'max(0.75rem, env(safe-area-inset-top))';
const INSTAGRAM_URL = 'https://www.instagram.com/jamujiva/';
const NAV_LINKS = [
  { to: '/culture', label: 'About Us' },
  { to: '/shop', label: 'Shop All' },
  { to: '/events', label: 'Events' },
  { to: '/journal', label: 'Jiva Journal' },
] as const;

const Navbar: React.FC = () => {
  const location = useLocation();
  const isShopRoute =
    location.pathname === '/shop' ||
    location.pathname === '/shop/' ||
    location.pathname.startsWith('/shop/');
  const isShopCancel = location.pathname.startsWith('/shop/cancel');
  const isShopCheckoutResult = location.pathname.startsWith('/shop/success');

  const isOverlayNav =
    location.pathname === '/' ||
    (isShopRoute && !isShopCheckoutResult) ||
    location.pathname === '/culture' ||
    location.pathname.startsWith('/merch') ||
    location.pathname.startsWith('/journal') ||
    location.pathname.startsWith('/events');

  const [navCompact, setNavCompact] = useState(!isOverlayNav);
  const [hideNav, setHideNav] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Solid brown cancel page: keep white overlay nav, no cream compact bar
  const showCompactNav = isShopCancel ? false : !isOverlayNav || navCompact;

  useEffect(() => {
    if (!isOverlayNav) {
      setNavCompact(true);
      setHideNav(false);
      return;
    }

    if (isShopCancel) {
      setNavCompact(false);
      setHideNav(false);
      return;
    }

    const check = () => {
      const sy = window.scrollY;
      setNavCompact(sy > 0);
      setHideNav(false);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [isOverlayNav, isShopCancel, location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setMobileOpen(false);
  };

  const linkClass =
    'font-bold text-sm uppercase tracking-widest transition-colors hover:text-[#F47C3E]';

  const renderLogo = (className: string) =>
    isOverlayNav ? (
      <motion.img
        src={showCompactNav ? colorLogo : whiteLogo}
        alt="Jiva"
        className={className}
        animate={{
          height: showCompactNav ? COMPACT_LOGO_HEIGHT : HERO_LOGO_HEIGHT,
        }}
        transition={NAV_TRANSITION}
        decoding="async"
      />
    ) : (
      <img
        src={colorLogo}
        alt="Jiva"
        className={`${className} h-[44px]`}
        decoding="async"
      />
    );

  const renderMobileMenuButton = () =>
    isOverlayNav ? (
      <motion.button
        type="button"
        animate={{
          borderColor: showCompactNav ? 'rgba(140, 63, 31, 0.25)' : 'rgba(255, 255, 255, 0.45)',
          color: showCompactNav ? NAV_BROWN : '#FFFFFF',
        }}
        transition={NAV_TRANSITION}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-transparent"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>
    ) : (
      <button
        type="button"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8C3F1F]/25 text-[#8C3F1F]"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hideNav ? '-100%' : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-0 right-0 z-50 w-full"
      >
      {/* Mobile header */}
      <div className="relative isolate md:hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 backdrop-blur-sm"
          style={{
            top: 'calc(-1 * max(0.75rem, env(safe-area-inset-top)) - 1.25rem)',
            WebkitBackdropFilter: 'blur(8px)',
            background: showCompactNav ? PAGE_BG_BOTTOM_FADE : 'transparent',
          }}
          animate={{
            opacity: showCompactNav ? 1 : 0,
            visibility: showCompactNav ? 'visible' : 'hidden',
          }}
          transition={NAV_TRANSITION}
        />
        <div
          className="relative flex items-center justify-between px-5 pb-4"
          style={{ paddingTop: MOBILE_HEADER_PADDING_TOP }}
        >
          <Link to="/" onClick={closeAll} className="inline-flex shrink-0">
            {renderLogo('block w-auto origin-top-left')}
          </Link>
          {renderMobileMenuButton()}
        </div>
      </div>

      {/* Desktop header */}
      {isOverlayNav ? (
        <motion.div
          className="relative hidden px-9 py-7 md:block"
          style={{
            background: showCompactNav ? PAGE_BG_BOTTOM_FADE : 'transparent',
          }}
        >
          <Link to="/" onClick={closeAll} className="absolute left-9 top-1/2 z-10 inline-flex -translate-y-1/2 items-center">
            {renderLogo('block w-auto origin-top-left')}
          </Link>

          <motion.div
            className="flex items-center justify-center"
            animate={{ color: showCompactNav ? NAV_BROWN : '#FFFFFF' }}
            transition={NAV_TRANSITION}
          >
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.1em] md:gap-10 lg:gap-12">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass} onClick={closeAll}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-9 top-1/2 inline-flex -translate-y-1/2 items-center justify-center transition-opacity hover:opacity-80"
            animate={{
              color: showCompactNav ? NAV_BROWN : '#FFFFFF',
            }}
            transition={NAV_TRANSITION}
            aria-label="Instagram"
          >
            <Instagram className="h-7 w-7" />
          </motion.a>
        </motion.div>
      ) : (
        <div className="relative hidden w-full px-9 py-4 md:block" style={{ background: PAGE_BG_SOFT }}>
          <Link to="/" onClick={closeAll} className="absolute left-9 top-1/2 z-10 inline-flex -translate-y-1/2 items-center">
            {renderLogo('block w-auto origin-top-left')}
          </Link>

          <div className="flex items-center justify-center text-[#8C3F1F]">
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.1em] md:gap-10 lg:gap-12">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass} onClick={closeAll}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-9 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-[#8C3F1F] transition-opacity hover:opacity-80"
            aria-label="Instagram"
          >
            <Instagram className="h-7 w-7" />
          </a>
        </div>
      )}

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#2D4F3E]/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,19rem)] flex-col bg-[#F6F1E8] p-6 shadow-2xl"
              style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-serif text-lg font-black text-[#2D4F3E]">Menu</span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2D4F3E]/20 text-[#2D4F3E]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 font-bold text-xs uppercase tracking-widest text-[#2D4F3E]">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeAll}
                    className="rounded-lg py-3 hover:bg-[#F9D067]/35"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};

export default Navbar;
