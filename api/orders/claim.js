import { claimGuestOrders } from '../../server/ordersApi.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const result = await claimGuestOrders(token);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders claim]', err);
    return res.status(500).json({ error: 'Could not link guest orders.' });
  }
}
