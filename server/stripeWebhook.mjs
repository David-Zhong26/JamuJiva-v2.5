import Stripe from 'stripe';
import { applyStripeEvent } from './ordersApi.mjs';

export async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  if (req.body && typeof req.body === 'object') return null;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function handleStripeWebhook({ rawBody, signature, stripe, webhookSecret }) {
  if (!webhookSecret) {
    return { status: 503, body: { error: 'Stripe webhook secret is not configured.' } };
  }
  if (!rawBody || !signature) {
    return { status: 400, body: { error: 'Missing Stripe signature.' } };
  }

  let event;
  try {
    const verifier = stripe || new Stripe('sk_test_signature_only');
    event = verifier.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe webhook] signature', err instanceof Error ? err.message : err);
    return { status: 400, body: { error: 'Invalid Stripe signature.' } };
  }

  if (!stripe) {
    return { status: 503, body: { error: 'Stripe is not configured on the server.' } };
  }

  return applyStripeEvent(event, stripe);
}
