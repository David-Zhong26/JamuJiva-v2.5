import { getStripe } from '../../server/shopApi.mjs';
import { syncCheckoutSession } from '../../server/ordersApi.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ error: 'Stripe is not configured on the server.' });
    const result = await syncCheckoutSession(req.body?.sessionId, stripe);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders sync]', err);
    return res.status(500).json({ error: 'Could not sync the Stripe payment.' });
  }
}
