import React from 'react';
import jivaLogo from '../materials/Jiva (8）.png';

const JournalPage: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] pt-28 pb-16 px-8">
    <div className="text-center">
      <span className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block">
        Stories &amp; Culture
      </span>
      <h1 className="mb-4 flex flex-wrap items-center justify-center gap-x-3 font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl">
        <span>The</span>
        <img
          src={jivaLogo}
          alt="Jiva"
          className="h-[1.35em] w-auto"
          decoding="async"
        />
        <span>Journal</span>
      </h1>
      <p className="text-[#2D4F3E]/70 text-lg">Coming soon.</p>
    </div>
  </main>
);

export default JournalPage;
