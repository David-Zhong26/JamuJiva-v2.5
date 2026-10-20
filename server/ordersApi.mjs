import { getServiceClient, getUserFromAccessToken } from './supabaseAuth.mjs';
import { isDeliveryZip } from './shopApi.mjs';
import {
  FULFILLMENT_STATUSES,
  canRequestAddressChange,
  claimEmailFromUser,
  normalizeZip,
  paymentPatch,
  paymentStatusFromCheckoutSession,
  paymentStatusFromRefund,
} from './orderState.mjs';

const USER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DELIVERY_WINDOWS = {
  '10am1pm': '10:00 AM–1:00 PM',
  '1pm4pm': '1:00 PM–4:00 PM',
  '4pm7pm': '4:00 PM–7:00 PM',
  flexible: 'Flexible — contact me',
};

function requireDb() {
  const supabase = getServiceClient();
  if (!supabase) {
    return {
      supabase: null,
      error: { status: 503, body: { error: 'Order storage is not configured on the server.' } },
    };
  }
  return { supabase, error: null };
}

function customFieldValue(session, key) {
  const field = (session.custom_fields || []).find((item) => item.key === key);
  if (!field) return '';
  if (field.type === 'dropdown') return field.dropdown?.value || '';
  return field.text?.value || '';
}

function addressFromSession(session) {
  return (
    session.collected_information?.shipping_details?.address ||
    session.shipping_details?.address ||
    session.customer_details?.address ||
    null
  );
}

function formatAddress(address) {
  if (!address) return '';
  return [address.line1, address.line2, address.city, address.state, address.postal_code]
    .filter(Boolean)
    .join(', ');
}

function mapItems(session) {
  return (session.line_items?.data || []).map((line) => ({
    name: line.description || 'Item',
    quantity: line.quantity || 1,
    unit_amount: Number.isInteger(line.price?.unit_amount) ? line.price.unit_amount : null,
    amount: Number.isInteger(line.amount_total) ? line.amount_total : null,
  }));
}

function paymentIntentId(session) {
  const value = session.payment_intent;
  if (typeof value === 'string') return value;
  return value?.id || null;
}

function verifiedUserId(session) {
  const value = String(session.metadata?.user_id || session.client_reference_id || '');
  return USER_ID.test(value) ? value : null;
}

function snapshotFromSession(session) {
  const address = addressFromSession(session);
  const deliveryWindowRaw = customFieldValue(session, 'delivery_time');
  const email = String(session.customer_details?.email || session.customer_email || '')
    .trim()
    .toLowerCase();

  return {
    user_id: verifiedUserId(session),
    email: email || null,
    stripe_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId(session),
    fulfillment_type: session.metadata?.fulfillment_type || null,
    delivery_zip: normalizeZip(session.metadata?.delivery_zip || address?.postal_code || ''),
    pickup_location: session.metadata?.pickup_location || null,
    shipping_address: formatAddress(address) || null,
    ship_line1: address?.line1 || null,
    ship_line2: address?.line2 || null,
    ship_city: address?.city || null,
    ship_state: address?.state || null,
    ship_postal_code: address?.postal_code ? normalizeZip(address.postal_code) : null,
    phone: customFieldValue(session, 'phone_number') || session.customer_details?.phone || null,
    delivery_window: DELIVERY_WINDOWS[deliveryWindowRaw] || deliveryWindowRaw || null,
    notes: customFieldValue(session, 'additional_notes') || null,
    amount_total: Number.isInteger(session.amount_total) ? session.amount_total : null,
    currency: session.currency || 'usd',
    items: mapItems(session),
    order_kind: session.metadata?.order_kind === 'preorder' ? 'preorder' : null,
    created_at: session.created ? new Date(session.created * 1000).toISOString() : new Date().toISOString(),
  };
}

async function rememberEvent(supabase, event) {
  const { error } = await supabase.from('stripe_events').insert([
    { id: event.id, event_type: event.type },
  ]);
  if (!error) return { duplicate: false };
  if (error.code === '23505') return { duplicate: true };
  throw error;
}

