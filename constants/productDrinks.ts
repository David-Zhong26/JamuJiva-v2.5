import modelMint from '../materials/model mint.png';
import modelGinger from '../materials/model ginger.png';
import ginger1 from '../materials/ginger 1.png';
import ginger2 from '../materials/ginger 2.png';
import mint1 from '../materials/mint 1.png';
import mint2 from '../materials/mint 2.png';

export const PRODUCT_DRINKS = [
  {
    slug: 'bali-gold' as const,
    name: 'Bali Gold',
    shortLabel: 'Bali Gold',
    eyebrow: 'Ginger-rooted daily glow',
    description: 'A bright, grounding Jamu blend with golden spice warmth and clean natural energy.',
    word: 'gold',
    background: 'from-[#EB9C35] via-[#F0B154] to-[#E7A243]',
    accent: '#8A4F12',
    textColor: '#FFF8EE',
    bodyColor: 'rgba(255, 248, 238, 0.92)',
    buttonBg: '#2D4F3E',
    buttonText: '#F5E8CA',
    buttonBorder: 'rgba(45, 79, 62, 0.24)',
    cardTint: 'bg-[#F6C56A]',
    badge: 'Best seller' as const,
    priceOneTime: 40,
    priceSubscribe: 34,
    perUnit: '$2.83 per bottle',
    thumb: modelGinger,
    elements: [
      { src: modelGinger, className: 'left-[-2%] top-[8%] w-[13rem] md:w-[17rem] lg:w-[19rem] rotate-[-14deg]' },
      { src: ginger1, className: 'left-[8%] bottom-[14%] w-[9rem] md:w-[12rem] lg:w-[14rem] rotate-[8deg]' },
      { src: ginger2, className: 'right-[4%] top-[14%] w-[10rem] md:w-[13rem] lg:w-[15rem] rotate-[14deg]' },
    ],
  },
  {
    slug: 'mint-reset' as const,
    name: 'Mint Reset',
    shortLabel: 'Mint Reset',
    eyebrow: 'Cooling herbal clarity',
    description: 'Fresh mint notes meet a light herbal finish for an easy, refreshing ritual.',
    word: 'mint',
    background: 'from-[#4E7145] via-[#648858] to-[#567A4A]',
    accent: '#EAF2D8',
    textColor: '#F5F2ED',
    bodyColor: 'rgba(245, 242, 237, 0.9)',
    buttonBg: '#F5F2ED',
    buttonText: '#2D4F3E',
    buttonBorder: 'rgba(245, 242, 237, 0.35)',
    cardTint: 'bg-[#C8E0B8]',
    priceOneTime: 40,
    priceSubscribe: 34,
    perUnit: '$2.83 per bottle',
    thumb: modelMint,
    elements: [
      { src: modelMint, className: 'left-[-1%] top-[10%] w-[12rem] md:w-[16rem] lg:w-[18rem] rotate-[-10deg]' },
      { src: mint1, className: 'left-[10%] bottom-[12%] w-[8rem] md:w-[10rem] lg:w-[12rem] rotate-[10deg]' },
      { src: mint2, className: 'right-[5%] top-[16%] w-[8rem] md:w-[11rem] lg:w-[13rem] rotate-[18deg]' },
    ],
  },
] as const;

export type ProductDrink = (typeof PRODUCT_DRINKS)[number];
