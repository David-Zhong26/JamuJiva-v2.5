import goldenGlowBottle from '../materials/golden glow bottle transparent.png';
import spicedIvoryBottle from '../materials/spiced ivory bottle transparent.png';

export const PRODUCT_DRINKS = [
  {
    slug: 'bali-gold' as const,
    name: 'Golden Glow',
    shortLabel: 'Golden Glow',
    eyebrow: 'Turmeric rooted daily glow',
    bottleSize: '8 oz',
    description:
      'Blend of turmeric and tamarind with a zesty lime finish and a touch of salt to spark your day.',
    descriptionDesktop:
      'A bright blend of turmeric and tamarind with a zesty lime finish and a touch of salt to spark your day.',
    word: 'gold',
    background: 'from-[#EB9C35] via-[#F0B154] to-[#E7A243]',
    accent: '#8A4F12',
    textColor: '#FFF8EE',
    bodyColor: 'rgba(255, 248, 238, 0.92)',
    buttonBg: '#2D4F3E',
    buttonText: '#F5E8CA',
    buttonBorder: 'rgba(45, 79, 62, 0.24)',
    cardTint: 'bg-[#F6C56A]',
    backgroundGradient: 'linear-gradient(135deg, #EB9C35 0%, #F0B154 45%, #E7A243 100%)',
    badge: 'Best seller' as const,
    priceOneTime: 40,
    priceSubscribe: 34,
    perUnit: '$2.83 per bottle',
    bottleImage: goldenGlowBottle,
    thumb: goldenGlowBottle,
    elements: [],
  },
  {
    slug: 'spiced-ivory' as const,
    name: 'Spiced Ivory',
    shortLabel: 'Spiced Ivory',
    eyebrow: 'Ginger vanilla spiced',
    bottleSize: '8 oz',
    description:
      'A creamy, grounding blend of vanilla and rice with the fiery warmth of galangal and ginger.',
    word: 'ivory',
    background: 'from-[#D1EAF5] via-[#C8E6F4] to-[#BFE0F0]',
    backgroundGradient: 'linear-gradient(135deg, #D1EAF5 0%, #C8E6F4 45%, #B8DDF0 100%)',
    accent: '#1A3D5C',
    textColor: '#1A3D5C',
    bodyColor: 'rgba(26, 61, 92, 0.92)',
    buttonBg: '#1A3D5C',
    buttonText: '#F5F2ED',
    buttonBorder: 'rgba(26, 61, 92, 0.2)',
    cardTint: 'bg-[#D1EAF5]',
    priceOneTime: 40,
    priceSubscribe: 34,
    perUnit: '$2.83 per bottle',
    bottleImage: spicedIvoryBottle,
    thumb: spicedIvoryBottle,
    elements: [],
  },
] as const;

export type ProductDrink = (typeof PRODUCT_DRINKS)[number];
