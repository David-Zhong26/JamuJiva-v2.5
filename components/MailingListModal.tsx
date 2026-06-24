import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

interface MailingListModalProps {
  open: boolean;
  onClose: () => void;
}

const fieldClass =
  'w-full rounded-2xl border border-[#2D4F3E]/15 bg-white px-5 py-4 text-[#2D4F3E] outline-none transition-colors placeholder:text-[#2D4F3E]/35 focus:border-[#2D4F3E]';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const MailingListModal: React.FC<MailingListModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setEmail('');
    setFirstName('');
  }, [open]);

  const progress = useMemo(() => {
    if (submitted) return 100;

    const emailDone = isValidEmail(email);
    const firstNameDone = firstName.trim().length > 0;

    if (emailDone && firstNameDone) return 100;
    if (emailDone || firstNameDone) return 50;
    return 0;
  }, [email, firstName, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedEmail = email.trim().toLowerCase();
    const cleanedFirstName = firstName.trim();

    if (!cleanedEmail) {
      alert('Please enter your email.');
      return;
    }

    if (!isValidEmail(cleanedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanedEmail,
          firstName: cleanedFirstName || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    }
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
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#F5F2ED] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
          >
            <div className="absolute left-0 right-0 top-0 h-1 bg-[#2D4F3E]/15">
              <motion.div
                className="h-full bg-[#2D4F3E]"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            <button
              type="button"
              aria-label="Close mailing list modal"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2D4F3E]/70 transition-colors hover:bg-white hover:text-[#2D4F3E]"
            >
              <X className="h-4 w-4" />
            </button>

            {!submitted ? (
              <>
                <h3 className="pr-10 font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                  Join the waitlist
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#2D4F3E]/70">
                  Be the first to hear about launches, restocks, and special releases from Jiva.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#2D4F3E]">
                      Email <span className="text-[#2D4F3E]/50">(required)</span>
                    </span>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={fieldClass}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#2D4F3E]">
                      First name <span className="text-[#2D4F3E]/50">(optional)</span>
                    </span>
                    <input
                      type="text"
                      placeholder="What should we call you?"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className={fieldClass}
                    />
                  </label>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2D4F3E] px-6 py-4 font-black text-white transition-colors hover:bg-[#F47C3E]"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-left">
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#F47C3E]">
                  You&apos;re in
                </span>
                <h3 className="font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                  {firstName.trim() ? `Thanks, ${firstName.trim()}!` : "You're on the list!"}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#2D4F3E]/75">
                  We&apos;ll let you know when the next product drop is ready!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F47C3E] px-8 py-4 font-black text-white transition-colors hover:bg-[#2D4F3E]"
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
