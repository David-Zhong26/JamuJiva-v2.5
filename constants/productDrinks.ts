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
    background: 'from-[#8C3F1F] via-[#8C3F1F] to-[#8C3F1F]',
    accent: '#8A4F12',
    textColor: '#FFF8EE',
    bodyColor: 'rgba(255, 248, 238, 0.92)',
    buttonBg: '#F6F1E8',
    buttonText: '#6F2E1E',
    buttonBorder: 'rgba(246, 241, 232, 0.9)',
    cardTint: 'bg-[#F6C56A]',
    backgroundGradient: 'linear-gradient(135deg, #8C3F1F 0%, #8C3F1F 100%)',
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
    background: 'from-[#F6F1E8] via-[#F6F1E8] to-[#F6F1E8]',
    backgroundGradient: 'linear-gradient(135deg, #F6F1E8 0%, #F6F1E8 100%)',
    accent: '#1A3D5C',
    textColor: '#1A3D5C',
    bodyColor: 'rgba(26, 61, 92, 0.92)',
    buttonBg: '#1A3D5C',
    buttonText: '#F6F1E8',
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
