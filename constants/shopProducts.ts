import goldenGlowBottle from '../materials/golden glow bottle.png';
import spicedIvoryBottle from '../materials/spiced ivory bottle.png';
import bestSellerBottles from '../materials/best seller bottles.png';

/** Stripe cart line IDs (maps to server checkout) */
export const SHOP_PRODUCT_IDS = [
  'golden',
  'two_golden',
  'spiced',
  'two_spiced',
  'mixed_duo',
] as const;

export type ShopProductId = (typeof SHOP_PRODUCT_IDS)[number];

export type ShopProduct = {
  id: ShopProductId;
  name: string;
  variantLabel: string;
  description: string;
  image: string;
  price: number;
};

export const SHOP_SINGLE_BOTTLE_PRICE = 5;
export const SHOP_TWIN_PACK_PRICE = 8;
export const SHOP_COMBO_PRICE = 8;
export const SHOP_BOTTLE_SIZE = '8 oz';

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'golden',
    name: 'Golden Glow',
    variantLabel: '1 bottle (8 oz)',
    description: 'Turmeric rooted daily glow.',
    image: goldenGlowBottle,
    price: SHOP_SINGLE_BOTTLE_PRICE,
  },
  {
    id: 'two_golden',
    name: 'Golden Glow',
    variantLabel: '2 bottles (8 oz each)',
    description: 'Turmeric rooted daily glow — twin pack.',
    image: goldenGlowBottle,
    price: SHOP_TWIN_PACK_PRICE,
  },
  {
    id: 'spiced',
    name: 'Spiced Ivory',
    variantLabel: '1 bottle (8 oz)',
    description: 'Ginger vanilla spiced.',
    image: spicedIvoryBottle,
    price: SHOP_SINGLE_BOTTLE_PRICE,
  },
  {
    id: 'two_spiced',
    name: 'Spiced Ivory',
    variantLabel: '2 bottles (8 oz each)',
    description: 'Ginger vanilla spiced — twin pack.',
    image: spicedIvoryBottle,
    price: SHOP_TWIN_PACK_PRICE,
  },
  {
    id: 'mixed_duo',
    name: 'Best of Both',
    variantLabel: '1 Golden Glow + 1 Spiced Ivory (8 oz each)',
    description: 'One of each flavor.',
    image: bestSellerBottles,
    price: SHOP_COMBO_PRICE,
  },
];

export type ShopGroupId = 'golden_glow' | 'spiced_ivory' | 'mixed';

export type ShopGroup = {
  id: ShopGroupId;
  slug: string;
  name: string;
  badge?: 'Best seller';
  eyebrow: string;
  description: string;
  image: string;
  /** Product IDs for each selectable option */
  options: { label: string; productId: ShopProductId; price: number; compareAtPrice?: number }[];
};

export const SHOP_GROUPS: ShopGroup[] = [
  {
    id: 'golden_glow',
    slug: 'golden-glow',
    name: 'Golden Glow',
    eyebrow: '',
    description:
      'A bright blend of turmeric and tamarind with a zesty lime finish and a touch of salt to spark your day.',
    image: goldenGlowBottle,
    options: [
      { label: `1 Bottle (${SHOP_BOTTLE_SIZE})`, productId: 'golden', price: SHOP_SINGLE_BOTTLE_PRICE },
      {
        label: `2 Bottles (${SHOP_BOTTLE_SIZE} each)`,
        productId: 'two_golden',
        price: SHOP_TWIN_PACK_PRICE,
        compareAtPrice: SHOP_SINGLE_BOTTLE_PRICE * 2,
      },
    ],
  },
  {
    id: 'spiced_ivory',
    slug: 'spiced-ivory',
    name: 'Spiced Ivory',
    eyebrow: '',
    description:
      'A creamy, grounding blend of vanilla and rice with the fiery warmth of galangal and ginger.',
    image: spicedIvoryBottle,
    options: [
      { label: `1 Bottle (${SHOP_BOTTLE_SIZE})`, productId: 'spiced', price: SHOP_SINGLE_BOTTLE_PRICE },
      {
        label: `2 Bottles (${SHOP_BOTTLE_SIZE} each)`,
        productId: 'two_spiced',
        price: SHOP_TWIN_PACK_PRICE,
        compareAtPrice: SHOP_SINGLE_BOTTLE_PRICE * 2,
      },
    ],
  },
  {
    id: 'mixed',
    slug: 'mixed-duo',
    name: 'Best of Both',
    badge: 'Best seller',
    eyebrow: '',
    description: 'One Golden Glow and one Spiced Ivory.',
    image: bestSellerBottles,
    options: [
      {
        label: `1 Golden Glow + 1 Spiced Ivory (${SHOP_BOTTLE_SIZE} each)`,
        productId: 'mixed_duo',
        price: SHOP_COMBO_PRICE,
      },
    ],
  },
];

export const SHOP_FLAVOR_GROUPS = SHOP_GROUPS.filter((g) => g.id !== 'mixed');

export const SHOP_COMBO_GROUP = SHOP_GROUPS.find((g) => g.id === 'mixed')!;

export const shopGroupBySlug = (slug: string): ShopGroup | undefined =>
  SHOP_GROUPS.find((g) => g.slug === slug);

export const shopProductById = (id: ShopProductId): ShopProduct =>
  SHOP_PRODUCTS.find((p) => p.id === id)!;

export const shopGroupDisplayPrice = (group: ShopGroup): number =>
  group.id === 'mixed' ? SHOP_COMBO_PRICE : SHOP_SINGLE_BOTTLE_PRICE;

export const shopGroupSizeLabel = (group: ShopGroup, variant: 'card' | 'product' = 'card') => {
  if (group.id === 'mixed') {
    return variant === 'product'
      ? `2 x ${SHOP_BOTTLE_SIZE} bottles`
      : `2 x ${SHOP_BOTTLE_SIZE}`;
  }
  return variant === 'product' ? `${SHOP_BOTTLE_SIZE} per bottle` : SHOP_BOTTLE_SIZE;
};

export const SHOP_BOTTLE_SIZE_CLASS =
  'text-xs font-black uppercase tracking-widest text-[#2D4F3E]/55';

export const cartLineTitle = (productId: ShopProductId) => {
  const p = shopProductById(productId);
  return `${p.name} — ${p.variantLabel}`;
};

export const formatShopPrice = (amount: number) =>
  `$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;

export const cartLineTotal = (productId: ShopProductId, quantity: number) =>
  shopProductById(productId).price * quantity;
