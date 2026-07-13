import Stripe from 'stripe';

const PRODUCT_ENV_KEYS = {
  golden: ['STRIPE_PRODUCT_GOLDEN', 'STRIPE_PRICE_GOLDEN'],
  spiced: ['STRIPE_PRODUCT_SPICED', 'STRIPE_PRICE_SPICED'],
  mixed_duo: ['STRIPE_PRODUCT_MIXED_DUO', 'STRIPE_PRICE_MIXED_DUO'],
  mixed_four: [
    'STRIPE_PRODUCT_MIXED_FOUR',
    'STRIPE_PRICE_MIXED_FOUR',
    'STRIPE_PRODUCT_TWO_MIXED_DUO',
    'STRIPE_PRICE_TWO_MIXED_DUO',
  ],
  two_golden: ['STRIPE_PRODUCT_TWO_GOLDEN', 'STRIPE_PRICE_TWO_GOLDEN'],
  two_spiced: ['STRIPE_PRODUCT_TWO_SPICED', 'STRIPE_PRICE_TWO_SPICED'],
  four_golden: [
    'STRIPE_PRODUCT_FOUR_GOLDEN',
    'STRIPE_PRICE_FOUR_GOLDEN',
    'STRIPE_PRODUCT_Four_GOLDEN',
    'STRIPE_PRICE_Four_GOLDEN',
  ],
  four_spiced: [
    'STRIPE_PRODUCT_FOUR_SPICED',
    'STRIPE_PRICE_FOUR_SPICED',
    'STRIPE_PRODUCT_Four_SPICED',
    'STRIPE_PRICE_Four_SPICED',
  ],
};

const PRODUCT_LABELS = {
  golden: 'Golden Glow — 1 Bottle',
  spiced: 'Spiced Ivory — 1 Bottle',
  mixed_duo: 'Mixed Duo',
  mixed_four: 'Mixed Four Pack',
  two_golden: 'Golden Glow — 2 Bottles',
  two_spiced: 'Spiced Ivory — 2 Bottles',
  four_golden: 'Golden Glow — 4 Bottles',
  four_spiced: 'Spiced Ivory — 4 Bottles',
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

function calculateOnlineOrderFee(subtotalCents) {
  const percentageFee = 0.029;
  const fixedFeeCents = 30;

  return Math.ceil((subtotalCents + fixedFeeCents) / (1 - percentageFee) - subtotalCents);
}

async function resolvePriceInfo(stripe, productKey) {
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
  let unitAmountCents;

  if (stripeRef.startsWith('price_')) {
    const price = await stripe.prices.retrieve(stripeRef);
    priceId = stripeRef;
    unitAmountCents = price.unit_amount;
  } else if (stripeRef.startsWith('prod_')) {
    const product = await stripe.products.retrieve(stripeRef, { expand: ['default_price'] });
    const defaultPrice = product.default_price;

    if (!defaultPrice) {
      throw new Error(
        `${label}: Stripe product ${stripeRef} has no default price. Add a price in Stripe Dashboard.`
      );
    }

    priceId = typeof defaultPrice === 'string' ? defaultPrice : defaultPrice.id;
    unitAmountCents = typeof defaultPrice === 'string' ? null : defaultPrice.unit_amount;
  } else {
    throw new Error(
      `${label}: expected prod_... or price_... in .env, got "${stripeRef}".`
    );
  }

  if (!Number.isInteger(unitAmountCents)) {
    throw new Error(`${label}: Stripe price is missing a valid unit amount.`);
  }

  const priceInfo = { priceId, unitAmountCents };
  priceCache.set(stripeRef, priceInfo);
  return priceInfo;
}

function isZipEligible(zip, deliveryZips) {
  const normalized = String(zip || '').trim();
  return deliveryZips.includes(normalized);
}

function buildCheckoutCustomFields(isPickup = false) {
  const fields = [
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
  ];

  if (!isPickup) {
    fields.push({
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
    });
  }

  fields.push({
    key: 'additional_notes',
    label: { type: 'custom', custom: 'Additional notes' },
    type: 'text',
    text: { maximum_length: 150 },
    optional: true,
  });

  return fields;
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
  const { items, zip, fulfillmentType, accessLabel } = body ?? {};
  const isPickup = fulfillmentType === 'pickup';

  if (!isPickup && !isZipEligible(zip, deliveryZips)) {
    return { status: 400, body: { error: 'Delivery is not available for this ZIP code yet.' } };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { status: 400, body: { error: 'Cart is empty.' } };
  }

  const line_items = [];
  let subtotalCents = 0;
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
      const { priceId, unitAmountCents } = await resolvePriceInfo(stripe, productId);
      subtotalCents += unitAmountCents * qty;
      line_items.push({ price: priceId, quantity: qty });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid Stripe product config.';
      return { status: 400, body: { error: message } };
    }
  }

  const onlineOrderFeeCents = calculateOnlineOrderFee(subtotalCents);
  if (!isPickup && onlineOrderFeeCents > 0) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: onlineOrderFeeCents,
      },
      quantity: 1,
    });
  }

  const sessionConfig = {
    mode: 'payment',
    line_items,
    success_url: `${clientUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/shop/cancel`,
    allow_promotion_codes: true,
    custom_fields: buildCheckoutCustomFields(isPickup),
    metadata: {
      delivery_zip: String(zip ?? '').trim(),
      fulfillment_type: isPickup ? 'pickup' : 'delivery',
      pickup_location: isPickup ? String(accessLabel ?? 'NY Indonesian Food Bazaar') : '',
      source: 'jamu-jiva-shop',
    },
    ...(isPickup
      ? {}
      : {
          shipping_address_collection: { allowed_countries: ['US'] },
          custom_text: {
            shipping_address: {
              message:
                'Local delivery is available in select Massachusetts ZIP codes. Tell us what days or time ranges work best — we will contact you to confirm your final delivery date and time. E.g. weekday evenings after 5 PM, Saturday afternoon, Sunday morning.',
            },
          },
        }),
  };

  const session = await stripe.checkout.sessions.create(sessionConfig);

  return { status: 200, body: { url: session.url } };
}
