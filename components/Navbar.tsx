import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useMailingList } from '../contexts/MailingListContext';
import logoTransparent from '../materials/Jiva (8）.png';

const PAGE_BG = '#F5E8CA';
const HERO_LOGO_HEIGHT = 72;
const COMPACT_LOGO_HEIGHT = 44;
const NAV_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
const MOBILE_HEADER_PADDING_TOP = 'max(0.75rem, env(safe-area-inset-top))';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { openMailingList } = useMailingList();

  const [navCompact, setNavCompact] = useState(!isHome);
  const [hideNav, setHideNav] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const showCompactNav = !isHome || navCompact;

  useEffect(() => {
    if (!isHome) {
      setNavCompact(true);
      setHideNav(false);
      return;
    }

    const check = () => {
      const sy = window.scrollY;
      setNavCompact(sy > 0);

      const halfHero = window.innerHeight * 0.5;
      const el = document.getElementById('benefits');
      if (!el) {
        setHideNav(sy > halfHero);
        return;
      }
      const sectionHeight = el.offsetHeight;
      const scrolledInto = sy - el.offsetTop;
      const past = scrolledInto >= sectionHeight * 0.75;
      setHideNav(sy > halfHero && !past);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [isHome, location.pathname]);

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
    isHome ? (
      <motion.img
        src={logoTransparent}
        alt="Jamu Jiva"
        className={className}
        animate={{
          height: showCompactNav ? COMPACT_LOGO_HEIGHT : HERO_LOGO_HEIGHT,
        }}
        transition={NAV_TRANSITION}
        decoding="async"
      />
    ) : (
      <img
        src={logoTransparent}
        alt="Jamu Jiva"
        className={`${className} h-[44px]`}
        decoding="async"
      />
    );

  const renderMobileMenuButton = () =>
    isHome ? (
      <motion.button
        type="button"
        animate={{
          borderColor: showCompactNav ? 'rgba(45, 79, 62, 0.25)' : 'rgba(255, 255, 255, 0.45)',
          color: showCompactNav ? '#2D4F3E' : '#FFFFFF',
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
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2D4F3E]/25 text-[#2D4F3E]"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    );

  return (
    <>
      <div className="mobile-top-bg md:hidden" aria-hidden />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hideNav ? '-100%' : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-0 right-0 z-50 w-full"
      >
      {/* Mobile header */}
      <div
        className="relative md:hidden"
        style={{ backgroundColor: showCompactNav ? PAGE_BG : 'transparent' }}
      >
        <div
          className="relative flex items-center justify-between px-5 pb-3"
          style={{ paddingTop: MOBILE_HEADER_PADDING_TOP }}
        >
          <Link to="/" onClick={closeAll} className="inline-flex shrink-0">
            {renderLogo('block w-auto origin-top-left')}
          </Link>
          {renderMobileMenuButton()}
        </div>
      </div>

      {/* Desktop header */}
      <motion.div
        animate={{
          backgroundColor: showCompactNav ? PAGE_BG : 'rgba(245, 232, 202, 0)',
        }}
        transition={NAV_TRANSITION}
        className="relative hidden w-full md:block"
      >
        <Link
          to="/"
          onClick={closeAll}
          className="absolute left-12 top-4 z-10"
        >
          {renderLogo('block w-auto origin-top-left')}
        </Link>

        <div className="relative flex min-h-[2.75rem] items-center justify-end gap-10 px-10 py-4">
          <motion.div
            className="flex h-10 items-center gap-10"
            animate={{ color: showCompactNav ? '#2D4F3E' : '#FFFFFF' }}
            transition={NAV_TRANSITION}
          >
            <Link to="/shop" className={linkClass} onClick={closeAll}>
              Shop All
            </Link>
            <Link to="/merch" className={linkClass} onClick={closeAll}>
              Merch
            </Link>
            <Link to="/culture" className={linkClass} onClick={closeAll}>
              About Us
            </Link>
            <Link to="/journal" className={linkClass} onClick={closeAll}>
              Jiva Journal
            </Link>
          </motion.div>

          {isHome ? (
            <motion.button
              type="button"
              onClick={() => {
                closeAll();
                openMailingList();
              }}
              animate={{
                backgroundColor: showCompactNav ? 'rgb(45, 79, 62)' : 'rgba(255, 255, 255, 0.12)',
                borderColor: showCompactNav ? 'rgb(45, 79, 62)' : 'rgba(255, 255, 255, 0.45)',
              }}
              transition={NAV_TRANSITION}
              className="inline-flex shrink-0 items-center justify-center rounded-full border px-6 py-2.5 font-black text-sm text-white transition-all hover:border-[#F47C3E] hover:bg-[#F47C3E]"
            >
              JOIN THE LIST
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeAll();
                openMailingList();
              }}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#2D4F3E] bg-[#2D4F3E] px-6 py-2.5 font-black text-sm text-white transition-all hover:border-[#F47C3E] hover:bg-[#F47C3E]"
            >
              JOIN THE LIST
            </button>
          )}
        </div>
      </motion.div>

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
              className="absolute right-0 top-0 flex h-full w-[min(100%,19rem)] flex-col bg-[#F5E8CA] p-6 shadow-2xl"
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
                <Link to="/shop" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  Shop All
                </Link>
                <Link to="/merch" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  Merch
                </Link>
                <Link to="/culture" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  About Us
                </Link>
                <Link to="/journal" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  Jiva Journal
                </Link>
              </nav>
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  openMailingList();
                }}
                className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-[#2D4F3E] py-3.5 font-black text-xs text-white"
                style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
              >
                JOIN THE LIST
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
    </>
  );
};

export default Navbar;