async function loadOrder(supabase, column, value) {
  if (!value) return null;
  const { data, error } = await supabase
    .from('orders')
    .select('id, payment_status, payment_event_created, fulfillment_status, fulfillment_type, user_id')
    .eq(column, value)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function insertSnapshot(supabase, session, patch) {
  const row = {
    ...snapshotFromSession(session),
    payment_status: patch.payment_status,
    payment_event_created: patch.payment_event_created,
    fulfillment_status: patch.fulfillment_status || null,
    amount_refunded: patch.amount_refunded || 0,
  };
  const { error } = await supabase.from('orders').insert([row]);
  if (!error) return 'inserted';
  if (error.code === '23505') return 'exists';
  if (error.code === '23503') {
    const { error: retryError } = await supabase.from('orders').insert([{ ...row, user_id: null }]);
    if (!retryError) return 'inserted';
    if (retryError.code === '23505') return 'exists';
    throw retryError;
  }
  throw error;
}

async function writePayment(supabase, existing, patch) {
  const { error } = await supabase.from('orders').update(patch).eq('id', existing.id);
  if (error) throw error;
}

async function applyPayment(supabase, session, incomingStatus, eventCreated, extra = {}) {
  const existing = await loadOrder(supabase, 'stripe_session_id', session.id);
  const patch = paymentPatch(existing, incomingStatus, eventCreated, extra);
  if (!patch) return;
  if (!existing) {
    const result = await insertSnapshot(supabase, session, patch);
    if (result === 'inserted') return;
    const raced = await loadOrder(supabase, 'stripe_session_id', session.id);
    const racedPatch = paymentPatch(raced, incomingStatus, eventCreated, extra);
    if (raced && racedPatch) await writePayment(supabase, raced, racedPatch);
    return;
  }
  await writePayment(supabase, existing, patch);
}

export async function syncCheckoutSession(sessionId, stripe) {
  const id = String(sessionId || '').trim();
  if (!id.startsWith('cs_')) {
    return { status: 400, body: { error: 'Missing checkout session.' } };
  }
  if (!stripe) {
    return { status: 503, body: { error: 'Stripe is not configured on the server.' } };
  }

  const session = await stripe.checkout.sessions.retrieve(id, {
    expand: ['line_items', 'line_items.data.price'],
  });
  const incoming = paymentStatusFromCheckoutSession(session);
  if (incoming !== 'paid') {
    return { status: 200, body: { ok: true, payment_status: incoming } };
  }

  const { supabase, error } = requireDb();
  if (error) return error;
  await applyPayment(supabase, session, 'paid', Number(session.created || 0));
  return { status: 200, body: { ok: true, payment_status: 'paid' } };
}

export async function applyStripeEvent(event, stripe) {
  const { supabase, error } = requireDb();
  if (error) return error;

  const { data: seen, error: seenError } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();
  if (seenError) throw seenError;
  if (seen) return { status: 200, body: { ok: true, duplicate: true } };

  const created = Number(event.created || 0);

  if (
    event.type === 'checkout.session.completed'
    || event.type === 'checkout.session.async_payment_succeeded'
    || event.type === 'checkout.session.async_payment_failed'
  ) {
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items', 'line_items.data.price'],
    });
    const incoming = event.type === 'checkout.session.async_payment_failed'
      ? 'failed'
      : paymentStatusFromCheckoutSession(session);
    await applyPayment(supabase, session, incoming, created);
    return finish(supabase, event, { ok: true });
  }

  if (event.type === 'checkout.session.expired') {
    const existing = await loadOrder(supabase, 'stripe_session_id', event.data.object.id);
    if (existing) {
      const patch = paymentPatch(existing, 'failed', created);
      if (patch) await writePayment(supabase, existing, patch);
    }
    return finish(supabase, event, { ok: true });
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    const incoming = paymentStatusFromRefund(charge);
    const paymentIntent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
    if (incoming && paymentIntent) {
      let existing = await loadOrder(supabase, 'stripe_payment_intent_id', paymentIntent);
      if (!existing) {
        const listed = await stripe.checkout.sessions.list({ payment_intent: paymentIntent, limit: 1 });
        const sessionId = listed.data?.[0]?.id;
        if (sessionId) {
          const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'line_items.data.price'],
          });
          await applyPayment(supabase, session, 'paid', created - 1);
          existing = await loadOrder(supabase, 'stripe_session_id', session.id);
        }
      }
      if (existing) {
        const patch = paymentPatch(existing, incoming, created, {
          amountRefunded: Number(charge.amount_refunded || 0),
        });
        if (patch) await writePayment(supabase, existing, patch);
      }
    }
    return finish(supabase, event, { ok: true });
  }

  return finish(supabase, event, { ok: true, ignored: true });
}

