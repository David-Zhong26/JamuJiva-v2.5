import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
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
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const modalY = useMotionValue(0);
  const bounceBackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setEmail('');
    setName('');
  }, [open]);

  useEffect(() => {
    return () => {
      if (bounceBackTimerRef.current !== null) {
        window.clearTimeout(bounceBackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  const progress = useMemo(() => {
    if (submitted) return 100;

    const emailDone = isValidEmail(email);
    const nameDone = name.trim().length > 0;

    if (emailDone && nameDone) return 100;
    if (emailDone || nameDone) return 50;
    return 0;
  }, [email, name, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedEmail = email.trim().toLowerCase();
    const cleanedName = name.trim();

    if (!cleanedEmail) {
      alert('Please enter your email.');
      return;
    }

    if (!isValidEmail(cleanedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!cleanedName) {
      alert('Please enter your name.');
      return;
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanedEmail,
          firstName: cleanedName,
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

  const nudgeModal = (deltaY: number) => {
    const nextY = Math.max(-32, Math.min(32, modalY.get() + deltaY * 0.08));
    modalY.set(nextY);

    if (bounceBackTimerRef.current !== null) {
      window.clearTimeout(bounceBackTimerRef.current);
    }

    bounceBackTimerRef.current = window.setTimeout(() => {
      animate(modalY, 0, {
        type: 'spring',
        stiffness: 280,
        damping: 18,
        mass: 0.7,
      });
    }, 70);
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
          onWheel={(e) => {
            e.preventDefault();
            nudgeModal(e.deltaY);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.28}
            dragSnapToOrigin
            style={{ y: modalY }}
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
                <p className="mx-auto mt-5 max-w-[32rem] text-center text-base font-semibold leading-relaxed text-[#2D4F3E]/70">
                  Join our early members club to be the first to hear about launches, restocks, and
                  special releases from Jiva!
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                  <label className="block">
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                      className={fieldClass}
                    />
                  </label>

                  <label className="block">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
              <div className="flex flex-col items-center py-6 text-center">
                <span className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-[#F47C3E]">
                  You&apos;re in
                </span>
                <h3 className="font-serif text-3xl font-black leading-tight text-[#2D4F3E]">
                  {name.trim() ? `Thanks, ${name.trim()}!` : "You're on the list!"}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#2D4F3E]/75">
                  We&apos;ll let you know when the
                  <br />
                  next product drop is ready!
                </p>
                <div className="mt-5 w-full rounded-2xl bg-[#F9EFD4] px-5 py-4 text-center text-[#2D4F3E]">
                  <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#2D4F3E]/60">
                    Your discount code
                  </span>
                  <p className="mt-2 font-serif text-2xl font-black tracking-[0.08em] text-[#2D4F3E]">
                    JIVADAY1
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#2D4F3E]/75">
                    Use it at checkout for 10% off your order.
                  </p>
                </div>
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
