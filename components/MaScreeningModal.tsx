import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMailingList } from '../contexts/MailingListContext';
import { useShopAccess } from '../contexts/ShopAccessContext';

type MaScreeningModalProps = {
  open: boolean;
  onClose: () => void;
  initialStep?: Step;
};

type Step = 'location' | 'zip';

const MaScreeningModal: React.FC<MaScreeningModalProps> = ({ open, onClose, initialStep = 'location' }) => {
  const { openMailingList } = useMailingList();
  const { grantAccess } = useShopAccess();
  const [step, setStep] = useState<Step>('location');
  const [zip, setZip] = useState('');
  const [deliveryZips, setDeliveryZips] = useState<string[]>([]);
  const [zipsLoaded, setZipsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setZip('');
    setError(null);
    setZipsLoaded(false);
    fetch('/api/delivery-zips')
      .then((r) => r.json())
      .then((data) => {
        setDeliveryZips(data.zips ?? []);
        setZipsLoaded(true);
      })
      .catch(() => {
        setDeliveryZips([]);
        setZipsLoaded(true);
      });
  }, [open, initialStep]);

  const handleClose = () => {
    onClose();
  };

  const handleNotInMa = () => {
    openMailingList();
  };

  const handleInMa = () => {
    if (!zipsLoaded) {
      setError('Still loading delivery areas. Try again in a moment.');
      return;
    }
    if (deliveryZips.length === 0) {
      setError(
        'Delivery ZIP list is empty. Add DELIVERY_ZIPS to .env and restart with npm run dev (both web + API).'
      );
      return;
    }
    setStep('zip');
    setError(null);
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = zip.trim();
    if (!/^\d{5}$/.test(normalized)) {
      setError('Enter a valid 5-digit ZIP code.');
      return;
    }
    if (deliveryZips.length === 0) {
      setError('Delivery areas not loaded. Restart npm run dev and check your .env file.');
      return;
    }
    if (!deliveryZips.includes(normalized)) {
      setError(
        `We do not deliver to ${normalized} yet. Add it to DELIVERY_ZIPS in .env if this should work, then restart the server.`
      );
      return;
    }
    grantAccess(normalized);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#2D4F3E]/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="relative w-full max-w-xl rounded-2xl border border-[#2D4F3E]/15 bg-[#F5E8CA] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2D4F3E]/20 text-[#2D4F3E] transition-colors hover:bg-[#F9D067]/40"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {step === 'location' ? (
              <>
                <p className="text-xs font-black uppercase tracking-widest text-[#F47C3E]">
                  Before you shop
                </p>
                <h2 className="mt-2 pr-8 font-serif text-2xl font-black text-[#2D4F3E]">
                  We'd love to bring Jiva to you!
                </h2>
                <div className="mt-5 space-y-2 text-sm leading-relaxed text-[#2D4F3E]/75">
                  <p>We&apos;re accepting preorders in select areas of Massachusetts.</p>
                  <p>Enter your ZIP code to check availability.</p>
                  <p>Outside our delivery area? Join the waitlist for nationwide updates!</p>
                </div>
                {error ? (
                  <p className="mt-4 text-center text-sm text-[#B45309]">{error}</p>
                ) : null}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleInMa}
                    className="flex-1 rounded-full bg-[#2D4F3E] py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#F47C3E]"
                  >
                    Yes, I&apos;m in MA!
                  </button>
                  <button
                    type="button"
                    onClick={handleNotInMa}
                    className="flex-1 rounded-full border border-[#2D4F3E]/30 py-3.5 text-xs font-black uppercase tracking-widest text-[#2D4F3E] transition-colors hover:border-[#2D4F3E]"
                  >
                    No :( - join waitlist
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setStep('location');
                    setError(null);
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/55 hover:text-[#2D4F3E]"
                >
                  ← Back
                </button>
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#F47C3E]">
                  Before you shop
                </p>
                <h2 className="mt-2 pr-8 font-serif text-2xl font-black text-[#2D4F3E]">
                  What&apos;s your ZIP code?
                </h2>
                <p className="mt-3 text-sm text-[#2D4F3E]/75">
                  We deliver to select MA-area ZIP codes.
                </p>
                <form onSubmit={handleZipSubmit} className="mt-6 space-y-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => {
                      setZip(e.target.value.replace(/\D/g, ''));
                      setError(null);
                    }}
                    placeholder="02108"
                    className="w-full rounded-xl border border-[#2D4F3E]/25 bg-white/60 px-4 py-3.5 text-center font-mono text-lg tracking-widest text-[#2D4F3E] outline-none focus:border-[#2D4F3E]"
                  />
                  {error ? (
                    <p className="text-center text-sm leading-relaxed text-[#B45309]">{error}</p>
                  ) : null}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#F47C3E] py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:brightness-105"
                  >
                    Continue to shop
                  </button>
                  {error ? (
                    <button
                      type="button"
                      onClick={openMailingList}
                      className="w-full text-center text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/70 underline underline-offset-2"
                    >
                      Join the waitlist instead
                    </button>
                  ) : null}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MaScreeningModal;