async function finish(supabase, event, body) {
  const seen = await rememberEvent(supabase, event);
  if (seen.duplicate) return { status: 200, body: { ...body, duplicate: true } };
  return { status: 200, body };
}

export async function claimGuestOrders(accessToken) {
  const { supabase, error } = requireDb();
  if (error) return error;

  const user = await getUserFromAccessToken(accessToken);
  const email = claimEmailFromUser(user);
  if (!user || !email) {
    return {
      status: 400,
      body: { error: 'Confirm your sign-in email before adding guest orders.' },
    };
  }

  const { data, error: updateError } = await supabase
    .from('orders')
    .update({ user_id: user.id })
    .is('user_id', null)
    .eq('email', email)
    .select('id');

  if (updateError) return { status: 500, body: { error: updateError.message } };
  return { status: 200, body: { ok: true, linked: data?.length || 0 } };
}

export async function requestAddressChange(accessToken, body) {
  const { supabase, error } = requireDb();
  if (error) return error;

  const user = await getUserFromAccessToken(accessToken);
  if (!user) return { status: 401, body: { error: 'Sign in to request an address change.' } };

  const orderId = String(body?.orderId || '');
  if (!USER_ID.test(orderId)) return { status: 400, body: { error: 'Missing order.' } };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, user_id, payment_status, fulfillment_status, fulfillment_type')
    .eq('id', orderId)
    .maybeSingle();
  if (orderError) return { status: 500, body: { error: orderError.message } };
  if (!order || order.user_id !== user.id) return { status: 404, body: { error: 'Order not found.' } };
  if (!canRequestAddressChange(order)) {
    return {
      status: 409,
      body: { error: 'This order is already being prepared or is on its way, so the address is locked.' },
    };
  }

  const postalCode = normalizeZip(body?.postalCode);
  if (!isDeliveryZip(postalCode)) {
    return { status: 400, body: { error: 'Delivery is not available for this ZIP code.' } };
  }

  const line1 = String(body?.line1 || '').trim();
  const city = String(body?.city || '').trim();
  const state = String(body?.state || '').trim();
  if (!line1 || !city || !state) {
    return { status: 400, body: { error: 'Enter the street, city, and state.' } };
  }

  const { error: insertError } = await supabase.from('order_address_requests').insert([
    {
      order_id: order.id,
      user_id: user.id,
      line1,
      line2: String(body?.line2 || '').trim() || null,
      city,
      state,
      postal_code: postalCode,
    },
  ]);
  if (insertError) return { status: 500, body: { error: insertError.message } };
  return { status: 200, body: { ok: true } };
}

function adminPassword() {
  return process.env.ORDERS_ADMIN_PASSWORD || process.env.EVENTS_ADMIN_PASSWORD || '';
}

export function isOrdersAdmin(req) {
  const expected = adminPassword();
  if (!expected) return false;
  const header = req.headers['x-orders-admin'] || '';
  return String(header) === expected;
}

