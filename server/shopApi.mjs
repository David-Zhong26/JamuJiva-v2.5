import Stripe from 'stripe';

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

function getDeliveryZips() {
  return (process.env.DELIVERY_ZIPS || '')
    .split(',')
    .map((z) => z.trim())
    .filter(Boolean);
}

function getClientUrl() {
  return process.env.CLIENT_URL || 'http://localhost:3000';
}

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const priceCache = new Map();

async function resolvePriceId(stripe, productKey) {
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

function isZipEligible(zip, deliveryZips) {
  const normalized = String(zip || '').trim();
  return deliveryZips.includes(normalized);
}

function buildCheckoutCustomFields() {
  return [
    {
      key: 'phone_number',
      label: {
        type: 'custom',
        custom: 'Phone number',
      },
      type: 'text',
      text: { maximum_length: 20 },
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

export function getHealthPayload() {
  const deliveryZips = getDeliveryZips();
  return {
    ok: true,
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    deliveryZipCount: deliveryZips.length,
  };
}

export function getDeliveryZipsPayload() {
  return { zips: getDeliveryZips() };
}

export async function createCheckoutSession(body) {
  const stripe = getStripe();
  if (!stripe) {
    return { status: 503, body: { error: 'Stripe is not configured on the server.' } };
  }

  const deliveryZips = getDeliveryZips();
  const clientUrl = getClientUrl();
  const { items, zip } = body ?? {};

  if (!isZipEligible(zip, deliveryZips)) {
    return { status: 400, body: { error: 'Delivery is not available for this ZIP code yet.' } };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { status: 400, body: { error: 'Cart is empty.' } };
  }

  const line_items = [];
  for (const item of items) {
    const { productId, quantity } = item;
    if (!getStripeRef(productId)) {
      return { status: 400, body: { error: `Unknown product: ${productId}` } };
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return { status: 400, body: { error: 'Invalid quantity.' } };
    }
    try {
      const price = await resolvePriceId(stripe, productId);
      line_items.push({ price, quantity: qty });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid Stripe product config.';
      return { status: 400, body: { error: message } };
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${clientUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/shop/cancel`,
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

  return { status: 200, body: { url: session.url } };
}
