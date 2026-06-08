import React from 'react';
import jivaLogo from '../materials/Jiva (8）.png';

const JournalPage: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] pt-28 pb-16 px-8">
    <div className="text-center">
      <span className="mb-4 block text-xs font-black uppercase tracking-widest text-[#A76D2A] md:text-sm">
        Stories &amp; Culture
      </span>
      <h1 className="mb-4 flex flex-nowrap items-center justify-center gap-x-2 font-serif text-[clamp(1.85rem,7.25vw,3rem)] font-black text-[#2D4F3E] md:gap-x-3 md:text-5xl">
        <span className="whitespace-nowrap">The</span>
        <img
          src={jivaLogo}
          alt="Jiva"
          className="h-[1.28em] w-auto shrink-0"
          decoding="async"
        />
        <span className="whitespace-nowrap">Journal</span>
      </h1>
      <p className="text-[#2D4F3E]/70 text-lg">Coming soon.</p>
    </div>
  </main>
);

export default JournalPage;
