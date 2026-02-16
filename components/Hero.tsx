
import React from 'react';

interface HeroProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const Hero: React.FC<HeroProps> = ({ email, setEmail, onJoin, joined }) => {
  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left z-10">
          <span className="inline-block bg-[#F9D067] text-[#2D4F3E] px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-6">
            ESTABLISHED IN TRADITION
          </span>
          <h1 className="font-serif text-6xl md:text-8xl font-black text-[#2D4F3E] leading-[0.9] mb-8">
            DRINK THE <br />
            <span className="text-[#F47C3E]">LIFE YOU</span> <br />
            DESERVE
          </h1>
          <p className="text-xl text-[#2D4F3E]/70 max-w-xl mb-10 mx-auto lg:mx-0 font-medium">
            Ancient Indonesian wellness, reimagined for the modern routine. Experience vitality that’s centuries in the making.
          </p>

          {!joined ? (
            <form onSubmit={onJoin} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto lg:mx-0">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-full border-2 border-[#2D4F3E]/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-[#2D4F3E] transition-colors font-medium text-[#2D4F3E]"
              />
              <button 
                type="submit"
                className="bg-[#2D4F3E] text-white px-8 py-4 rounded-full font-black text-lg hover:bg-[#F47C3E] transition-all shadow-xl shadow-[#2D4F3E]/10"
              >
                JOIN THE WAITLIST
              </button>
            </form>
          ) : (
            <div className="bg-[#2D4F3E] text-white px-8 py-6 rounded-3xl inline-block shadow-2xl">
              <h3 className="text-2xl font-black mb-1">YOU'RE ON THE LIST!</h3>
              <p className="opacity-80">We'll let you know when the first drop is ready.</p>
            </div>
          )}
          
          <p className="mt-4 text-sm text-[#2D4F3E]/50 italic">Join 2,400+ others exploring a new daily ritual.</p>
        </div>

        {/* Right Visuals */}
        <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
          {/* Retro Background Graphic */}
          <div className="absolute inset-0 bg-[#F9D067] rounded-[4rem] rotate-3 -z-10 shadow-2xl"></div>
          <div className="absolute inset-0 bg-[#F47C3E] rounded-[4rem] -rotate-3 -z-20 opacity-30 translate-x-4"></div>
          
          <div className="relative w-[280px] md:w-[350px] floating">
             {/* Mockup Placeholder */}
            <img 
              src="https://picsum.photos/seed/jamujiva/800/1200" 
              alt="Jamu Jiva Drink Can" 
              className="rounded-3xl shadow-2xl border-8 border-white object-cover aspect-[2/3]"
            />
            {/* Vitality Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-xl transform rotate-12">
               <div className="w-16 h-16 rounded-full bg-[#F47C3E] flex items-center justify-center text-white font-black text-center leading-tight text-xs p-1">
                 100% VITALITY
               </div>
            </div>
          </div>

          {/* Additional Figures in Background */}
          <div className="absolute top-10 right-0 w-24 h-24 bg-[#2D4F3E] rounded-full opacity-10 animate-bounce"></div>
          <div className="absolute bottom-20 left-0 w-32 h-32 bg-[#F47C3E] rounded-full opacity-10"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
