
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, ShieldCheck } from 'lucide-react';

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; index: number }> = ({ title, desc, icon, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-[#2D4F3E]/5 border border-[#2D4F3E]/5 hover:-translate-y-2 transition-transform cursor-pointer group"
  >
    <div className="w-16 h-16 bg-[#F5F2ED] rounded-2xl flex items-center justify-center text-[#F47C3E] mb-8 group-hover:bg-[#F47C3E] group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="font-serif text-3xl font-black text-[#2D4F3E] mb-4">{title}</h3>
    <p className="text-[#2D4F3E]/60 font-medium leading-relaxed text-lg">{desc}</p>
  </motion.div>
);

const Features: React.FC = () => {
  return (
    <section id="benefits" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            className="text-[#F47C3E] font-black tracking-widest uppercase text-sm mb-4 block"
          >
            The Modern Elixir
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-black text-[#2D4F3E] leading-tight"
          >
            Centuries of <span className="italic text-[#F9D067]">Wisdom</span> <br /> In Every Sip.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            index={0}
            icon={<Leaf className="w-8 h-8" />} 
            title="Raw Roots" 
            desc="Sourced from family-run farms in Central Java. No extracts, just the earth's purest cold-pressed ginger and turmeric."
          />
          <FeatureCard 
            index={1}
            icon={<Zap className="w-8 h-8" />} 
            title="Clean Burn" 
            desc="A metabolism-igniting blend that provides sustained focus without the jitters of coffee or processed sugars."
          />
          <FeatureCard 
            index={2}
            icon={<ShieldCheck className="w-8 h-8" />} 
            title="Inner Shield" 
            desc="Packed with curcumin and natural anti-inflammatories designed to keep the modern nomad moving effortlessly."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
