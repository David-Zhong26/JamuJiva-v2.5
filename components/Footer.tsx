
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../materials/jamu jiva logo1.png';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-5 border-t border-[#2D4F3E]/10 md:py-20 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">
        <div className="max-w-xs">
          <Link to="/" className="mb-4 inline-block">
            <img src={logo} alt="Jamu Jiva" className="h-[88px] w-auto" decoding="async" />
          </Link>
          <p className="text-[#2D4F3E]/60 font-medium">
            Bringing the beauty and medicinal properties of Indonesian Jamu to a global scale. Food is medicine.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2D4F3E] mb-6">Shop</h4>
            <ul className="space-y-4 text-[#2D4F3E]/60 font-medium">
              <li><Link to="/shop" className="hover:text-[#F47C3E]">Product</Link></li>
              <li><Link to="/merch" className="hover:text-[#F47C3E]">Merch</Link></li>
            </ul>
          </div>
          <div>
            <Link to="/culture" className="font-serif text-lg font-bold text-[#2D4F3E] mb-6 block hover:text-[#F47C3E] transition-colors">
              About Us
            </Link>
            <ul className="space-y-4 text-[#2D4F3E]/60 font-medium">
              <li><Link to="/ritual" className="hover:text-[#F47C3E]">Days Ritual</Link></li>
              <li><Link to="/journal" className="hover:text-[#F47C3E]">Jiva Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2D4F3E] mb-6">Social</h4>
            <ul className="space-y-4 text-[#2D4F3E]/60 font-medium">
              <li><a href="https://www.instagram.com/jamujiva/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F47C3E]">Instagram</a></li>
              <li><a href="mailto:jamujiva@gmail.com" className="hover:text-[#F47C3E]">Email</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#2D4F3E]/5 flex flex-col md:flex-row justify-between items-center gap-4 md:mt-20 md:pt-10 md:gap-6">
        <p className="text-[#2D4F3E]/40 text-sm font-medium">© 2026 JAMU JIVA CO. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 text-[#2D4F3E]/40 text-sm font-medium">
          <Link to="/privacy" className="hover:text-[#2D4F3E]">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#2D4F3E]">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
