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
  <main className="bg-[#F5E8CA] pt-32 pb-20">
    {/* ——— About Us ——— */}
    <section className="mx-auto max-w-3xl px-6 md:px-12 pb-20">
      <motion.span
        className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        Our Mission
      </motion.span>

      <motion.h1
        className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        About <span className="text-[#F47C3E]">Us.</span>
      </motion.h1>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-lg leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeUp}
      >
        <p>
          On a mission to share and introduce the culture of jamu to a new generation
          seeking natural energy, balance, and better living.
        </p>
        <p>
          Jiva is a modern wellness brand rooted in Indonesian heritage — reimagining
          ancient herbal traditions for today&apos;s fast-paced world. We believe feeling
          good shouldn&apos;t be complicated. It should be daily, intentional, and deeply
          connected to culture.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Section 1: What Is Jamu? ——— */}
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-20">
      <motion.span
        className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        The Tradition
      </motion.span>

      <motion.h2
        className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        What Is <span className="text-[#F47C3E]">Jamu?</span>
      </motion.h2>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-lg leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeUp}
      >
        <p>
          Jamu is a traditional Indonesian herbal drink made from roots, spices,
          fruits, and botanicals. Common ingredients include turmeric, ginger,
          tamarind, and lemongrass. Each recipe can feel slightly different
          because jamu has always been personal. Some blends are bright and
          refreshing. Some are earthy and bold. Others are warm, spicy, and
          grounding.
        </p>
        <p>
          To us, that is what makes jamu special. It is not just one drink. It is
          a culture of care, passed from person to person.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Section 2: Why It Matters ——— */}
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-20">
      <motion.span
        className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        Why It Matters
      </motion.span>

      <motion.h2
        className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        More Than a <span className="text-[#F47C3E]">Drink.</span>
      </motion.h2>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-lg leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeUp}
      >
        <p>
          In Indonesia, jamu is often connected to daily wellness. It can be
          found in homes, markets, small shops, and street-side routines. People
          drink it not only for function, but also because it feels familiar,
          natural, and intentional.
        </p>
        <p>
          Jamu represents a slower kind of wellness. One that does not rely on
          overcomplicated routines or artificial promises. It is simple, earthy,
          and deeply human.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Section 3: Our Interpretation ——— */}
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-20">
      <motion.span
        className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        Our Interpretation
      </motion.span>

      <motion.h2
        className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        How Jamu Jiva <span className="text-[#F47C3E]">Brings It Forward.</span>
      </motion.h2>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-lg leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeUp}
      >
        <p>
          Jamu Jiva is our modern interpretation of this tradition. We keep the
          cultural foundation, but refine the experience for today's lifestyle.
        </p>
        <p>
          That means ready-to-drink bottles, a cleaner design, balanced flavors,
          and a brand experience that feels elevated without losing the soul of
          jamu. We want Jamu Jiva to feel like something you can drink after a
          workout, before class, during work, or as a small daily reset.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Section 4: Brand Philosophy ——— */}
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-20">
      <motion.span
        className="text-[#A76D2A] font-black tracking-widest uppercase text-sm mb-4 block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        Brand Philosophy
      </motion.span>

      <motion.h2
        className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] leading-tight mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        Heritage Meets <span className="text-[#F47C3E]">Modern Ritual.</span>
      </motion.h2>

      <motion.div
        className="space-y-5 text-[#2D4F3E]/85 text-lg leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeUp}
      >
        <p>
          We believe wellness should feel natural, not forced. It should fit into
          your day without becoming another task. Jamu Jiva is built around that
          idea.
        </p>
        <p>
          Every bottle is inspired by Indonesian heritage, but made for people
          living fast, creative, and intentional lives today.
        </p>
      </motion.div>
    </section>

    <hr className="mx-auto max-w-3xl border-[#2D4F3E]/10" />

    {/* ——— Final CTA ——— */}
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-24 text-center">
      <motion.h2
        className="font-serif text-4xl md:text-5xl font-black text-[#2D4F3E] leading-tight mb-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeUp}
      >
        A Ritual Worth <span className="text-[#F47C3E]">Carrying Forward.</span>
      </motion.h2>

      <motion.p
        className="text-[#2D4F3E]/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeUp}
      >
        Jamu has always been about more than ingredients. It is about care,
        rhythm, and connection. With Jamu Jiva, we hope to share that ritual
        with a new generation.
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

export default CulturePage;
