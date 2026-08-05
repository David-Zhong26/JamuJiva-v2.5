import React from 'react';
import nowPouringBg from '../materials/now-pouring-bg.png';
import jivaCanImg from '../materials/golden_glow_hero_shot.png';
import { useMailingList } from '../contexts/MailingListContext';

const DailyRitualSection: React.FC = () => {
  const { openMailingList } = useMailingList();

  return (
    <section id="ritual" className="relative overflow-hidden bg-[#F6F1E8]">
      <div className="absolute inset-0">
        <img
          src={nowPouringBg}
          alt=""
          className="h-full w-full object-cover object-center grayscale-[20%] brightness-[0.72]"
        />
        <div className="absolute inset-0 bg-[#8A8A8A]/50" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,15,15,0.18)_0%,rgba(15,15,15,0.08)_34%,rgba(15,15,15,0)_70%)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[34rem] max-w-7xl grid-cols-1 items-center gap-4 px-6 py-10 sm:px-8 md:min-h-[44rem] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] md:gap-6 md:px-12 md:py-12 lg:min-h-[48rem]">
        <div className="relative z-20 max-w-sm text-white md:max-w-md md:pb-8">
          <h2 className="font-serif text-[clamp(3rem,7vw,5.4rem)] leading-[0.88] tracking-tight">
            Now
            <br />
            Pouring
            <br />
            Soon...
          </h2>
          <button
            type="button"
            onClick={openMailingList}
            className="mt-8 inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3 font-lato text-sm font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-white/10 md:px-10 md:py-4 md:text-base"
          >
            Be First In line
          </button>
        </div>

        <div className="relative z-10 flex min-h-[22rem] items-end justify-center sm:min-h-[26rem] md:min-h-[40rem] md:justify-start lg:min-h-[44rem]">
          <img
            src={jivaCanImg}
            alt="Jiva Golden Glow can"
            className="pointer-events-none h-[min(62vh,28rem)] w-auto max-w-none object-contain drop-shadow-[0_28px_64px_rgba(0,0,0,0.36)] sm:h-[min(66vh,32rem)] md:absolute md:-bottom-12 md:left-0 md:-translate-x-[28%] md:h-[min(88vh,46rem)] lg:-bottom-16 lg:-translate-x-[34%] lg:h-[min(92vh,52rem)]"
          />
        </div>
      </div>

      <div
        id="waitlist"
        className="relative z-10 flex flex-col items-center justify-center bg-transparent px-5 py-12 sm:px-8 md:py-16"
      >
        <span className="mb-3 text-sm font-black uppercase tracking-widest text-white">
          The First Drop
        </span>
        <h2 className="text-center font-serif text-3xl font-black text-white sm:text-4xl md:text-6xl">
          Join the Jiva Club.
        </h2>
        <p className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-white sm:text-base">
          Early access to new drops, pop-ups, and exclusive offers.
        </p>
        <button
          type="button"
          onClick={openMailingList}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#8C3F1F] px-10 py-4 font-black text-white transition-all hover:bg-[#6F2E1E]"
        >
          Join the Club
        </button>
      </div>
    </section>
  );
};

export default DailyRitualSection;
