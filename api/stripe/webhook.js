import { getStripe } from '../../server/shopApi.mjs';
import { handleStripeWebhook, readRawBody } from '../../server/stripeWebhook.mjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await readRawBody(req);
    const result = await handleStripeWebhook({
      rawBody,
      signature: req.headers['stripe-signature'],
      stripe: getStripe(),
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[stripe webhook]', err);
    return res.status(500).json({ error: 'Webhook failed.' });
  }
}
