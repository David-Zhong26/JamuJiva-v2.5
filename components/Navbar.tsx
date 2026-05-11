import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

const CULTURE_LINKS = [
  { label: 'Build your ritual', href: '#ritual' },
  { label: 'Origin story', href: '#story' },
  { label: 'Quick answers', href: '#faq' },
];

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const shellOpacity = useTransform(scrollY, [0, 80], [0, 0.96]);
  const textProgress = useTransform(scrollY, [0, 80], [0, 1]);

  const shellBackground = useMotionTemplate`rgba(245, 232, 202, ${shellOpacity})`;
  const navTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#2D4F3E']);
  const buttonBackground = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.12)', '#2D4F3E']);
  const buttonTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#FFFFFF']);
  const buttonBorder = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.45)', '#2D4F3E']);
  const mobileIconBorder = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.45)', 'rgba(45,79,62,0.22)']);

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

  const linkClass =
    'font-bold text-xs uppercase tracking-widest transition-colors hover:text-[#F47C3E]';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 z-50 w-full"
    >
      <motion.div
        style={{ backgroundColor: shellBackground }}
        className="w-full px-6 md:px-10 py-4 transition-colors backdrop-blur-[2px]"
      >
        <div className="flex items-center justify-between gap-6">
          <a href="#hero" onClick={closeAll} className="shrink-0">
            <motion.span style={{ color: navTextColor }} className="font-serif text-2xl font-black tracking-tighter">
              JAMU JIVA
            </motion.span>
          </a>

          <div className="ml-auto flex items-center gap-4 md:gap-10">
            <motion.div
              style={{ color: navTextColor }}
              className="hidden md:flex items-center gap-10 font-bold text-xs uppercase tracking-widest"
            >
              <a href="#benefits" className={linkClass}>
                Benefits
              </a>
              <a href="#shop" className={linkClass}>
                Ingredients
              </a>
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
                  <motion.span style={{ color: navTextColor }} className="inline-flex items-center gap-1">
                    Culture
                    <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${cultureOpen ? 'rotate-180' : ''}`} />
                  </motion.span>
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
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeAll}
                          className="block px-5 py-2.5 font-bold text-xs uppercase tracking-widest text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/45 hover:text-[#1e3d30]"
                        >
                          {item.label}
                        </a>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              <a href="#waitlist" className={linkClass}>
                Drops
              </a>
            </motion.div>

            <motion.button
              type="button"
              style={{ borderColor: mobileIconBorder, color: navTextColor }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-transparent md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>

            <motion.a
              href="#waitlist"
              onClick={closeAll}
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
                borderColor: buttonBorder,
              }}
              className="hidden md:inline-flex items-center justify-center rounded-full border px-6 py-2.5 font-black text-xs transition-all hover:bg-[#F47C3E] hover:border-[#F47C3E]"
            >
              JOIN THE LIST
            </motion.a>
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
                <a href="#benefits" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  Benefits
                </a>
                <a href="#shop" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  Ingredients
                </a>
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
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeAll}
                        className="block py-2.5 text-[0.7rem] text-[#2D4F3E]/90 hover:text-[#F47C3E]"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}
                <a href="#waitlist" onClick={closeAll} className="rounded-lg py-3 hover:bg-[#F9D067]/35">
                  Drops
                </a>
              </nav>
              <a
                href="#waitlist"
                onClick={closeAll}
                className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-[#2D4F3E] py-3.5 font-black text-xs text-white"
              >
                JOIN THE LIST
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
