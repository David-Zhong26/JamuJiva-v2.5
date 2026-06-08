
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../materials/Jiva (8）.png';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-5 border-t border-[#2D4F3E]/10 md:py-20 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">
        <div className="max-w-xs">
          <Link to="/" className="mb-2 inline-block">
            <img src={logo} alt="Jamu Jiva" className="h-[44px] w-auto" decoding="async" />
          </Link>
          <p className="text-[#2F4F3A]/80 font-medium">
            Rooted in Indonesian Jamu tradition, crafted for modern wellness.
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:gap-x-16 sm:gap-y-10 sm:-translate-x-6">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2D4F3E] mb-6">Shop</h4>
            <ul className="space-y-4 text-[#2F4F3A]/80 font-medium">
              <li><Link to="/shop" className="hover:text-[#F47C3E]">Product</Link></li>
              <li><Link to="/merch" className="hover:text-[#F47C3E]">Merch</Link></li>
            </ul>
          </div>
          <div>
            <Link to="/culture" className="font-serif text-lg font-bold text-[#2D4F3E] mb-6 block hover:text-[#F47C3E] transition-colors">
              About Us
            </Link>
            <ul className="space-y-4 text-[#2F4F3A]/80 font-medium">
              <li><a href="mailto:jamujiva@gmail.com" className="hover:text-[#F47C3E]">Contact</a></li>
              <li><Link to="/journal" className="hover:text-[#F47C3E]">Jiva Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2D4F3E] mb-6">Social</h4>
            <ul className="space-y-4 text-[#2F4F3A]/80 font-medium">
              <li><a href="https://www.instagram.com/jamujiva/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F47C3E]">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/jivalivin/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F47C3E]">LinkedIn</a></li>
              <li><a href="https://www.tiktok.com/@jamu.jiva" target="_blank" rel="noopener noreferrer" className="hover:text-[#F47C3E]">TikTok</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#2D4F3E]/5 flex flex-col md:flex-row justify-between items-center gap-4 md:mt-20 md:pt-10 md:gap-6">
        <p className="text-[#2F4F3A]/50 text-sm font-medium">© 2026 Jiva Drinks LLC. All rights reserved.</p>
        <div className="flex gap-8 text-[#2F4F3A]/50 text-sm font-medium">
          <Link to="/privacy" className="hover:text-[#F47C3E]">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#F47C3E]">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
