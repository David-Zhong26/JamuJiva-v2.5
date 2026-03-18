import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import canImage from '../materials/demo jiva removed.png';
import backgroundImage from '../materials/background.jpg';

interface StorefrontLandingProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

type Flavor = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px -10% 0px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const StorefrontLanding: React.FC<StorefrontLandingProps> = ({ email, setEmail, onJoin, joined }) => {
  const flavors: Flavor[] = useMemo(
    () => [
      {
        id: 'ginger-turmeric',
        name: 'Ginger Turmeric',
        description: 'Bright heat + golden balance.',
        tags: ['Focus', 'Digestion', 'Anti-inflammatory'],
      },
      {
        id: 'tamarind',
        name: 'Tamarind',
        description: 'Tangy, warm, quietly addictive.',
        tags: ['Balance', 'Hydration', 'Mood'],
      },
      {
        id: 'roselle-hibiscus',
        name: 'Roselle Hibiscus',
        description: 'Floral tartness with a clean finish.',
        tags: ['Glow', 'Antioxidants', 'Calm'],
      },
      {
        id: 'pandan-coconut',
        name: 'Pandan Coconut',
        description: 'Creamy aromatics, dessert-adjacent.',
        tags: ['Comfort', 'Balance', 'Slow energy'],
      },
      {
        id: 'calamansi',
        name: 'Calamansi',
        description: 'Citrus snap with tropical lift.',
        tags: ['Refresh', 'Vitamin C', 'Focus'],
      },
    ],
    []
  );

  const [votedId, setVotedId] = useState<string | null>(null);

  return (
    <div className="bg-[#F5F2ED] text-[#2D4F3E]">
      {/* Intro / First screen */}
      <section id="intro" className="relative pt-28 md:pt-32 pb-16 md:pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2ED]/85 via-[#F5F2ED]/70 to-[#F5F2ED]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <motion.div className="lg:col-span-7" {...fadeUp}>
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/60 px-4 py-2 rounded-full shadow-sm">
              <span className="font-bold tracking-widest uppercase text-xs text-[#2D4F3E]/80">Jamu Jiva</span>
              <span className="w-1 h-1 rounded-full bg-[#2D4F3E]/30" />
              <span className="text-xs font-semibold text-[#2D4F3E]/60">Indonesian wellness, modernized</span>
            </div>

            <h1 className="mt-8 font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-bold leading-[1.12] tracking-tight text-[#2D4F3E]">
              Ancient Indonesian jamu.
              <br />
              Built for the modern routine.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-[#2D4F3E]/70 max-w-2xl font-medium leading-relaxed">
              Cold-pressed roots and botanicals in a can — clean energy, calmer focus, and daily balance.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center">
              <a
                href="#vote"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#2D4F3E] text-white font-black text-sm tracking-wide hover:bg-[#F47C3E] transition-colors"
              >
                Vote the next flavor
              </a>
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 text-[#2D4F3E] font-black text-sm tracking-wide hover:bg-white transition-colors"
              >
                Join the first drop
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 text-xs font-bold tracking-widest uppercase text-[#2D4F3E]/55">
              <span className="px-3 py-2 rounded-full bg-white/70 border border-white/70">No artificial flavors</span>
              <span className="px-3 py-2 rounded-full bg-white/70 border border-white/70">Root-forward</span>
              <span className="px-3 py-2 rounded-full bg-white/70 border border-white/70">Made to sip daily</span>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-5 flex justify-center lg:justify-end" {...fadeUp}>
            <div className="relative w-full max-w-[420px]">
              <div className="absolute -inset-6 rounded-[2.75rem] bg-[#F9D067]/25 blur-2xl" />
              <div className="relative rounded-[2.25rem] bg-white/65 backdrop-blur-xl border border-white/60 shadow-2xl p-6 md:p-8">
                <img src={canImage} alt="Jamu Jiva Can" className="w-full h-auto object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-3xl" {...fadeUp}>
            <span className="text-[#F47C3E] font-black tracking-widest uppercase text-xs md:text-sm">
              The modern elixir
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
              Clean support, <span className="italic text-[#2D4F3E]/80">daily</span>.
            </h2>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Focus',
                desc: 'A clear, steady lift — designed for deep work, not jitters.',
              },
              {
                title: 'Balance',
                desc: 'Root-forward blends that feel grounding and easy to return to.',
              },
              {
                title: 'Anti-inflammatory support',
                desc: 'Turmeric and botanicals chosen for calm recovery and resilience.',
              },
            ].map((b) => (
              <motion.div
                key={b.title}
                {...fadeUp}
                className="rounded-[2rem] bg-white border border-[#2D4F3E]/10 shadow-sm p-8"
              >
                <h3 className="font-serif text-2xl font-black text-[#2D4F3E]">{b.title}</h3>
                <p className="mt-4 text-[#2D4F3E]/70 font-medium leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flavor voting */}
      <section id="vote" className="py-20 md:py-28 px-6 bg-[#2D4F3E] text-[#F5F2ED]">
        <div className="max-w-7xl mx-auto">
          <motion.div className="max-w-3xl" {...fadeUp}>
            <span className="text-[#E5C76B] font-black tracking-widest uppercase text-xs md:text-sm">
              Vote the next flavor
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
              Help us choose the first drop.
            </h2>
            <p className="mt-5 text-[#F5F2ED]/80 text-lg font-medium leading-relaxed">
              Pick the flavor you want us to produce first — we’ll prioritize the winners for launch.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flavors.map((f) => {
              const selected = votedId === f.id;
              return (
                <motion.div
                  key={f.id}
                  {...fadeUp}
                  className={[
                    'rounded-[2rem] border shadow-sm p-7 transition-colors',
                    selected ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/15 hover:bg-white/10',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-black">{f.name}</h3>
                      <p className="mt-2 text-[#F5F2ED]/75 font-medium">{f.description}</p>
                    </div>
                    {selected ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-[#E5C76B] text-[#2D4F3E]">
                        Voted
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 border border-white/15 text-[#F5F2ED]/85"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setVotedId(f.id)}
                    className={[
                      'mt-6 w-full rounded-full px-5 py-3 font-black text-sm tracking-wide transition-colors',
                      selected
                        ? 'bg-[#E5C76B] text-[#2D4F3E]'
                        : 'bg-white text-[#2D4F3E] hover:bg-[#E5C76B] hover:text-[#2D4F3E]',
                    ].join(' ')}
                  >
                    {selected ? 'Vote recorded' : 'Vote'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Origin / Story */}
      <section id="story" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <motion.div className="lg:col-span-7" {...fadeUp}>
            <span className="text-[#F9D067] font-black tracking-widest uppercase text-xs md:text-sm">
              The origin story
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
              Rooted in <span className="text-[#F47C3E]">tradition</span>.
            </h2>
            <p className="mt-6 text-[#2D4F3E]/70 font-medium text-lg leading-relaxed max-w-2xl">
              Jamu is a centuries-old Indonesian ritual — hand-ground roots, brewed with care. We’re bringing that
              feeling to modern life: intentional, daily, and made to taste as good as it feels.
            </p>
          </motion.div>

          <motion.div className="lg:col-span-5 flex justify-center lg:justify-end" {...fadeUp}>
            <div className="rounded-[2.25rem] bg-white border border-[#2D4F3E]/10 shadow-sm p-6 md:p-8 w-full max-w-[420px]">
              <div className="text-[#2D4F3E]/70 font-medium leading-relaxed">
                <p className="font-serif text-2xl font-black text-[#2D4F3E]">Made with intent.</p>
                <p className="mt-3">
                  Small-batch thinking, clean ingredients, and a brand that feels like a lifestyle — not a stunt.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Email / Waitlist */}
      <section id="waitlist" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-[3rem] md:rounded-[4rem] bg-white border border-[#2D4F3E]/10 shadow-2xl overflow-hidden"
          >
            <div className="p-10 md:p-16 relative">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#F9D067]/35 blur-3xl" />
              <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-[#F47C3E]/20 blur-3xl" />

              <div className="relative">
                <span className="text-[#F47C3E] font-black tracking-widest uppercase text-xs md:text-sm">
                  Get first access
                </span>
                <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
                  Vote, then be the first to sip.
                </h2>
                <p className="mt-5 text-[#2D4F3E]/70 font-medium text-lg leading-relaxed max-w-2xl">
                  We’ll email you the drop details — and prioritize the flavors you voted for.
                </p>

                <div className="mt-10">
                  {!joined ? (
                    <form
                      onSubmit={onJoin}
                      className="flex flex-col sm:flex-row gap-3 max-w-2xl bg-[#F5F2ED] p-2 rounded-full border border-[#2D4F3E]/10"
                    >
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 px-6 py-4 rounded-full bg-transparent focus:outline-none text-[#2D4F3E] font-semibold"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#2D4F3E] text-white font-black hover:bg-[#F47C3E] transition-colors"
                      >
                        Join <Send className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[#2D4F3E] text-white font-black">
                      You’re on the list.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StorefrontLanding;

