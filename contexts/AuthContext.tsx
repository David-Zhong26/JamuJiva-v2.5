import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authRedirectUrl, isSupabaseConfigured, supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postal_code: string | null;
  marketing_opt_in: boolean;
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  profileError: string | null;
  signInWithGoogle: () => Promise<string | null>;
  sendEmailOtp: (email: string, marketingOptIn: boolean) => Promise<string | null>;
  verifyEmailOtp: (email: string, token: string, sentAt: number | null) => Promise<string | null>;
  updateProfile: (input: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    addressCity: string;
    addressState: string;
    addressPostalCode: string;
    marketingOptIn: boolean;
  }) => Promise<string | null>;
  requestEmailChange: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PROFILE_COLUMNS =
  'id, email, full_name, phone, address_line1, address_line2, address_city, address_state, address_postal_code, marketing_opt_in';

const OTP_VALID_MS = 60 * 60 * 1000;

function describeEmailOtpError(
  error: { message?: string; code?: string } | null,
  sentAt: number | null
): string {
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '');
  const lower = message.toLowerCase();

  if (code.includes('rate') || lower.includes('rate limit') || lower.includes('too many')) {
    return 'Please wait a minute before requesting another code.';
  }

  const mentionsExpired = lower.includes('expired');
  const mentionsInvalid = lower.includes('invalid') || lower.includes('incorrect');
  const ageMs = sentAt ? Date.now() - sentAt : 0;
  const pastValidity = ageMs > OTP_VALID_MS;

  if ((mentionsExpired && !mentionsInvalid) || (mentionsExpired && pastValidity) || (code === 'otp_expired' && pastValidity)) {
    return 'That code has expired. Send a new one.';
  }

  if (mentionsInvalid || mentionsExpired || code === 'otp_expired' || lower.includes('token')) {
    return 'That code is incorrect. Check the email and try again.';
  }

  return message || 'Could not sign in with that code.';
}

function metadataName(user: User) {
  const meta = user.user_metadata ?? {};
  return String(meta.full_name || meta.name || '').trim();
}

async function ensureProfile(user: User): Promise<Profile> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;

  const fullName = metadataName(user);
  if (data) {
    if (!data.full_name && fullName) {
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, email: user.email })
        .eq('id', user.id)
        .select(PROFILE_COLUMNS)
        .single();
      if (updateError) throw updateError;
      return updated as Profile;
    }
    return data as Profile;
  }

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      marketing_opt_in: user.user_metadata?.marketing_opt_in === true,
    })
    .select(PROFILE_COLUMNS)
    .single();

  if (!insertError && created) return created as Profile;

  const retry = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', user.id).maybeSingle();
  if (retry.data) return retry.data as Profile;
  throw insertError || retry.error || new Error('Could not create your profile.');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (user: User | null) => {
    if (!user || !supabase) {
      setProfile(null);
      setProfileError(null);
      return;
    }

    try {
      const next = await ensureProfile(user);
      setProfile(next);
      setProfileError(null);
    } catch (err) {
      setProfile(null);
      const message = err instanceof Error ? err.message : 'Could not load your account.';
      setProfileError(
        /profiles|schema cache|relation/i.test(message)
          ? 'Account storage is not ready yet. Run supabase/accounts.sql in the Supabase SQL editor.'
          : message
      );
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    void loadProfile(session?.user ?? null);
  }, [loadProfile, session?.user?.id]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return 'Supabase is not configured yet.';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authRedirectUrl('/auth/callback') },
    });
    return error?.message ?? null;
  }, []);

  const sendEmailOtp = useCallback(async (email: string, marketingOptIn: boolean) => {
    if (!supabase) return 'Supabase is not configured yet.';
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        data: { marketing_opt_in: marketingOptIn },
      },
    });
    return error ? describeEmailOtpError(error, null) : null;
  }, []);

  const verifyEmailOtp = useCallback(async (email: string, token: string, sentAt: number | null) => {
    if (!supabase) return 'Supabase is not configured yet.';
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'email',
    });
    return error ? describeEmailOtpError(error, sentAt) : null;
  }, []);

  const updateProfile = useCallback(
    async ({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressPostalCode,
      marketingOptIn,
    }: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2: string;
      addressCity: string;
      addressState: string;
      addressPostalCode: string;
      marketingOptIn: boolean;
    }) => {
      if (!supabase || !session?.user) return 'Sign in to update your account.';
      const cleanedName = fullName.trim();
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: cleanedName,
          phone: phone.trim() || null,
          address_line1: addressLine1.trim() || null,
          address_line2: addressLine2.trim() || null,
          address_city: addressCity.trim() || null,
          address_state: addressState.trim() || null,
          address_postal_code: addressPostalCode.trim() || null,
          marketing_opt_in: marketingOptIn,
        })
        .eq('id', session.user.id)
        .select(PROFILE_COLUMNS)
        .single();

      if (error) return error.message;
      setProfile(data as Profile);
      await supabase.auth.updateUser({ data: { full_name: cleanedName } });
      return null;
    },
    [session?.user]
  );

  const requestEmailChange = useCallback(async (email: string) => {
    if (!supabase) return 'Supabase is not configured yet.';
    const nextEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) return 'Enter a valid email address.';
    const { error } = await supabase.auth.updateUser(
      { email: nextEmail },
      { emailRedirectTo: authRedirectUrl('/auth/callback') }
    );
    return error?.message ?? null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return 'Supabase is not configured yet.';
    const { error } = await supabase.auth.updateUser({ password });
    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
    setProfileError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      user: session?.user ?? null,
      profile,
      profileError,
      signInWithGoogle,
      sendEmailOtp,
      verifyEmailOtp,
      updateProfile,
      requestEmailChange,
      updatePassword,
      signOut,
    }),
    [
      loading,
      session,
      profile,
      profileError,
      signInWithGoogle,
      sendEmailOtp,
      verifyEmailOtp,
      updateProfile,
      requestEmailChange,
      updatePassword,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