export async function listAdminOrders() {
  const { supabase, error } = requireDb();
  if (error) return error;
  const [{ data: orders, error: ordersError }, { data: requests, error: requestError }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('order_address_requests').select('*').eq('status', 'pending').order('created_at', { ascending: true }),
  ]);
  if (ordersError) return { status: 500, body: { error: ordersError.message } };
  if (requestError) return { status: 500, body: { error: requestError.message } };
  return { status: 200, body: { orders: orders || [], requests: requests || [] } };
}

export async function updateFulfillment(body) {
  const { supabase, error } = requireDb();
  if (error) return error;
  const orderId = String(body?.orderId || '');
  const fulfillmentStatus = String(body?.fulfillmentStatus || '');
  if (!USER_ID.test(orderId) || !FULFILLMENT_STATUSES.includes(fulfillmentStatus)) {
    return { status: 400, body: { error: 'Choose an order and a fulfillment status.' } };
  }
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, payment_status')
    .eq('id', orderId)
    .maybeSingle();
  if (orderError) return { status: 500, body: { error: orderError.message } };
  if (!order) return { status: 404, body: { error: 'Order not found.' } };
  if (order.payment_status === 'pending' || order.payment_status === 'failed') {
    return { status: 409, body: { error: 'Payment is not complete, so fulfillment stays unchanged.' } };
  }

  const trackingUrl = String(body?.trackingUrl || '').trim();
  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
    return { status: 400, body: { error: 'Tracking link must start with http:// or https://.' } };
  }
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      fulfillment_status: fulfillmentStatus,
      tracking_url: trackingUrl || null,
    })
    .eq('id', orderId);
  if (updateError) return { status: 500, body: { error: updateError.message } };
  return { status: 200, body: { ok: true } };
}

export async function decideAddressRequest(body) {
  const { supabase, error } = requireDb();
  if (error) return error;
  const requestId = String(body?.requestId || '');
  const decision = body?.decision === 'approved' ? 'approved' : body?.decision === 'declined' ? 'declined' : '';
  if (!USER_ID.test(requestId) || !decision) {
    return { status: 400, body: { error: 'Missing address request.' } };
  }

  const { data: request, error: requestError } = await supabase
    .from('order_address_requests')
    .select('*')
    .eq('id', requestId)
    .maybeSingle();
  if (requestError) return { status: 500, body: { error: requestError.message } };
  if (!request || request.status !== 'pending') {
    return { status: 404, body: { error: 'That request is no longer pending.' } };
  }

  if (decision === 'declined') {
    const { error: updateError } = await supabase
      .from('order_address_requests')
      .update({ status: 'declined' })
      .eq('id', request.id);
    if (updateError) return { status: 500, body: { error: updateError.message } };
    return { status: 200, body: { ok: true } };
  }

  if (!isDeliveryZip(request.postal_code)) {
    return { status: 400, body: { error: 'That ZIP is outside the current delivery area.' } };
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, payment_status, fulfillment_status, fulfillment_type')
    .eq('id', request.order_id)
    .maybeSingle();
  if (orderError) return { status: 500, body: { error: orderError.message } };
  if (!order || !canRequestAddressChange(order)) {
    await supabase.from('order_address_requests').update({ status: 'declined' }).eq('id', request.id);
    return { status: 409, body: { error: 'The order is no longer waiting to be prepared.' } };
  }

  const shippingAddress = [request.line1, request.line2, request.city, request.state, request.postal_code]
    .filter(Boolean)
    .join(', ');
  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({
      ship_line1: request.line1,
      ship_line2: request.line2,
      ship_city: request.city,
      ship_state: request.state,
      ship_postal_code: request.postal_code,
      delivery_zip: request.postal_code,
      shipping_address: shippingAddress,
    })
    .eq('id', order.id);
  if (orderUpdateError) return { status: 500, body: { error: orderUpdateError.message } };

  const { error: requestUpdateError } = await supabase
    .from('order_address_requests')
    .update({ status: 'approved' })
    .eq('id', request.id);
  if (requestUpdateError) return { status: 500, body: { error: requestUpdateError.message } };
  return { status: 200, body: { ok: true } };
}
