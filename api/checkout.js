import { createCheckoutSession, createPrelaunchCheckout } from '../server/shopApi.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const result = req.body?.source === 'prelaunch'
      ? await createPrelaunchCheckout(token, req.body?.quantity)
      : await createCheckoutSession(req.body, token);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[checkout]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Checkout failed.',
    });
  }
}
