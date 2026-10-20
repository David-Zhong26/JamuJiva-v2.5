import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {
  createCheckoutSession,
  createPrelaunchCheckout,
  getDeliveryZipsPayload,
  getHealthPayload,
  getStripe,
} from './shopApi.mjs';
import { subscribeToMailingList } from './mailingList.mjs';
import { getPrelaunchProgress } from './prelaunch.mjs';
import {
  checkAdminAuth,
  createEvent,
  deleteEvent,
  listEvents,
} from './eventsApi.mjs';
import {
  claimGuestOrders,
  decideAddressRequest,
  isOrdersAdmin,
  listAdminOrders,
  requestAddressChange,
  syncCheckoutSession,
  updateFulfillment,
} from './ordersApi.mjs';
import { handleStripeWebhook } from './stripeWebhook.mjs';
import { deleteSignedInUser } from './supabaseAuth.mjs';

const PORT = Number(process.env.API_PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[api] STRIPE_SECRET_KEY missing — checkout will fail until .env is configured.');
}

const app = express();
app.use(cors({ origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'] }));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const result = await handleStripeWebhook({
      rawBody: req.body,
      signature: req.headers['stripe-signature'],
      stripe: getStripe(),
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[stripe webhook]', err);
    return res.status(500).json({ error: 'Webhook failed.' });
  }
});

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json(getHealthPayload());
});

app.get('/api/delivery-zips', (_req, res) => {
  res.json(getDeliveryZipsPayload());
});

app.post('/api/checkout', async (req, res) => {
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
});

app.post('/api/orders/sync', async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ error: 'Stripe is not configured on the server.' });
    const result = await syncCheckoutSession(req.body?.sessionId, stripe);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders sync]', err);
    return res.status(500).json({ error: 'Could not sync the Stripe payment.' });
  }
});

app.post('/api/orders/claim', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const result = await claimGuestOrders(token);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders claim]', err);
    return res.status(500).json({ error: 'Could not link guest orders.' });
  }
});

app.post('/api/account/delete', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const result = await deleteSignedInUser(token, req.body?.confirmation);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[account delete]', err);
    return res.status(500).json({ error: 'Could not delete this account.' });
  }
});

app.post('/api/orders/address-request', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const result = await requestAddressChange(token, req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders address]', err);
    return res.status(500).json({ error: 'Could not request an address change.' });
  }
});

app.get('/api/orders/admin', async (req, res) => {
  try {
    if (!isOrdersAdmin(req)) return res.status(401).json({ error: 'Unauthorized.' });
    const result = await listAdminOrders();
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders admin]', err);
    return res.status(500).json({ error: 'Could not load orders.' });
  }
});

app.post('/api/orders/admin', async (req, res) => {
  try {
    if (!isOrdersAdmin(req)) return res.status(401).json({ error: 'Unauthorized.' });
    const result = req.body?.action === 'address'
      ? await decideAddressRequest(req.body)
      : await updateFulfillment(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[orders admin]', err);
    return res.status(500).json({ error: 'Could not update the order.' });
  }
});

app.get('/api/prelaunch', async (req, res) => {
  try {
    const result = await getPrelaunchProgress(String(req.query.product || ''));
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[prelaunch]', err);
    return res.status(500).json({ error: 'Could not load pre-launch progress.' });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const result = await subscribeToMailingList(req.body, token);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[subscribe]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Subscription failed.',
    });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const includePast = String(req.query.includePast || '') === '1';
    const result = await listEvents({ includePast });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[events list]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to load events.',
      events: null,
    });
  }
});

app.post('/api/events/admin/login', (req, res) => {
  try {
    const password = String(req.body?.password || '');
    req.headers['x-events-admin'] = password;
    const result = checkAdminAuth(req);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[events admin login]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Login failed.',
    });
  }
});

app.get('/api/events/admin', async (req, res) => {
  try {
    const auth = checkAdminAuth(req);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);
    const result = await listEvents({ includePast: true });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[events admin list]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to load events.',
      events: null,
    });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const result = await createEvent(req);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[events create]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to create event.',
    });
  }
});

app.delete('/api/events/:eventId', async (req, res) => {
  try {
    const result = await deleteEvent(req, req.params.eventId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[events delete]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to delete event.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT}`);
});
