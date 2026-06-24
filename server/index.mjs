import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {
  createCheckoutSession,
  getDeliveryZipsPayload,
  getHealthPayload,
} from './shopApi.mjs';
import { subscribeToMailingList } from './mailingList.mjs';

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

app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT}`);
});
