import { countsTowardPrelaunch } from './orderState.mjs';
import { getServiceClient, getUserFromAccessToken } from './supabaseAuth.mjs';

/** First shop drink. Matches PRODUCT_DRINKS[0].slug. */
export const FIRST_PRELAUNCH_BATCH = 'golden-glow';

function isDuplicate(error) {
  return error?.code === '23505' || String(error?.message || '').toLowerCase().includes('duplicate');
}

export async function getPrelaunchProgress(batchId = FIRST_PRELAUNCH_BATCH) {
  const id = batchId || FIRST_PRELAUNCH_BATCH;
  if (id !== FIRST_PRELAUNCH_BATCH) {
    return { status: 400, body: { error: 'Unknown pre-launch batch.' } };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return { status: 503, body: { error: 'Pre-launch progress is not configured.' } };
  }

  const { data: batch, error: batchError } = await supabase
    .from('prelaunch_batches')
    .select('goal')
    .eq('id', id)
    .maybeSingle();

  if (batchError) return { status: 400, body: { error: batchError.message } };
  if (!batch) return { status: 404, body: { error: 'Pre-launch batch was not found.' } };

  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('items, stripe_session_id')
    .eq('order_kind', 'preorder')
    .eq('payment_status', 'paid');

  if (orderError) return { status: 400, body: { error: orderError.message } };

  const joined = (orders || []).reduce((total, order) => {
    if (!countsTowardPrelaunch(order.stripe_session_id)) return total;
    const items = Array.isArray(order.items) ? order.items : [];
    const bottles = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    return total + (bottles || 1);
  }, 0);

  return {
    status: 200,
    body: { joined, goal: batch.goal },
  };
}

/** Signed-in join for the first product. Also keeps the address on the mailing list. */
export async function recordPrelaunchJoin(accessToken, firstName) {
  const user = await getUserFromAccessToken(accessToken);
  const email = String(user?.email || '').trim().toLowerCase();
  if (!user || !email) {
    return { status: 401, body: { error: 'Sign in to join the pre-launch.' } };
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return { status: 503, body: { error: 'Pre-launch progress is not configured.' } };
  }

  const cleanedFirstName = String(firstName || '').trim();
  const { error: subscriberError } = await supabase.from('subscribers').insert([
    {
      email,
      first_name: cleanedFirstName || null,
    },
  ]);

  if (subscriberError && !isDuplicate(subscriberError)) {
    return { status: 400, body: { error: subscriberError.message } };
  }

  const { error: reservationError } = await supabase.from('prelaunch_reservations').insert([
    {
      batch_id: FIRST_PRELAUNCH_BATCH,
      email,
      user_id: user.id,
    },
  ]);

  const progress = await getPrelaunchProgress();
  const counts = progress.status === 200 ? progress.body : {};

  if (reservationError) {
    if (isDuplicate(reservationError)) {
      return {
        status: 409,
        body: { error: 'This email is already on the pre-launch list.', ...counts },
      };
    }
    return { status: 400, body: { error: reservationError.message } };
  }

  return { status: 200, body: { ok: true, ...counts } };
}
