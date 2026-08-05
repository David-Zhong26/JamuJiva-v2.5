import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {
  createCheckoutSession,
  getDeliveryZipsPayload,
  getHealthPayload,
} from './shopApi.mjs';
import { subscribeToMailingList } from './mailingList.mjs';
import {
  checkAdminAuth,
  createEvent,
  deleteEvent,
  listEvents,
} from './eventsApi.mjs';

const PORT = Number(process.env.API_PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[api] STRIPE_SECRET_KEY missing — checkout will fail until .env is configured.');
}

const app = express();
app.use(cors({ origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json(getHealthPayload());
});

app.get('/api/delivery-zips', (_req, res) => {
  res.json(getDeliveryZipsPayload());
});

app.post('/api/checkout', async (req, res) => {
  try {
    const result = await createCheckoutSession(req.body);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[checkout]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Checkout failed.',
    });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const result = await subscribeToMailingList(req.body);
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
