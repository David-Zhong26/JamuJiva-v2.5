import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const CulturePage: React.FC = () => (
  <main className="bg-[#F5E8CA] pt-24 pb-16 md:pt-32 md:pb-20">
    {/* ——— Mission ——— */}
    <section className="mx-auto max-w-3xl px-5 pb-12 md:px-12 md:pb-20">
      <motion.h1
        className="font-serif text-3xl sm:text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-6 md:mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        Our Mission
      </motion.h1>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-base leading-relaxed md:text-lg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        <p>
          Jiva is built for those who refuse to settle for burnout, brain rot, and running on empty.
          We are sharing the culture of jamu with a new generation seeking natural energy, balance,
          and better living. This is bigger than a beverage. It&apos;s a movement to connect your soul
          to the life you deserve to live.
        </p>
        <p>
          Rooted in Indonesian heritage, Jiva reimagines ancient herbal traditions for today&apos;s
          fast-paced world. We believe feeling good shouldn&apos;t be complicated. It should be daily,
          intentional, and deeply personal.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Why are we different? ——— */}
    <section className="mx-auto max-w-3xl px-5 py-12 md:px-12 md:py-20">
      <motion.h2
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#2D4F3E] leading-tight mb-6 md:mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        Why are we <span className="text-[#F47C3E]">different?</span>
      </motion.h2>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-base leading-relaxed md:text-lg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        <p>
          In a market flooded with supplements that promise everything and explain nothing, Jiva
          stands apart by doing something radical: telling the truth about where it comes from.
        </p>
        <p>
          A healing tradition passed down long before wellness became an industry, every can carries
          centuries of Indonesian wisdom rooted in jamu.
        </p>
        <p>
          But Jiva was never just about the drink. It&apos;s about what the drink represents: a slower
          morning, an intentional pause, the quiet confidence of someone who decided they deserve to
          feel good every single day.
        </p>
        <p>
          Jiva is not just a product, but a lifestyle. One built on balance, ancient knowledge, and
          the belief that vitality isn&apos;t a destination. It&apos;s how you live.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— The Culture Behind Jiva ——— */}
    <section className="mx-auto max-w-3xl px-5 py-12 md:px-12 md:py-20">
      <motion.h2
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#2D4F3E] leading-tight mb-6 md:mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        The Culture Behind <span className="text-[#F47C3E]">Jiva</span>
      </motion.h2>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-base leading-relaxed md:text-lg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        <p>
          Jiva is inspired by jamu, Indonesia&apos;s long-standing herbal wellness tradition made
          with roots, spices, and botanicals. For generations, jamu has been connected to daily
          care, balance, and natural wellness.
        </p>
        <p>
          We created Jiva to honor that cultural foundation while making the experience lighter,
          brighter, and easier to enjoy in a modern routine.
        </p>
        <p>
          We do not claim to represent every version of jamu. Across Indonesia, jamu can vary by
          region, family, ingredient, and purpose. Our approach is inspired by the spirit of jamu:
          natural ingredients, intentional care, and everyday wellness.
        </p>
        <p>
          From there, we build our own recipes with a smoother and more refreshing taste for
          today&apos;s wellness drinkers. Our goal is not to replace traditional jamu, but to
          introduce more people to the culture behind it in a respectful and approachable way.
        </p>
        <p>
          Jiva is rooted in tradition, but made for the way we live today.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Final CTA ——— */}
    <section className="mx-auto max-w-3xl px-5 py-16 text-center md:px-12 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
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

export default CulturePage;
