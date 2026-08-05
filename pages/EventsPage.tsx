import React from 'react';
import background4Img from '../materials/background 4.png';

/** Public events listing is on hold — same treatment as Merch. */
const EventsPage: React.FC = () => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={background4Img}
        alt=""
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#1A0C08]/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_55%)]" />
    </div>
    <div className="relative z-10 px-6 pb-16 pt-28 text-center">
      <h1 className="font-serif text-5xl leading-none text-white sm:text-6xl md:text-[4.25rem]">
        Events
      </h1>
      <p className="mt-4 text-base text-white/90 sm:text-lg">Coming soon.</p>
    </div>
  </main>
);

export default EventsPage;
