import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useMailingList } from '../contexts/MailingListContext';
import logoTransparent from '../materials/jamu jiva logo1.png';

const CULTURE_LINKS = [
  { label: '30 Days Ritual', to: '/ritual' },
  { label: 'Origin Story', to: '/culture' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { openMailingList } = useMailingList();

  const { scrollY } = useScroll();
  const logoHeight = useTransform(scrollY, [0, 80], [170, 70]);
  const logoOffsetY = useTransform(scrollY, [0, 80], [50, 0]);

  const [hideNav, setHideNav] = useState(false);
  const [pastProduct, setPastProduct] = useState(false);
  const [cultureOpen, setCultureOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCultureOpen, setMobileCultureOpen] = useState(false);
  const cultureCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCultureTimer = () => {
    if (cultureCloseTimer.current) {
      clearTimeout(cultureCloseTimer.current);
      cultureCloseTimer.current = null;
    }
  };

  const openCultureMenu = () => {
    clearCultureTimer();
    setCultureOpen(true);
  };

  const scheduleCloseCultureMenu = () => {
    clearCultureTimer();
    cultureCloseTimer.current = setTimeout(() => setCultureOpen(false), 140);
  };

  useEffect(() => {
    return () => clearCultureTimer();
  }, []);

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
        setPastProduct(false);
        return;
      }
      const sectionHeight = el.offsetHeight;
      const scrolledInto = sy - el.offsetTop;
      const past = scrolledInto >= sectionHeight * 0.75;
      setPastProduct(past);
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
    setCultureOpen(false);
    setMobileOpen(false);
    setMobileCultureOpen(false);
  };

  const linkClassHero =
    'font-bold text-xs uppercase tracking-widest transition-colors hover:text-[#F47C3E]';
  const linkClassSolid =
    'font-bold text-xs uppercase tracking-widest text-[#2D4F3E] transition-colors hover:text-[#F47C3E]';

  const shellClass =
    'w-full px-6 md:px-10 py-4 transition-colors backdrop-blur-[2px]';
  const shellStyle = isHome
    ? { backgroundColor: pastProduct ? 'rgba(245, 232, 202, 0.96)' : 'transparent' }
    : { backgroundColor: 'rgba(245, 242, 237, 0.97)' };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hideNav ? '-100%' : 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 right-0 z-50 w-full"
    >
      <motion.div style={shellStyle} className={`${shellClass} ${!isHome || pastProduct ? 'border-b border-[#2D4F3E]/10' : ''}`}>
        <div className="flex items-center justify-between gap-6">
          <Link to="/" onClick={closeAll} className="relative shrink-0 flex items-center h-[70px]">
            {isHome ? (
              <motion.img
                src={logoTransparent}
                alt="Jamu Jiva"
                style={{ height: logoHeight, y: logoOffsetY }}
                className="w-auto origin-top-left"
                decoding="async"
              />
            ) : (
              <img
                src={logoTransparent}
                alt="Jamu Jiva"
                className="h-[70px] w-auto"
                decoding="async"
              />
            )}
          </Link>

          <div className="ml-auto flex items-center gap-4 md:gap-10">
            <div
              className={`hidden md:flex items-center gap-10`}
              style={{ color: isHome && !pastProduct ? '#FFFFFF' : '#2D4F3E' }}
            >
              {isHome ? (
                <>
                  <div className="flex items-center gap-10">
                    <Link to="/shop" className={linkClassHero} onClick={closeAll}>
                      Shop All
                    </Link>
                    <Link to="/merch" className={linkClassHero} onClick={closeAll}>
                      Merch
                    </Link>
                  </div>
                  <div
                    className="relative"
                    onMouseEnter={openCultureMenu}
                    onMouseLeave={scheduleCloseCultureMenu}
                  >
                    <button
                      type="button"
                      aria-expanded={cultureOpen}
                      aria-haspopup="true"
                      className="inline-flex cursor-default items-center gap-1 bg-transparent font-bold text-xs uppercase tracking-widest transition-colors hover:text-[#F47C3E]"
                    >
                      <span className="inline-flex items-center gap-1">
                        Culture
                        <ChevronDown
                          className={`h-3 w-3 shrink-0 transition-transform ${cultureOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </button>
                    <AnimatePresence>
                      {cultureOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute right-0 top-full z-[60] mt-2 min-w-[13rem] rounded-lg border border-[#2D4F3E] bg-[#F5E8CA] py-2 shadow-[0_14px_40px_rgba(45,79,62,0.12)]"
                          onMouseEnter={openCultureMenu}
                          onMouseLeave={scheduleCloseCultureMenu}
                        >
                          {CULTURE_LINKS.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={closeAll}
                              className="block px-5 py-2.5 font-bold text-xs uppercase tracking-widest text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/45 hover:text-[#1e3d30]"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Link to="/journal" className={linkClassHero} onClick={closeAll}>
                      Jiva Journal
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/shop" className={linkClassSolid} onClick={closeAll}>
                    Shop All
                  </Link>
                  <Link to="/merch" className={linkClassSolid} onClick={closeAll}>
                    Merch
                  </Link>
                  <div
                    className="relative"
                    onMouseEnter={openCultureMenu}
                    onMouseLeave={scheduleCloseCultureMenu}
                  >
                    <button
                      type="button"
                      aria-expanded={cultureOpen}
                      aria-haspopup="true"
                      className="inline-flex cursor-default items-center gap-1 bg-transparent font-bold text-xs uppercase tracking-widest text-[#2D4F3E] transition-colors hover:text-[#F47C3E]"
                    >
                      Culture
                      <ChevronDown
                        className={`h-3 w-3 shrink-0 transition-transform ${cultureOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {cultureOpen ? (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute right-0 top-full z-[60] mt-2 min-w-[13rem] rounded-lg border border-[#2D4F3E] bg-[#F5E8CA] py-2 shadow-[0_14px_40px_rgba(45,79,62,0.12)]"
                          onMouseEnter={openCultureMenu}
                          onMouseLeave={scheduleCloseCultureMenu}
                        >
                          {CULTURE_LINKS.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={closeAll}
                              className="block px-5 py-2.5 font-bold text-xs uppercase tracking-widest text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/45 hover:text-[#1e3d30]"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <Link to="/journal" className={linkClassSolid} onClick={closeAll}>
                    Jiva Journal
                  </Link>
                </>
              )}
            </div>

            {isHome ? (
              <button
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${
                  pastProduct
                    ? 'border-[#2D4F3E]/25 text-[#2D4F3E]'
                    : 'border-white/45 text-white bg-transparent'
                }`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2D4F3E]/25 text-[#2D4F3E] md:hidden"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}

            {isHome ? (
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  openMailingList();
                }}
                className={`hidden md:inline-flex items-center justify-center rounded-full border px-6 py-2.5 font-black text-xs transition-all hover:bg-[#F47C3E] hover:border-[#F47C3E] ${
                  pastProduct
                    ? 'border-[#2D4F3E] bg-[#2D4F3E] text-white'
                    : 'border-white/45 bg-white/12 text-white'
                }`}
              >
                JOIN THE LIST
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  openMailingList();
                }}
                className="hidden rounded-full border border-[#2D4F3E] bg-[#2D4F3E] px-6 py-2.5 font-black text-xs text-white transition-all hover:bg-[#F47C3E] hover:border-[#F47C3E] md:inline-flex md:items-center md:justify-center"
              >
                JOIN THE LIST
              </button>
            )}
          </div>
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
                <button
                  type="button"
                  onClick={() => setMobileCultureOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg py-3 text-left hover:bg-[#F9D067]/35"
                >
                  Culture
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCultureOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCultureOpen ? (
                  <div className="ml-2 border-l border-[#2D4F3E]/15 pl-3">
                    {CULTURE_LINKS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeAll}
                        className="block py-2.5 text-[0.7rem] text-[#2D4F3E]/90 hover:text-[#F47C3E]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
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
