import modelMint from '../materials/model mint.png';
import modelGinger from '../materials/model ginger.png';
import ginger1 from '../materials/ginger 1.png';
import ginger2 from '../materials/ginger 2.png';
import mint1 from '../materials/mint 1.png';
import mint2 from '../materials/mint 2.png';
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
    thumb: modelGinger,
    elements: [
      { src: modelGinger, className: 'left-[-2%] top-[8%] w-[13rem] md:w-[17rem] lg:w-[19rem] rotate-[-14deg]' },
      { src: ginger1, className: 'left-[8%] bottom-[14%] w-[9rem] md:w-[12rem] lg:w-[14rem] rotate-[8deg]' },
      { src: ginger2, className: 'right-[4%] top-[14%] w-[10rem] md:w-[13rem] lg:w-[15rem] rotate-[14deg]' },
    ],
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
    thumb: modelMint,
    elements: [
      { src: modelMint, className: 'left-[-1%] top-[10%] w-[12rem] md:w-[16rem] lg:w-[18rem] rotate-[-10deg]' },
      { src: mint1, className: 'left-[10%] bottom-[12%] w-[8rem] md:w-[10rem] lg:w-[12rem] rotate-[10deg]' },
      { src: mint2, className: 'right-[5%] top-[16%] w-[8rem] md:w-[11rem] lg:w-[13rem] rotate-[18deg]' },
    ],
  },
] as const;

export type ProductDrink = (typeof PRODUCT_DRINKS)[number];
