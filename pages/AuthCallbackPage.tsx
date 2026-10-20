import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { takeAuthNext } from '../lib/authNext';

const fieldClass =
  'w-full rounded-2xl border border-[#8C3F1F]/20 bg-white/80 px-4 py-3.5 text-sm text-[#2D4F3E] outline-none transition-colors placeholder:text-[#2D4F3E]/35 focus:border-[#8C3F1F]';

const AuthCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRecovery = location.pathname.startsWith('/auth/recovery');
  const { configured, loading, session, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const params = new URLSearchParams(location.search);
  const authError = params.get('error_description');

  useEffect(() => {
    if (isRecovery || loading || !session) return;
    navigate(takeAuthNext('/account'), { replace: true });
  }, [isRecovery, loading, navigate, session]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Those passwords do not match.');
      return;
    }
    setSubmitting(true);
    const nextError = await updatePassword(password);
    setSubmitting(false);
    if (nextError) setError(nextError);
    else setSaved(true);
  };

  return (
    <main className="flex jj-min-screen items-center justify-center bg-[#F6F1E8] px-5 pb-16 pt-28">
      <div className="w-full max-w-md text-center">
        {authError ? (
          <>
            <h1 className="font-serif text-4xl font-black text-[#2D4F3E]">Sign-in didn&apos;t finish</h1>
            <p className="mt-4 text-sm leading-relaxed text-[#2D4F3E]/75">{authError}</p>
          </>
        ) : isRecovery ? (
          <>
            <h1 className="font-serif text-4xl font-black text-[#2D4F3E]">Choose a new password</h1>
            {!configured || loading ? (
              <p className="mt-4 text-sm leading-relaxed text-[#2D4F3E]/75">Checking your reset link…</p>
            ) : !session ? (
              <p className="mt-4 text-sm leading-relaxed text-[#2D4F3E]/75">
                This reset link is invalid or has expired. Request a new one from the sign-in page.
              </p>
            ) : saved ? (
              <p className="mt-4 text-sm leading-relaxed text-[#2D4F3E]/75">
                Your password is updated. You can continue to your account.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-3 text-left">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className={fieldClass}
                />
                <input
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className={fieldClass}
                />
                {error ? <p className="text-sm text-[#B45309]">{error}</p> : null}
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="flex w-full items-center justify-center rounded-full bg-[#2D4F3E] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E] disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : 'Update password'}
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            <h1 className="font-serif text-4xl font-black text-[#2D4F3E]">
              {loading ? 'Signing you in' : session ? 'You are in' : 'Sign-in didn&apos;t finish'}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#2D4F3E]/75">
              {loading || session
                ? 'Taking you to your account.'
                : 'The link may have expired. Try signing in again.'}
            </p>
          </>
        )}

        <Link
          to={saved ? '/account' : '/login'}
          className="mt-8 inline-flex rounded-full bg-[#2D4F3E] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E]"
        >
          {saved ? 'Go to account' : 'Back to sign in'}
        </Link>
      </div>
    </main>
  );
};

export default AuthCallbackPage;
