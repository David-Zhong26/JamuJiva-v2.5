import React from 'react';
import { useMailingList } from '../contexts/MailingListContext';

const ShopPage: React.FC = () => {
  const { openMailingList } = useMailingList();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] px-8 pb-16 pt-28">
      <div className="text-center">
        <h1 className="mb-4 font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl">
          Shop All
        </h1>
        <p className="mb-8 text-lg text-[#2D4F3E]/70">Coming soon.</p>
        <button
          type="button"
          onClick={openMailingList}
          className="inline-flex items-center justify-center rounded-full bg-[#2D4F3E] px-10 py-4 font-black uppercase tracking-widest text-white transition-all hover:bg-[#F47C3E]"
        >
          Join the waitlist
        </button>
      </div>
    </main>
  );
};

export default ShopPage;
