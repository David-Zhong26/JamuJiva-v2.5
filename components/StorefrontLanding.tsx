import React from 'react';
import { Send } from 'lucide-react';
import canImage from '../materials/demo jiva removed.png';
import heroBg from '../materials/background.jpg';

interface StorefrontLandingProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const StorefrontLanding: React.FC<StorefrontLandingProps> = ({ email, setEmail, onJoin, joined }) => {
  return (
    <div className="bg-[#F5F2ED] text-[#2D4F3E]">
      {/* Top section (static) */}
      <section id="top" className="relative pt-28 md:pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-[#F5F2ED]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-3 bg-white/75 backdrop-blur-xl border border-white/60 px-4 py-2 rounded-full shadow-sm">
              <span className="font-bold tracking-widest uppercase text-xs text-[#2D4F3E]/80">Jamu Jiva</span>
              <span className="w-1 h-1 rounded-full bg-[#2D4F3E]/25" />
              <span className="text-xs font-semibold text-[#2D4F3E]/60">Modern Indonesian wellness</span>
            </div>

            <h1 className="mt-8 font-serif text-[clamp(2rem,4.5vw,3.6rem)] font-bold leading-[1.12] tracking-tight text-white">
              Root-powered refreshment.
              <br />
              Made to sip daily.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/80 max-w-xl font-medium leading-relaxed">
              Cold-pressed roots and botanicals in a can — cleaner energy, calmer focus, and balance you can feel.
            </p>

            <div className="mt-10 flex items-center gap-4 text-white/85 font-bold tracking-widest text-xs uppercase">
              <span className="w-10 h-px bg-white/50" />
              Shop
              <a
                href="#benefits"
                className="pointer-events-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/15 border border-white/25 text-white/95 font-black text-[10px] tracking-widest uppercase hover:bg-white/20 transition-colors"
              >
                SHOP
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            {/* No motion transforms; static hero can */}
            <div className="relative w-full max-w-[520px]">
              <div className="absolute -inset-8 rounded-[3rem] bg-[#F9D067]/15 blur-3xl" />
              <div className="relative rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 md:p-10">
                <img src={canImage} alt="Jamu Jiva Can" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits (static, with image block) */}
      <section id="benefits" className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <span className="text-[#F47C3E] font-black tracking-widest uppercase text-xs md:text-sm">
              The Modern Elixir
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
              Centuries of <span className="italic text-[#2D4F3E]/80">wisdom</span>, in every sip.
            </h2>
            <div className="mt-10 grid md:grid-cols-3 gap-5">
              {[
                { title: 'Focus', desc: 'Steady lift designed for deep work — not jitters.' },
                { title: 'Balance', desc: 'Root-forward blends that feel grounding and repeatable.' },
                { title: 'Support', desc: 'Turmeric and botanicals chosen for calm resilience.' },
              ].map((b) => (
                <div key={b.title} className="rounded-[1.75rem] bg-white border border-[#2D4F3E]/10 shadow-sm p-7">
                  <h3 className="font-serif text-2xl font-black">{b.title}</h3>
                  <p className="mt-3 text-[#2D4F3E]/70 font-medium leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[2.25rem] overflow-hidden border border-[#2D4F3E]/10 bg-white shadow-sm">
              <img src={heroBg} alt="" className="w-full h-[320px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Story (short, static, with can) */}
      <section id="story" className="py-20 md:py-24 px-6 bg-[#2D4F3E] text-[#F5F2ED]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="text-[#E5C76B] font-black tracking-widest uppercase text-xs md:text-sm">
              The Origin Story
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
              Rooted in <span className="text-[#F47C3E]">tradition</span>.
            </h2>
            <p className="mt-6 text-[#F5F2ED]/80 font-medium text-lg leading-relaxed max-w-2xl">
              Jamu is a centuries-old Indonesian ritual — hand-ground roots, brewed with care. We’re bringing that
              feeling to modern life: intentional, daily, and made to taste as good as it feels.
            </p>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="rounded-[2.5rem] bg-white/5 border border-white/15 p-6 md:p-8 shadow-2xl">
              <img src={canImage} alt="Jamu Jiva Can" className="w-[280px] md:w-[340px] h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist (bottom only) */}
      <section id="waitlist" className="py-20 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[3rem] md:rounded-[4rem] bg-white border border-[#2D4F3E]/10 shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16 relative">
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#F9D067]/30 blur-3xl" />
              <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-[#F47C3E]/20 blur-3xl" />

              <div className="relative grid lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7">
                  <span className="text-[#F47C3E] font-black tracking-widest uppercase text-xs md:text-sm">
                    Join the first drop
                  </span>
                  <h2 className="mt-4 font-serif text-4xl md:text-6xl font-black leading-tight">
                    Be the first to sip.
                  </h2>
                  <p className="mt-5 text-[#2D4F3E]/70 font-medium text-lg leading-relaxed max-w-2xl">
                    Get early access and drop details in your inbox.
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

                <div className="lg:col-span-5">
                  <div className="rounded-[2.25rem] overflow-hidden border border-[#2D4F3E]/10 bg-white shadow-sm">
                    <img src={heroBg} alt="" className="w-full h-[320px] object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StorefrontLanding;

