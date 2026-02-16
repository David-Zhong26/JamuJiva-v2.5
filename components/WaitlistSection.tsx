
import React from 'react';
import { motion } from 'framer-motion';

interface WaitlistProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const WaitlistSection: React.FC<WaitlistProps> = ({ email, setEmail, onJoin, joined }) => {
  return (
    <section id="waitlist" className="py-40 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto bg-[#F47C3E] rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 relative overflow-hidden shadow-2xl text-center text-white"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9D067] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <h2 className="font-serif text-5xl md:text-8xl font-black mb-8 leading-[0.9]">
            BE THE FIRST <br /> TO SIP.
          </h2>
          <p className="text-xl md:text-3xl mb-16 opacity-90 max-w-3xl mx-auto font-medium">
            The first drop happens soon. Only 5,000 cases of our seasonal "Bali Gold" brew will be released.
          </p>

          {!joined ? (
            <form onSubmit={onJoin} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto bg-white p-3 rounded-full shadow-2xl">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-10 py-5 rounded-full border-none focus:outline-none text-[#2D4F3E] font-black text-lg"
              />
              <button 
                type="submit"
                className="bg-[#2D4F3E] text-white px-12 py-5 rounded-full font-black text-xl hover:bg-[#F9D067] hover:text-[#2D4F3E] transition-all"
              >
                SECURE ACCESS
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ y: 20 }} 
              animate={{ y: 0 }}
              className="bg-white text-[#2D4F3E] px-12 py-10 rounded-[3rem] inline-block shadow-2xl"
            >
              <h3 className="text-4xl font-black mb-2">YOU'RE IN.</h3>
              <p className="text-xl opacity-80 font-bold">Check your inbox for a piece of our culture.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default WaitlistSection;
