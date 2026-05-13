import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Culture', 'Ingredients', 'Rituals', 'Recipes', 'Wellness'] as const;
type Category = (typeof CATEGORIES)[number];

interface Article {
  category: string;
  title: string;
  description: string;
  readTime: string;
  slug: string;
  image?: string;
}

const FEATURED: Article = {
  category: 'Culture',
  title: 'What Is Jamu? The Indonesian Wellness Ritual Behind Jamu Jiva',
  description:
    'Jamu is more than an herbal drink. It is a daily ritual rooted in Indonesian culture, made with roots, spices, fruits, and botanicals passed down through generations.',
  readTime: '6 min read',
  slug: 'what-is-jamu',
};

const LATEST: Article[] = [
  {
    category: 'Ingredients',
    title: 'Why Turmeric Has Been Used in Jamu for Generations',
    description: '',
    readTime: '4 min read',
    slug: 'turmeric-in-jamu',
  },
  {
    category: 'Rituals',
    title: 'How to Turn a Wellness Shot Into a Daily Ritual',
    description: '',
    readTime: '3 min read',
    slug: 'wellness-shot-ritual',
  },
  {
    category: 'Culture',
    title: 'From Indonesian Markets to Modern Wellness Fridges',
    description: '',
    readTime: '5 min read',
    slug: 'indonesian-markets',
  },
  {
    category: 'Recipes',
    title: '3 Ways to Pair Jamu With Your Morning Routine',
    description: '',
    readTime: '4 min read',
    slug: 'pair-jamu-morning',
  },
];

