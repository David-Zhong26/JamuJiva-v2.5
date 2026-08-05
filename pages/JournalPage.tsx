import React from 'react';
import whiteLogo from '../materials/white jiva logo.png';
import journalBg from '../materials/journal-bg-red.png';

const JournalPage: React.FC = () => (
  <main className="relative flex jj-min-screen items-center justify-center overflow-hidden px-8 pb-16 pt-28">
    <div className="absolute inset-0">
      <img
        src={journalBg}
        alt=""
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#3A1A10]/28" />
    </div>

    <div className="relative z-10 text-center">
      <h1 className="mb-4 flex flex-nowrap items-center justify-center gap-x-2 font-serif text-[clamp(1.85rem,7.25vw,3rem)] font-black text-white md:gap-x-3 md:text-5xl">
        <span className="whitespace-nowrap">The</span>
        <img
          src={whiteLogo}
          alt="Jiva"
          className="h-[1.28em] w-auto shrink-0"
          decoding="async"
        />
        <span className="whitespace-nowrap">Journal</span>
      </h1>
      <p className="text-lg text-white">Coming soon.</p>
    </div>
  </main>
);

export default JournalPage;
