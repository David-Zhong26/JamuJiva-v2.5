import { createClient } from '@supabase/supabase-js';

export function getSupabaseUrl() {
  return process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
}

export function getPublishableKey() {
  return process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
}

export function getSecretKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

/** Key for server-side Supabase calls. Secret key preferred; publishable key still works for public writes. */
export function getServerKey() {
  return getSecretKey() || getPublishableKey() || process.env.VITE_SUPABASE_ANON_KEY || '';
}

function serverClient(key) {
  const url = getSupabaseUrl();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getServiceClient() {
  return serverClient(getSecretKey());
}

/** Verifies a browser access token. Returns null for guests or invalid tokens. */
export async function getUserFromAccessToken(token) {
  const accessToken = String(token || '').trim();
  const supabase = serverClient(getServerKey());
  if (!supabase || !accessToken) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) return null;
  return data.user;
}

/** Deletes only the user proven by the access token. The id never comes from the request body. */
export async function deleteSignedInUser(token, confirmation) {
  if (confirmation !== 'DELETE') {
    return { status: 400, body: { error: 'Type DELETE to confirm.' } };
  }

  const user = await getUserFromAccessToken(token);
  if (!user?.id) return { status: 401, body: { error: 'Sign in again before deleting your account.' } };

  const supabase = getServiceClient();
  if (!supabase) return { status: 503, body: { error: 'Account deletion is not available yet.' } };

  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) {
    console.error('[account delete]', error.message);
    return { status: 500, body: { error: 'Could not delete this account.' } };
  }

  return { status: 200, body: { ok: true } };
}
