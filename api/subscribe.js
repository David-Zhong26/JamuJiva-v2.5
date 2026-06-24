import { subscribeToMailingList } from '../server/mailingList.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await subscribeToMailingList(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[subscribe]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Subscription failed.',
    });
  }
}
