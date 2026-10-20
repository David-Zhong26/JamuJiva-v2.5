import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = (__SUPABASE_URL__ || '').trim();
const publishableKey = (__SUPABASE_PUBLISHABLE_KEY__ || '').trim();

export const isSupabaseConfigured = Boolean(
  url && publishableKey && !url.includes('your-project') && !publishableKey.startsWith('sb_secret_')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

export function authRedirectUrl(path = '/auth/callback') {
  return `${window.location.origin}${path}`;
}
