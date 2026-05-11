import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

type DropdownKey = 'shop' | 'learn' | null;

const SHOP_LINKS = [
  { label: 'Bali Gold', href: '#benefits' },
  { label: 'Mint Reset', href: '#benefits' },
  { label: 'Build your ritual', href: '#ritual' },
];

const LEARN_LINKS = [
  { label: 'Origin story', href: '#story' },
  { label: 'Daily ritual', href: '#ritual' },
  { label: 'Quick answers', href: '#faq' },
];

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const shellOpacity = useTransform(scrollY, [0, 100], [0, 0.97]);
  const textProgress = useTransform(scrollY, [0, 100], [0, 1]);

  const shellBackground = useMotionTemplate`rgba(245, 242, 237, ${shellOpacity})`;
  const navMuted = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.82)', 'rgba(26,26,26,0.55)']);
  const navStrong = useTransform(textProgress, [0, 1], ['#FFFFFF', '#1a1a1a']);
  const logoColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#1a1a1a']);
  const buttonBackground = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.14)', '#1a1a1a']);
  const buttonTextColor = useTransform(textProgress, [0, 1], ['#FFFFFF', '#FFFFFF']);
  const buttonBorder = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.5)', '#1a1a1a']);
  const mobileIconBorder = useTransform(textProgress, [0, 1], ['rgba(255,255,255,0.45)', 'rgba(26,26,26,0.22)']);

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (shopRef.current?.contains(t) || learnRef.current?.contains(t)) return;
      setOpenDropdown(null);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const toggleDropdown = (key: Exclude<DropdownKey, null>) => {
    setOpenDropdown((current) => (current === key ? null : key));
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  const DropdownPanel: React.FC<{ links: { label: string; href: string }[] }> = ({ links }) => (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute left-0 top-full z-[60] mt-2 min-w-[14rem] rounded-lg border border-[#1a1a1a] bg-[#FDFCF8] py-2 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={closeAll}
          className="block px-5 py-2.5 font-condensed text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1a1a] transition-colors hover:bg-[#F5F2ED]"
        >
          {link.label}
        </a>
      ))}
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 z-50 w-full"
    >
      <motion.div
        style={{ backgroundColor: shellBackground }}
        className="w-full border-b border-transparent px-4 py-3 backdrop-blur-[2px] md:px-8 md:py-4"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
          <div className="hidden min-w-0 items-center gap-8 md:flex">
            <div className="relative" ref={shopRef}>
              <button
                type="button"
                aria-expanded={openDropdown === 'shop'}
                aria-haspopup="true"
                onClick={() => toggleDropdown('shop')}
                className="inline-flex items-center gap-1.5 font-condensed text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
              >
                <motion.span style={{ color: navStrong }}>Shop</motion.span>
                <motion.span style={{ color: navMuted }} className="text-base leading-none">
                  {openDropdown === 'shop' ? '×' : '+'}
                </motion.span>
              </button>
              <AnimatePresence>
                {openDropdown === 'shop' ? <DropdownPanel links={SHOP_LINKS} /> : null}
              </AnimatePresence>
            </div>

            <div className="relative" ref={learnRef}>
              <button
                type="button"
                aria-expanded={openDropdown === 'learn'}
                aria-haspopup="true"
                onClick={() => toggleDropdown('learn')}
                className="inline-flex items-center gap-1.5 font-condensed text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
              >
                <motion.span style={{ color: navStrong }}>Learn</motion.span>
                <motion.span style={{ color: navMuted }} className="text-base leading-none">
                  {openDropdown === 'learn' ? '×' : '+'}
                </motion.span>
              </button>
              <AnimatePresence>
                {openDropdown === 'learn' ? <DropdownPanel links={LEARN_LINKS} /> : null}
              </AnimatePresence>
            </div>
          </div>

          <a
            href="#hero"
            onClick={closeAll}
            className="justify-self-center font-serif text-xl font-black tracking-tighter md:text-2xl"
          >
            <motion.span style={{ color: logoColor }}>JAMU JIVA</motion.span>
          </a>

          <div className="ml-auto flex items-center gap-2 md:justify-self-end md:gap-4">
            <motion.button
              type="button"
              style={{ borderColor: mobileIconBorder, color: navStrong }}
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
              className="hidden rounded-full border px-5 py-2.5 font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-[#F47C3E] hover:text-white hover:border-[#F47C3E] md:inline-flex md:items-center md:justify-center"
            >
              Join the list
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#2D4F3E]/35 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-[#FDFCF8] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-serif text-lg font-black text-[#1a1a1a]">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a]/15"
                >
                  <X className="h-5 w-5 text-[#1a1a1a]" />
                </button>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/45">
                    Shop
                  </p>
                  <div className="mt-3 space-y-2">
                    {SHOP_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={closeAll}
                        className="block font-condensed text-sm font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-condensed text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a]/45">
                    Learn
                  </p>
                  <div className="mt-3 space-y-2">
                    {LEARN_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={closeAll}
                        className="block font-condensed text-sm font-semibold uppercase tracking-[0.14em] text-[#1a1a1a]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="#waitlist"
                onClick={closeAll}
                className="mt-auto inline-flex w-full items-center justify-center rounded-full bg-[#1a1a1a] py-3.5 font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                Join the list
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
