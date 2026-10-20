import { createClient } from '@supabase/supabase-js';
import { getServerKey, getSupabaseUrl } from './supabaseAuth.mjs';
import { recordPrelaunchJoin } from './prelaunch.mjs';

function getSupabaseConfig() {
  return { url: getSupabaseUrl(), key: getServerKey() };
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export async function subscribeToMailingList(body, accessToken = '') {
  if (String(body?.source ?? '') === 'prelaunch') {
    return recordPrelaunchJoin(accessToken, body?.firstName ?? body?.first_name);
  }

  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    return {
      status: 503,
      body: { error: 'Mailing list is not configured on the server.' },
    };
  }

  const cleanedEmail = String(body?.email ?? '').trim().toLowerCase();
  const cleanedFirstName = String(body?.firstName ?? body?.first_name ?? '').trim();

  if (!cleanedEmail) {
    return { status: 400, body: { error: 'Please enter your email.' } };
  }

  if (!isValidEmail(cleanedEmail)) {
    return { status: 400, body: { error: 'Please enter a valid email address.' } };
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from('subscribers').insert([
    {
      email: cleanedEmail,
      first_name: cleanedFirstName || null,
    },
  ]);

  if (error) {
    if (error.message.toLowerCase().includes('duplicate')) {
      return { status: 409, body: { error: 'This email is already on the list.' } };
    }
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { ok: true } };
}
