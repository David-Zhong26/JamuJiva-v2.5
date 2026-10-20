import { getPrelaunchProgress, FIRST_PRELAUNCH_BATCH } from '../server/prelaunch.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const product = String(req.query.product || FIRST_PRELAUNCH_BATCH);
    const result = await getPrelaunchProgress(product);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[prelaunch]', err);
    return res.status(500).json({ error: 'Could not load pre-launch progress.' });
  }
}
