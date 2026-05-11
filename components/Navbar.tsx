
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type MenuKey = 'shop' | 'learn' | null;

const SHOP_LINKS = [
  { label: 'Flavors', href: '#benefits' },
  { label: 'First drop', href: '#waitlist' },
];

const LEARN_LINKS = [
  { label: 'Culture', href: '#story' },
  { label: 'Daily ritual', href: '#ritual' },
  { label: 'FAQ', href: '#faq' },
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

  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const menusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = menusRef.current;
      if (!el || !openMenu) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [openMenu]);

  const toggle = (key: Exclude<MenuKey, null>) => {
    setOpenMenu((cur) => (cur === key ? null : key));
  };

  const closeAndNavigate = () => setOpenMenu(null);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 z-50 w-full"
    >
      <motion.div
        style={{
          backgroundColor: shellBackground,
        }}
        className="w-full px-6 md:px-10 py-4 transition-colors"
      >
        <div className="flex items-center justify-between gap-4 md:gap-6">
          <a href="#hero" className="min-w-0 shrink">
            <motion.span
              style={{ color: navTextColor }}
              className="font-serif text-xl font-black tracking-tighter md:text-2xl"
            >
              JAMU JIVA
            </motion.span>
          </a>

          <div ref={menusRef} className="ml-auto flex items-center gap-3 md:gap-5">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="relative">
                <motion.button
                  type="button"
                  aria-expanded={openMenu === 'shop'}
                  aria-haspopup="true"
                  onClick={() => toggle('shop')}
                  style={{ color: navTextColor }}
                  className="font-condensed flex items-center gap-0.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] hover:text-[#F47C3E] md:text-xs"
                >
                  Shop
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openMenu === 'shop' ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </motion.button>
                <AnimatePresence>
                  {openMenu === 'shop' ? (
                    <motion.div
                      key="shop-dd"
                      role="menu"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="font-condensed absolute left-0 top-full z-[60] mt-2 min-w-[11rem] rounded-xl border border-[#2D4F3E]/12 bg-white py-2 text-[#2D4F3E] shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                    >
                      {SHOP_LINKS.map((link) => (
                        <a
                          key={link.href}
                          role="menuitem"
                          href={link.href}
                          onClick={closeAndNavigate}
                          className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5F2ED]"
                        >
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="relative">
                <motion.button
                  type="button"
                  aria-expanded={openMenu === 'learn'}
                  aria-haspopup="true"
                  onClick={() => toggle('learn')}
                  style={{ color: navTextColor }}
                  className="font-condensed flex items-center gap-0.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] hover:text-[#F47C3E] md:text-xs"
                >
                  Learn
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openMenu === 'learn' ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </motion.button>
                <AnimatePresence>
                  {openMenu === 'learn' ? (
                    <motion.div
                      key="learn-dd"
                      role="menu"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="font-condensed absolute right-0 top-full z-[60] mt-2 min-w-[11rem] rounded-xl border border-[#2D4F3E]/12 bg-white py-2 text-[#2D4F3E] shadow-[0_16px_48px_rgba(0,0,0,0.12)] md:left-0 md:right-auto"
                    >
                      {LEARN_LINKS.map((link) => (
                        <a
                          key={link.href}
                          role="menuitem"
                          href={link.href}
                          onClick={closeAndNavigate}
                          className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#F5F2ED]"
                        >
                          {link.label}
                        </a>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <motion.a
              href="#waitlist"
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
                borderColor: buttonBorder,
              }}
              className="shrink-0 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#F47C3E] sm:px-6 sm:py-2.5 sm:text-xs"
            >
              Join the list
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
