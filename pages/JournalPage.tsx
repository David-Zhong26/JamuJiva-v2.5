import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../constants/journal';
import journalBg from '../materials/journal-bg-red.png';

const cardClass =
  'group relative flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-[#F6F1E8] shadow-[0_16px_40px_rgba(48,16,4,0.16)]';

const JournalPage: React.FC = () => (
  <main className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 md:px-8 md:pb-24 md:pt-36">
    <div className="absolute inset-0">
      <img src={journalBg} alt="" className="h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[#3A1A10]/28" />
    </div>
    <div className="relative z-10 mx-auto max-w-6xl">
      <h1 className="font-serif text-5xl leading-none text-white sm:text-6xl">The Jiva Journal</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
        A journey through roots, rituals, and everything in between. Come along as the story of Jiva unfolds.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6">
        {JOURNAL_ARTICLES.map((article) => (
          <Link key={article.slug} to={`/journal/${article.slug}`} className={cardClass}>
            <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE4D8]">
              <img
                src={article.cover}
                alt={article.coverAlt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                decoding="async"
              />
            </div>
            <div className="flex flex-1 items-end gap-3 px-5 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#8C3F1F]/65">{article.number}</p>
                <h2 className="mt-2 font-serif text-[1.45rem] leading-tight text-[#6F2E1E]">{article.title}</h2>
                <p className="mt-2 text-sm leading-snug text-[#6F2E1E]/75">{article.excerpt}</p>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6F2E1E] text-white transition-transform group-hover:scale-105">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}

        {['02', '03'].map((number) => (
          <article key={number} className={cardClass}>
            <div className="relative flex aspect-[16/10] items-center justify-center bg-[#E7D7C8]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6F2E1E]/70">Coming soon</p>
            </div>
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#8C3F1F]/65">{number}</p>
              <h2 className="mt-2 font-serif text-[1.45rem] leading-tight text-[#6F2E1E]/45">Coming soon</h2>
            </div>
          </article>
        ))}
      </div>
    </div>
  </main>
);

export default JournalPage;
