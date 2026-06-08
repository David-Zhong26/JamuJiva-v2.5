import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useMailingList } from '../contexts/MailingListContext';
import logoTransparent from '../materials/jamu jiva logo1 copy.png';

const PAGE_BG = '#F5E8CA';
const LOGO_SHRINK_SCROLL = 80;

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { openMailingList } = useMailingList();

  const { scrollY } = useScroll();
  const logoHeight = useTransform(scrollY, [0, LOGO_SHRINK_SCROLL], [72, 44]);
  const navSolidFade = useTransform(scrollY, [0, LOGO_SHRINK_SCROLL], [0, 1]);
  const shellBackgroundColor = useTransform(
    navSolidFade,
    (v) => `rgba(245, 232, 202, ${v})`
  );
  const navLinkColor = useTransform(scrollY, [0, LOGO_SHRINK_SCROLL], ['#FFFFFF', '#2D4F3E']);
  const menuBorderColor = useTransform(scrollY, [0, LOGO_SHRINK_SCROLL], [
    'rgba(255, 255, 255, 0.45)',
    'rgba(45, 79, 62, 0.25)',
  ]);
  const ctaBackgroundColor = useTransform(scrollY, [0, LOGO_SHRINK_SCROLL], [
    'rgba(255, 255, 255, 0.12)',
    'rgb(45, 79, 62)',
  ]);
  const ctaBorderColor = useTransform(scrollY, [0, LOGO_SHRINK_SCROLL], [
    'rgba(255, 255, 255, 0.45)',
    'rgb(45, 79, 62)',
  ]);

  const [hideNav, setHideNav] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setHideNav(false);
      return;
    }
    const check = () => {
      const sy = window.scrollY;
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
  }, [isHome]);

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hideNav ? '-100%' : 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 right-0 z-50 w-full"
    >
      <motion.div
        style={isHome ? { backgroundColor: shellBackgroundColor } : { backgroundColor: PAGE_BG }}
        className="relative w-full"
      >
        <Link
          to="/"
          onClick={closeAll}
          className="absolute left-5 top-4 z-10 md:left-12"
        >
          {isHome ? (
            <motion.img
              src={logoTransparent}
              alt="Jamu Jiva"
              style={{ height: logoHeight }}
              className="w-auto origin-top-left"
              decoding="async"
            />
          ) : (
            <img
              src={logoTransparent}
              alt="Jamu Jiva"
              className="h-[44px] w-auto"
              decoding="async"
            />
          )}
        </Link>

        <div className="relative flex min-h-11 items-center justify-end gap-4 px-4 py-3 md:min-h-[2.75rem] md:gap-10 md:px-10 md:py-4">
          <motion.div
            className="hidden h-10 items-center gap-10 md:flex"
            style={{ color: isHome ? navLinkColor : '#2D4F3E' }}
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
              style={{ borderColor: menuBorderColor, color: navLinkColor }}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-transparent md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          ) : (
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2D4F3E]/25 text-[#2D4F3E] md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          {isHome ? (
            <motion.button
              type="button"
              onClick={() => {
                closeAll();
                openMailingList();
              }}
              style={{ backgroundColor: ctaBackgroundColor, borderColor: ctaBorderColor }}
              className="hidden shrink-0 rounded-full border px-6 py-2.5 font-black text-sm text-white transition-all hover:border-[#F47C3E] hover:bg-[#F47C3E] md:inline-flex md:items-center md:justify-center"
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
              className="hidden shrink-0 rounded-full border border-[#2D4F3E] bg-[#2D4F3E] px-6 py-2.5 font-black text-sm text-white transition-all hover:border-[#F47C3E] hover:bg-[#F47C3E] md:inline-flex md:items-center md:justify-center"
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
              >
                JOIN THE LIST
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
