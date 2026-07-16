
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../materials/Jiva (8）.png';

const Dot: React.FC = () => (
  <span className="text-[#2F4F3A]/40" aria-hidden>
    ·
  </span>
);

const linkClass = 'text-base font-medium text-[#2F4F3A]/80 hover:text-[#F47C3E] md:text-base';
const headingClass = 'mb-4 font-serif text-lg font-bold text-[#2D4F3E] md:text-lg';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#2D4F3E]/10 px-5 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="md:flex md:items-start md:justify-between md:gap-12">
          <div className="max-w-xs md:translate-x-6 md:pl-0">
            <Link to="/" className="mb-2 inline-block pl-4 md:pl-0">
              <img src={logo} alt="Jiva" className="h-[44px] w-auto" decoding="async" />
            </Link>
            <p className="pl-7 text-lg font-medium text-[#2F4F3A]/80 md:pl-2">
              Rooted in Indonesian Jamu tradition, crafted for modern wellness.
            </p>
          </div>

          <div className="mt-8 w-full md:mt-0 md:w-auto md:-translate-x-10">
            <div className="grid grid-cols-2 gap-x-8 md:flex md:gap-x-16">
              <div className="pl-8 md:pl-0">
                <h4 className={headingClass}>Shop</h4>
                <ul className="space-y-4">
                  <li>
                    <Link to="/shop" className={linkClass}>
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link to="/merch" className={linkClass}>
                      Merch
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <Link to="/culture" className={`${headingClass} block transition-colors hover:text-[#F47C3E]`}>
                  About Us
                </Link>
                <ul className="space-y-4">
                  <li>
                    <a href="mailto:info@jivalivin.com" className={linkClass}>
                      Contact
                    </a>
                  </li>
                  <li>
                    <Link to="/faq" className={linkClass}>
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/journal" className={linkClass}>
                      Jiva Journal
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="hidden md:block">
                <h4 className={headingClass}>Social</h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="https://www.instagram.com/jamujiva/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/jivalivin/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.tiktok.com/@jamu.jiva"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      TikTok
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pl-8 md:hidden md:pl-0">
              <h4 className={headingClass}>Social</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://www.instagram.com/jamujiva/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/jivalivin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@jamu.jiva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2D4F3E]/5 pt-8 md:mt-20 md:pt-10">
          <p className="pl-6 text-sm font-medium text-[#2F4F3A]/50 md:hidden md:pl-0">© 2026 Jiva Drinks LLC.</p>
          <div className="mt-2 pl-6 md:mt-0 md:pl-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-[#2F4F3A]/50 md:hidden">
              <Link to="/privacy" className="hover:text-[#F47C3E]">
                Privacy Policy
              </Link>
              <Dot />
              <Link to="/terms" className="hover:text-[#F47C3E]">
                Terms of Use
              </Link>
            </div>
            <div className="hidden items-center gap-4 text-sm font-medium text-[#2F4F3A]/50 md:flex">
              <p>© 2026 Jiva Drinks LLC. All rights reserved.</p>
              <Dot />
              <Link to="/privacy" className="hover:text-[#F47C3E]">
                Privacy Policy
              </Link>
              <Dot />
              <Link to="/terms" className="hover:text-[#F47C3E]">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