const GRID_ARTICLES: Article[] = [
  {
    category: 'Culture',
    title: 'The Roots of Jamu',
    description:
      'A short introduction to how jamu became part of everyday wellness in Indonesia.',
    readTime: '5 min read',
    slug: 'roots-of-jamu',
  },
  {
    category: 'Ingredients',
    title: 'Ginger, Turmeric, Tamarind: The Core of Jamu Flavor',
    description:
      'A simple guide to the ingredients that give jamu its earthy, spicy, and refreshing taste.',
    readTime: '4 min read',
    slug: 'core-jamu-flavor',
  },
  {
    category: 'Rituals',
    title: 'Why Daily Wellness Works Better When It Feels Simple',
    description:
      'Jamu Jiva is designed as a small daily reset, not another complicated wellness routine.',
    readTime: '3 min read',
    slug: 'daily-wellness-simple',
  },
  {
    category: 'Wellness',
    title: 'What Makes a Functional Beverage Feel Natural?',
    description:
      'A look at how modern consumers are moving toward cleaner, more intentional drinks.',
    readTime: '4 min read',
    slug: 'functional-beverage-natural',
  },
  {
    category: 'Recipes',
    title: 'How to Drink Jamu: Chilled, Poured, or Paired',
    description:
      'Simple serving ideas for breakfast, post-workout, or an afternoon reset.',
    readTime: '3 min read',
    slug: 'how-to-drink-jamu',
  },
  {
    category: 'Founder Notes',
    title: 'Why We Started Jamu Jiva',
    description:
      'The story behind bringing Indonesian herbal wellness into a modern ready-to-drink format.',
    readTime: '5 min read',
    slug: 'why-we-started',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const CategoryPill: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({
  label,
  active,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
      active
        ? 'border-[#2D4F3E] bg-[#2D4F3E] text-[#F5E8CA]'
        : 'border-[#2D4F3E]/20 bg-transparent text-[#2D4F3E] hover:border-[#2D4F3E]/50'
    }`}
  >
    {label}
  </button>
);

const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => (
  <motion.div
    className="group flex flex-col overflow-hidden rounded-2xl border border-[#2D4F3E]/10 bg-white transition-shadow hover:shadow-lg"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={index}
    variants={fadeUp}
  >
    <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#E7D6B0] to-[#d4c49a]" />
    <div className="flex flex-1 flex-col p-6">
      <span className="mb-2 inline-block w-fit rounded-full border border-[#2D4F3E]/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#2D4F3E]/70">
        {article.category}
      </span>
      <h3 className="font-serif text-lg font-bold text-[#2D4F3E] leading-snug group-hover:text-[#F47C3E] transition-colors">
        {article.title}
      </h3>
      {article.description && (
        <p className="mt-2 text-sm text-[#2D4F3E]/65 leading-relaxed">{article.description}</p>
      )}
      <span className="mt-auto pt-4 text-xs font-medium text-[#2D4F3E]/45">{article.readTime}</span>
    </div>
  </motion.div>
);

const JournalPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredGrid =
    activeCategory === 'All'
      ? GRID_ARTICLES
      : GRID_ARTICLES.filter(
          (a) => a.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <main className="bg-[#F5E8CA] pt-36 pb-24">
      {/* ——— Hero ——— */}
      <section className="mx-auto max-w-5xl px-6 md:px-12 pb-16 text-center">
        <motion.span
          className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
        >
          Stories &amp; Culture
        </motion.span>
        <motion.h1
          className="font-serif text-5xl md:text-7xl font-black text-[#2D4F3E] leading-tight mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeUp}
        >
          The Jiva <span className="text-[#F47C3E]">Journal</span>
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-[#2D4F3E]/75 text-lg md:text-xl leading-relaxed mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={fadeUp}
        >
          Learn the culture, ingredients, and rituals behind jamu. From Indonesian heritage to
          modern daily wellness.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          variants={fadeUp}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </motion.div>
      </section>

      <hr className="mx-auto max-w-5xl border-[#2D4F3E]/10" />

      {/* ——— Featured + Latest ——— */}
      <section className="mx-auto max-w-5xl px-6 md:px-12 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* Featured (left) */}
          <motion.div
            className="group flex flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#d4c49a] to-[#c4a66e]" />
            <div className="mt-6">
              <span className="mb-2 inline-block rounded-full border border-[#2D4F3E]/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#2D4F3E]/70">
                {FEATURED.category} &middot; {FEATURED.readTime}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#2D4F3E] leading-snug group-hover:text-[#F47C3E] transition-colors">
                {FEATURED.title}
              </h2>
              <p className="mt-3 text-[#2D4F3E]/70 leading-relaxed">{FEATURED.description}</p>
              <span className="mt-5 inline-block font-bold text-xs uppercase tracking-widest text-[#F47C3E] group-hover:underline">
                Read Story &rarr;
              </span>
            </div>
          </motion.div>

          {/* Latest stories (right) */}
          <div className="flex flex-col">
            <h3 className="mb-6 font-serif text-2xl font-black text-[#2D4F3E]">Latest Stories</h3>
            <div className="flex flex-col divide-y divide-[#2D4F3E]/10">
              {LATEST.map((article, i) => (
                <motion.div
                  key={article.slug}
                  className="group flex flex-col gap-1 py-5 first:pt-0 last:pb-0 cursor-pointer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[#2D4F3E]/15 px-3 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-[#2D4F3E]/65">
                      {article.category}
                    </span>
                    <span className="text-[0.65rem] text-[#2D4F3E]/40 font-medium">
                      {article.readTime}
                    </span>
                  </div>
                  <h4 className="font-serif text-base md:text-lg font-bold text-[#2D4F3E] leading-snug group-hover:text-[#F47C3E] transition-colors">
                    {article.title}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto max-w-5xl border-[#2D4F3E]/10" />

      {/* ——— Article Grid ——— */}
      <section className="mx-auto max-w-5xl px-6 md:px-12 py-16">
        {filteredGrid.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrid.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#2D4F3E]/50 py-20 text-lg">
            No articles in this category yet. Check back soon.
          </p>
        )}
      </section>

      {/* ——— Bottom CTA ——— */}
      <section className="mx-auto max-w-3xl px-6 md:px-12 pt-8 pb-8 text-center">
        <motion.h2
          className="font-serif text-3xl md:text-4xl font-black text-[#2D4F3E] leading-tight mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
        >
          Want to stay in the loop?
        </motion.h2>
        <motion.p
          className="text-[#2D4F3E]/70 text-lg mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeUp}
        >
          New stories, rituals, and recipes dropped regularly.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={fadeUp}
        >
          <Link
            to="/shop"
            className="inline-block rounded-full bg-[#2D4F3E] px-10 py-4 font-black uppercase tracking-widest text-sm text-[#F5E8CA] transition-all hover:bg-[#1a3328]"
          >
            Try Jamu Jiva
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default JournalPage;
