import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import Stripe from 'stripe';

const PORT = Number(process.env.API_PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const PRODUCT_ENV_KEYS = {
  golden: ['STRIPE_PRODUCT_GOLDEN', 'STRIPE_PRICE_GOLDEN'],
  spiced: ['STRIPE_PRODUCT_SPICED', 'STRIPE_PRICE_SPICED'],
  mixed_duo: ['STRIPE_PRODUCT_MIXED_DUO', 'STRIPE_PRICE_MIXED_DUO'],
  two_golden: ['STRIPE_PRODUCT_TWO_GOLDEN', 'STRIPE_PRICE_TWO_GOLDEN'],
  two_spiced: ['STRIPE_PRODUCT_TWO_SPICED', 'STRIPE_PRICE_TWO_SPICED'],
};

const PRODUCT_LABELS = {
  golden: 'Golden Glow — 1 Bottle',
  spiced: 'Spiced Ivory — 1 Bottle',
  mixed_duo: 'Mixed Duo',
  two_golden: 'Golden Glow — 2 Bottles',
  two_spiced: 'Spiced Ivory — 2 Bottles',
};

function getStripeRef(productKey) {
  const keys = PRODUCT_ENV_KEYS[productKey] ?? [];
  for (const envKey of keys) {
    if (process.env[envKey]) return process.env[envKey];
  }
  return null;
}

const deliveryZips = (process.env.DELIVERY_ZIPS || '')
  .split(',')
  .map((z) => z.trim())
  .filter(Boolean);

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[api] STRIPE_SECRET_KEY missing — checkout will fail until .env is configured.');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
app.use(cors({ origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());

const priceCache = new Map();

async function resolvePriceId(productKey) {
  if (!stripe) throw new Error('Stripe is not configured.');

  const label = PRODUCT_LABELS[productKey] ?? productKey;
  const envKeys = PRODUCT_ENV_KEYS[productKey] ?? [];
  const stripeRef = getStripeRef(productKey);
  if (!stripeRef) {
    throw new Error(
      `Missing Stripe config for "${label}" (${envKeys.join(' or ')} in .env).`
    );
  }

  if (priceCache.has(stripeRef)) {
    return priceCache.get(stripeRef);
  }

  let priceId;

  if (stripeRef.startsWith('price_')) {
    await stripe.prices.retrieve(stripeRef);
    priceId = stripeRef;
  } else if (stripeRef.startsWith('prod_')) {
    const product = await stripe.products.retrieve(stripeRef, { expand: ['default_price'] });
    const defaultPrice = product.default_price;

    if (!defaultPrice) {
      throw new Error(
        `${label}: Stripe product ${stripeRef} has no default price. Add a price in Stripe Dashboard.`
      );
    }

    priceId = typeof defaultPrice === 'string' ? defaultPrice : defaultPrice.id;
  } else {
    throw new Error(
      `${label}: expected prod_... or price_... in .env, got "${stripeRef}".`
    );
  }

  priceCache.set(stripeRef, priceId);
  return priceId;
}

function isZipEligible(zip) {
  const normalized = String(zip || '').trim();
  return deliveryZips.includes(normalized);
}

function buildCheckoutCustomFields() {
  return [
    {
      key: 'delivery_date',
      label: {
        type: 'custom',
        custom: 'Preferred dates (mm/dd/yy - mm/dd/yy)',
      },
      type: 'text',
      text: { maximum_length: 80 },
      optional: false,
    },
    {
      key: 'delivery_time',
      label: { type: 'custom', custom: 'Preferred delivery time' },
      type: 'dropdown',
      dropdown: {
        options: [
          { label: '10:00 AM–1:00 PM', value: '10am1pm' },
          { label: '1:00 PM–4:00 PM', value: '1pm4pm' },
          { label: '4:00 PM–7:00 PM', value: '4pm7pm' },
          { label: 'Flexible — contact me', value: 'flexible' },
        ],
      },
      optional: false,
    },
    {
      key: 'additional_notes',
      label: { type: 'custom', custom: 'Additional notes' },
      type: 'text',
      text: { maximum_length: 150 },
      optional: true,
    },
  ];
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    stripe: Boolean(stripe),
    deliveryZipCount: deliveryZips.length,
  });
});

app.get('/api/delivery-zips', (_req, res) => {
  res.json({ zips: deliveryZips });
});

app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured on the server.' });
    }

    const { items, zip } = req.body ?? {};

    if (!isZipEligible(zip)) {
      return res.status(400).json({ error: 'Delivery is not available for this ZIP code yet.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const line_items = [];
    for (const item of items) {
      const { productId, quantity } = item;
      if (!getStripeRef(productId)) {
        return res.status(400).json({ error: `Unknown product: ${productId}` });
      }
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ error: 'Invalid quantity.' });
      }
      try {
        const price = await resolvePriceId(productId);
        line_items.push({ price, quantity: qty });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid Stripe product config.';
        return res.status(400).json({ error: message });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${CLIENT_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/shop/cancel`,
      shipping_address_collection: { allowed_countries: ['US'] },
      custom_fields: buildCheckoutCustomFields(),
      custom_text: {
        shipping_address: {
          message:
            'Local delivery is available in select Massachusetts ZIP codes. Tell us what days or time ranges work best — we will contact you to confirm your final delivery date and time. E.g. weekday evenings after 5 PM, Saturday afternoon, Sunday morning.',
        },
      },
      metadata: {
        delivery_zip: String(zip).trim(),
        source: 'jamu-jiva-shop',
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Checkout failed.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT}`);
});
