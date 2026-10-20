export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'partially_refunded', 'refunded'];
export const FULFILLMENT_STATUSES = [
  'preparing',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'picked_up',
];

const PAYMENT_RANK = {
  pending: 10,
  failed: 20,
  paid: 30,
  partially_refunded: 40,
  refunded: 50,
};

export function normalizeZip(zip) {
  const value = String(zip || '').trim();
  const match = value.match(/^(\d{5})/);
  return match ? match[1] : value;
}

/** Verified sign-in email only. A typed-in email is never accepted. */
export function claimEmailFromUser(user) {
  const email = String(user?.email || '').trim().toLowerCase();
  if (!email) return null;
  const google = user?.app_metadata?.provider === 'google'
    || (user?.identities || []).some((identity) => identity?.provider === 'google');
  if (!user?.email_confirmed_at && !google) return null;
  return email;
}

/** Live Checkout sessions only. Test payments stay in the order list for the team. */
export function countsTowardPrelaunch(sessionId) {
  return String(sessionId || '').startsWith('cs_live_');
}

export function canRequestAddressChange(order) {
  return Boolean(
    order
    && order.payment_status === 'paid'
    && order.fulfillment_type === 'delivery'
    && order.fulfillment_status === 'preparing'
  );
}

export function nextPaymentStatus(current, incoming, incomingCreated, storedCreated) {
  if (!PAYMENT_RANK[incoming]) {
    return { status: current, applied: false, reason: 'unknown' };
  }
  if (storedCreated != null && Number(incomingCreated) < Number(storedCreated)) {
    return { status: current, applied: false, reason: 'stale' };
  }
  if (current && PAYMENT_RANK[incoming] < PAYMENT_RANK[current]) {
    return { status: current, applied: false, reason: 'downgrade' };
  }
  return { status: incoming, applied: true };
}

export function paymentPatch(existing, incomingStatus, eventCreated, extra = {}) {
  const decision = nextPaymentStatus(
    existing?.payment_status ?? null,
    incomingStatus,
    eventCreated,
    existing?.payment_event_created ?? null
  );
  if (!decision.applied) return null;

  const patch = {
    payment_status: decision.status,
    payment_event_created: eventCreated,
  };
  if (decision.status === 'paid' && !existing?.fulfillment_status) {
    patch.fulfillment_status = 'preparing';
  }
  if (Number.isInteger(extra.amountRefunded)) {
    patch.amount_refunded = extra.amountRefunded;
  }
  return patch;
}

export function paymentStatusFromCheckoutSession(session) {
  if (session?.payment_status === 'paid' || session?.payment_status === 'no_payment_required') {
    return 'paid';
  }
  if (session?.payment_status === 'unpaid') return 'pending';
  return 'pending';
}

export function paymentStatusFromRefund(charge) {
  const refunded = Number(charge?.amount_refunded || 0);
  const amount = Number(charge?.amount || 0);
  if (refunded <= 0) return null;
  return refunded >= amount && amount > 0 ? 'refunded' : 'partially_refunded';
}
