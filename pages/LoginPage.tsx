import React, { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { rememberAuthNext, safeAuthNext } from '../lib/authNext';
import journalBg from '../materials/journal-bg-red.png';

const RESEND_SECONDS = 60;
const CODE_LENGTH = 8;

const fieldClass =
  'w-full rounded-2xl border border-[#8C3F1F]/85 bg-white/92 px-4 py-3.5 text-sm text-[#8C3F1F] outline-none transition-colors placeholder:text-[#8C3F1F]/42 focus:border-[#8C3F1F]';

const primaryButtonClass =
  'flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-xs font-black uppercase tracking-widest text-[#8C3F1F] transition-colors hover:bg-[#F47C3E] hover:text-white disabled:cursor-not-allowed disabled:opacity-50';

const LoginBackdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="relative flex jj-min-screen items-center justify-center overflow-x-hidden px-5 pb-16 pt-28 md:px-8">
    <div className="absolute inset-0">
      <img src={journalBg} alt="" className="h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[#3A1A10]/28" />
    </div>
    {children}
  </main>
);

function formatWait(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${mins}:${String(rest).padStart(2, '0')}`;
}

const GoogleMark: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.65z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.86-3c-1.07.72-2.45 1.15-4.09 1.15-3.14 0-5.8-2.12-6.75-4.97H1.26v3.09A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.25 14.27A7.21 7.21 0 0 1 4.87 12c0-.79.14-1.55.38-2.27V6.64H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.36l3.99-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.26 6.64l3.99 3.09C6.2 6.89 8.86 4.77 12 4.77z"
    />
  </svg>
);

const LoginPage: React.FC = () => {
  const { configured, loading, user, signInWithGoogle, sendEmailOtp, verifyEmailOtp } = useAuth();
  const [params] = useSearchParams();
  const next = safeAuthNext(params.get('next'));
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rememberAuthNext(next);
  }, [next]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  if (loading) {
    return (
      <LoginBackdrop>
        <p className="relative z-10 text-center text-sm text-white">Loading…</p>
      </LoginBackdrop>
    );
  }

  if (user) {
    return <Navigate to={next} replace />;
  }

  const onGoogle = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    const nextError = await signInWithGoogle();
    if (nextError) {
      setError(nextError);
      setSubmitting(false);
    }
  };

  const requestCode = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    const nextError = await sendEmailOtp(email, marketingOptIn);
    setSubmitting(false);
    if (nextError) {
      setError(nextError);
      return;
    }
    setStep('code');
    setCode('');
    setSentAt(Date.now());
    setResendIn(RESEND_SECONDS);
    setMessage(`We sent a code to ${email.trim().toLowerCase()}.`);
  };

  const onRequestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    await requestCode();
  };

  const onVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const token = code.replace(/\D/g, '');
    if (token.length !== CODE_LENGTH) {
      setError('Enter the 8-digit code from your email.');
      return;
    }
    setSubmitting(true);
    const nextError = await verifyEmailOtp(email, token, sentAt);
    if (nextError) {
      setError(nextError);
      setCode('');
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (resendIn > 0 || submitting) return;
    await requestCode();
  };

  return (
    <LoginBackdrop>
      <div className="relative z-10 mx-auto w-full max-w-md rounded-[2rem] bg-[#F6F1E8] px-6 py-8 shadow-[0_24px_80px_rgba(104,53,31,0.24)] sm:px-8 sm:py-10">
        <h1 className="font-serif text-4xl font-black leading-none text-[#8C3F1F]">
          {step === 'code' ? 'Enter your code' : 'Welcome back'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#8C3F1F]/90">
          {step === 'code'
            ? 'Use the 8-digit code from your email. A new address creates an account automatically.'
            : 'Sign in with Google, or with a code sent to your email. No password.'}
        </p>

        {!configured ? (
          <p className="mt-6 rounded-2xl bg-white/70 px-4 py-3 text-sm leading-relaxed text-[#8C3F1F]">
            Sign-in is not available yet.
          </p>
        ) : null}

        {step === 'email' ? (
          <>
            <button
              type="button"
              onClick={onGoogle}
              disabled={!configured || submitting}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-[#8C3F1F]/15 bg-white px-6 py-3.5 text-sm font-bold text-[#8C3F1F] transition-colors hover:border-[#8C3F1F]/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleMark />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C3F1F]/55">
              <span className="h-px flex-1 bg-[#8C3F1F]/20" />
              or email
              <span className="h-px flex-1 bg-[#8C3F1F]/20" />
            </div>

            <form onSubmit={onRequestCode} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className={fieldClass}
              />
              <label className="flex items-start gap-3 pt-1 text-sm leading-relaxed text-[#8C3F1F]/90">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                  className="mt-1 accent-[#8C3F1F]"
                />
                If this email is new, also send me news about drops and restocks. Receipts stay separate.
              </label>
              {error ? <p className="text-sm text-[#B45309]">{error}</p> : null}
              <button type="submit" disabled={!configured || submitting} className={primaryButtonClass}>
                {submitting ? 'Please wait…' : 'Email me a code'}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={onVerify} className="mt-7 space-y-3">
            <p className="text-sm text-[#8C3F1F]/85">
              Code sent to <span className="font-bold text-[#8C3F1F]">{email.trim().toLowerCase()}</span>
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))}
              placeholder="8-digit code"
              aria-label="Email code"
              required
              className={`${fieldClass} text-center font-mono text-lg tracking-[0.4em]`}
            />
            {error ? <p className="text-sm text-[#B45309]">{error}</p> : null}
            {message && !error ? <p className="text-sm leading-relaxed text-[#8C3F1F]">{message}</p> : null}
            <button type="submit" disabled={!configured || submitting} className={primaryButtonClass}>
              {submitting ? 'Please wait…' : 'Sign in'}
            </button>
            <div className="flex items-center justify-between pt-1 text-sm">
              <button
                type="button"
                className="font-bold text-[#8C3F1F] hover:text-[#F47C3E] disabled:cursor-not-allowed disabled:text-[#8C3F1F]/40"
                onClick={onResend}
                disabled={!configured || submitting || resendIn > 0}
              >
                {resendIn > 0 ? `Resend code in ${formatWait(resendIn)}` : 'Resend code'}
              </button>
              <button
                type="button"
                className="font-bold text-[#8C3F1F] hover:text-[#F47C3E]"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setError(null);
                  setMessage(null);
                }}
              >
                Use a different email
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#8C3F1F]/80">
          <Link to="/" className="hover:text-[#F47C3E]">
            Return home
          </Link>
        </p>
      </div>
    </LoginBackdrop>
  );
};

export default LoginPage;
