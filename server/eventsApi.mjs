import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  return { url, key };
}

function getAdminPassword() {
  return process.env.EVENTS_ADMIN_PASSWORD || '';
}

function isAuthorized(req) {
  const password = getAdminPassword();
  if (!password) return false;
  const header = req.headers['x-events-admin'] || req.headers['authorization'] || '';
  const token = String(header).replace(/^Bearer\s+/i, '').trim();
  return token === password;
}

function mapRow(row) {
  return {
    id: row.id,
    date: row.date_label,
    title: row.title,
    location: row.location,
    image: row.image_url,
    summary: row.summary,
    details: Array.isArray(row.details) ? row.details : [],
    time: row.time_label,
    capacity: row.capacity,
    priceLabel: row.price_label,
    endsAt: row.ends_at,
    expectations: Array.isArray(row.expectations) ? row.expectations : [],
  };
}

function getClient() {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function listEvents({ includePast = false } = {}) {
  const supabase = getClient();
  if (!supabase) {
    return { status: 503, body: { error: 'Events database is not configured.', events: null } };
  }

  let query = supabase.from('events').select('*').order('ends_at', { ascending: true });
  if (!includePast) {
    query = query.gt('ends_at', new Date().toISOString());
  }

  const { data, error } = await query;
  if (error) {
    return { status: 400, body: { error: error.message, events: null } };
  }

  return { status: 200, body: { events: (data || []).map(mapRow) } };
}

export async function createEvent(req) {
  if (!isAuthorized(req)) {
    return { status: 401, body: { error: 'Unauthorized.' } };
  }

  const supabase = getClient();
  if (!supabase) {
    return { status: 503, body: { error: 'Events database is not configured.' } };
  }

  const body = req.body || {};
  const title = String(body.title || '').trim();
  const endsAt = String(body.endsAt || body.ends_at || '').trim();

  if (!title || !endsAt) {
    return { status: 400, body: { error: 'Title and endsAt are required.' } };
  }

  const id =
    String(body.id || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '') ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const row = {
    id,
    date_label: String(body.date || body.date_label || '').trim() || 'TBA',
    title,
    location: String(body.location || '').trim() || 'TBA',
    image_url: String(body.image || body.image_url || '').trim() || '',
    summary: String(body.summary || '').trim(),
    details: Array.isArray(body.details) ? body.details.map(String) : [],
    time_label: String(body.time || body.time_label || '').trim() || 'TBA',
    capacity: String(body.capacity || '').trim() || 'Open event',
    price_label: String(body.priceLabel || body.price_label || '').trim() || 'Free entry',
    ends_at: endsAt,
    expectations: Array.isArray(body.expectations) ? body.expectations : [],
  };

  const { data, error } = await supabase.from('events').insert([row]).select().single();
  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 201, body: { event: mapRow(data) } };
}

export async function deleteEvent(req, eventId) {
  if (!isAuthorized(req)) {
    return { status: 401, body: { error: 'Unauthorized.' } };
  }

  const supabase = getClient();
  if (!supabase) {
    return { status: 503, body: { error: 'Events database is not configured.' } };
  }

  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { ok: true } };
}

export function checkAdminAuth(req) {
  if (!getAdminPassword()) {
    return { status: 503, body: { error: 'EVENTS_ADMIN_PASSWORD is not set on the server.' } };
  }
  if (!isAuthorized(req)) {
    return { status: 401, body: { error: 'Unauthorized.' } };
  }
  return { status: 200, body: { ok: true } };
}
