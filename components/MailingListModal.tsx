import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { PRODUCT_DRINKS } from '../constants/productDrinks';
import { supabase } from '../supabase';

interface MailingListModalProps {
  open: boolean;
  onClose: () => void;
}

const MailingListModal: React.FC<MailingListModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setEmail('');
    setInterests([]);
  }, [open]);

  const toggleInterest = (productName: string) => {
    setInterests((current) =>
      current.includes(productName)
        ? current.filter((name) => name !== productName)
        : [...current, productName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      alert('Please enter your email.');
      return;
    }

    if (interests.length === 0) {
      alert('Please select at least one product.');
      return;
    }

    const flavorMap: Record<string, string> = {
      'Golden Glow': 'golden_glow',
      'On The Go': 'on_the_go',
    };

    const mappedFlavors = interests.map(
      (name) => flavorMap[name] || name.toLowerCase().replace(/\s+/g, '_')
    );

    const { error } = await supabase.from('subscribers').insert([
      {
        email: cleanedEmail,
        flavors: mappedFlavors,
      },
    ]);

    if (error) {
      if (error.message.toLowerCase().includes('duplicate')) {
        alert('This email is already on the list.');
      } else {
        alert(error.message);
      }
      return;
    }

    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2D4F3E]/45 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-[2rem] bg-[#F5F2ED] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
          >
            <button
              type="button"
              aria-label="Close mailing list modal"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2D4F3E]/10 bg-white text-[#2D4F3E] transition-colors hover:bg-[#F9D067]"
            >
              <X className="h-4 w-4" />
            </button>

            {!submitted ? (
              <>
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#F47C3E]">
                  Join The Mailing List
                </span>
                <h3 className="font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                  Be the first to hear about the next drop.
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#2D4F3E]/75">
                  Enter your email and we&apos;ll keep you posted on launches, restocks, and special releases.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-full border border-[#2D4F3E]/15 bg-white px-6 py-4 text-[#2D4F3E] outline-none transition-colors placeholder:text-[#2D4F3E]/40 focus:border-[#2D4F3E]"
                  />
                  <div className="rounded-[1.5rem] border border-[#2D4F3E]/10 bg-white/70 p-5">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2D4F3E]">
                      Which products are you interested in?
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#2D4F3E]/65">
                      Select what you&apos;d like to hear about so we can send exclusive deals when we manufacture it.
                    </p>
                    <div className="mt-4 space-y-3">
                      {PRODUCT_DRINKS.map((drink) => {
                        const isChecked = interests.includes(drink.name);
                        return (
                          <label
                            key={drink.name}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                              isChecked
                                ? 'border-[#2D4F3E] bg-[#F9D067]/35'
                                : 'border-[#2D4F3E]/10 bg-white hover:border-[#2D4F3E]/25'
                            }`}
                          >
                            <div>
                              <span className="block font-black text-[#2D4F3E]">{drink.name}</span>
                              <span className="block text-sm text-[#2D4F3E]/65">{drink.eyebrow}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleInterest(drink.name)}
                              className="h-5 w-5 rounded border-[#2D4F3E]/30 text-[#2D4F3E] focus:ring-[#2D4F3E]"
                            />
                          </label>
                        );
                      })}
                    </div>
                    {interests.length === 0 ? (
                      <p className="mt-3 text-xs font-medium text-[#F47C3E]">Select at least one product.</p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-full bg-[#2D4F3E] px-6 py-4 font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#F47C3E]"
                  >
                    Confirm Signup
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center">
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#F47C3E]">
                  You&apos;re In
                </span>
                <h3 className="font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                  Congratulations, you&apos;re on the list.
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#2D4F3E]/75">
                  We&apos;ll let you know when the next product drop is ready.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#2D4F3E]/70">
                  Interested in: <span className="font-black text-[#2D4F3E]">{interests.join(', ')}</span>
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F47C3E] px-8 py-4 font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#2D4F3E]"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MailingListModal;
