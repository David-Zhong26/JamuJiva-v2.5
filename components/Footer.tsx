
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 px-6 border-t border-[#2D4F3E]/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <span className="font-serif text-3xl font-black text-[#2D4F3E] tracking-tighter block mb-4">JAMU JIVA</span>
          <p className="text-[#2D4F3E]/60 font-medium">
            Bringing the beauty and medicinal properties of Indonesian Jamu to a global scale. Food is medicine.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div>
            <h4 className="font-bold text-[#2D4F3E] mb-6 uppercase tracking-widest text-sm">Product</h4>
            <ul className="space-y-4 text-[#2D4F3E]/60 font-medium">
              <li><a href="#" className="hover:text-[#F47C3E]">Fresh Cans</a></li>
              <li><a href="#" className="hover:text-[#F47C3E]">Powders</a></li>
              <li><a href="#" className="hover:text-[#F47C3E]">Merch</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#2D4F3E] mb-6 uppercase tracking-widest text-sm">Culture</h4>
            <ul className="space-y-4 text-[#2D4F3E]/60 font-medium">
              <li><a href="#" className="hover:text-[#F47C3E]">The Mbok Story</a></li>
              <li><a href="#" className="hover:text-[#F47C3E]">Heritage</a></li>
              <li><a href="#" className="hover:text-[#F47C3E]">Wellness</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#2D4F3E] mb-6 uppercase tracking-widest text-sm">Social</h4>
            <ul className="space-y-4 text-[#2D4F3E]/60 font-medium">
              <li><a href="#" className="hover:text-[#F47C3E]">Instagram</a></li>
              <li><a href="#" className="hover:text-[#F47C3E]">TikTok</a></li>
              <li><a href="#" className="hover:text-[#F47C3E]">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-[#2D4F3E]/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[#2D4F3E]/40 text-sm font-medium">© 2024 JAMU JIVA CO. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 text-[#2D4F3E]/40 text-sm font-medium">
          <a href="#" className="hover:text-[#2D4F3E]">Privacy Policy</a>
          <a href="#" className="hover:text-[#2D4F3E]">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
