export type ShirtSize = 'S' | 'M' | 'L' | 'XL';
export type FitType = 'Slim' | 'Regular' | 'Relaxed' | 'Oversized';

export interface ShirtColorOption {
  name: string;
  hex: string;
  image: string;
  secondaryImage: string;
  stock: Record<ShirtSize, number>;
}

export interface ShirtProduct {
  id: string;
  handle: string;
  title: string;
  type: 'Casual Shirt' | 'T-Shirt' | 'Linen Shirt' | 'Formal Shirt' | 'Polo' | 'Graphic Tee';
  collectionHandles: string[];
  price: number;
  compareAtPrice?: number;
  fit: FitType;
  fabric: string;
  gsm: string;
  mill: string;
  modelInfo: string;
  skuPrefix: string;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  fabricCare: string;
  pairedHandle: string;
  colors: ShirtColorOption[];
}

export interface ShirtCollection {
  handle: string;
  code: string;
  title: string;
  description: string;
  image: string;
  layoutSpan: 'wide' | 'narrow' | 'third';
}

export const STUDIO_MEDIA = {
  heroRack: 'https://images.pexels.com/photos/8346031/pexels-photo-8346031.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800',
  atelierPatterns: 'https://images.pexels.com/photos/4614197/pexels-photo-4614197.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400',
  textileRolls: 'https://images.pexels.com/photos/3965543/pexels-photo-3965543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400',
  rackMinimal: 'https://images.pexels.com/photos/9594682/pexels-photo-9594682.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400',
  whiteHanger: 'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  stoneHanger: 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  navyHanger: 'https://images.pexels.com/photos/22441317/pexels-photo-22441317.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  sageHanger: 'https://images.pexels.com/photos/9594940/pexels-photo-9594940.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelWhiteShirt: 'https://images.pexels.com/photos/8346219/pexels-photo-8346219.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelBackWhite: 'https://images.pexels.com/photos/7752618/pexels-photo-7752618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelWhiteTee: 'https://images.pexels.com/photos/9775825/pexels-photo-9775825.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelSideTee: 'https://images.pexels.com/photos/9775824/pexels-photo-9775824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelOliveShirt: 'https://images.pexels.com/photos/8063387/pexels-photo-8063387.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelChairShirt: 'https://images.pexels.com/photos/8063388/pexels-photo-8063388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelMonoShirt: 'https://images.pexels.com/photos/11628050/pexels-photo-11628050.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelStriped: 'https://images.pexels.com/photos/15299312/pexels-photo-15299312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelStudioCasual: 'https://images.pexels.com/photos/32321524/pexels-photo-32321524.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
  modelPoisedBW: 'https://images.pexels.com/photos/11454746/pexels-photo-11454746.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=960',
};

export const COLLECTIONS: ShirtCollection[] = [
  {
    handle: 'oxford-casual',
    code: '01 / EVERYDAY TAILORING',
    title: 'Oxford & Casual Shirts',
    description: 'Two-ply Portuguese basketweave Oxfords and brushed chambrays drafted with unfused collar rolls.',
    image: STUDIO_MEDIA.whiteHanger,
    layoutSpan: 'wide',
  },
  {
    handle: 'heavyweight-tees',
    code: '02 / 240–260 GSM SUPIMA',
    title: 'Heavyweight T-Shirts',
    description: 'Opaque combed Supima and dry-hand organic cotton jersey tees with twin-needle bound collars.',
    image: STUDIO_MEDIA.modelWhiteTee,
    layoutSpan: 'narrow',
  },
  {
    handle: 'linen-resort',
    code: '03 / BELGIAN FLAX',
    title: 'Linen & Resort Shirts',
    description: 'Masters of Linen® certified European flax woven for high-summer airflow and relaxed structure.',
    image: STUDIO_MEDIA.stoneHanger,
    layoutSpan: 'third',
  },
  {
    handle: 'formal-poplin',
    code: '04 / TWO-PLY POPLIN',
    title: 'Formal Dress Shirts',
    description: '120/2 Egyptian cotton poplins from Bergamo with 22-SPI single-needle French side seams.',
    image: STUDIO_MEDIA.modelWhiteShirt,
    layoutSpan: 'third',
  },
  {
    handle: 'knit-polos',
    code: '05 / KNIT INTERLOCK',
    title: 'Architectural Polos',
    description: 'Mercerized double-knit cotton polos with tailored shirt-stand collars that hold crisp under blazers.',
    image: STUDIO_MEDIA.navyHanger,
    layoutSpan: 'third',
  },
];

export const SHIRTS: ShirtProduct[] = [
  {
    id: 'prod-1',
    handle: 'mercer-two-ply-oxford-shirt',
    title: 'Mercer Two-Ply Oxford Shirt',
    type: 'Casual Shirt',
    collectionHandles: ['all', 'oxford-casual'],
    price: 145,
    fit: 'Regular',
    fabric: 'Oxford',
    gsm: '165 GSM Organic Basketweave',
    mill: 'Somelos, Portugal',
    modelInfo: 'Model is 6\'1" (185 cm) and wears size M',
    skuPrefix: 'GRD-OXF',
    isBestseller: true,
    isNew: true,
    description:
      'Cut in our signature Regular block from 165 GSM Portuguese organic basketweave Oxford. Finished with an unfused soft button-down collar roll, split back yoke, single-needle 22-SPI side seams, and genuine 3.2mm Australian mother-of-pearl buttons.',
    fabricCare:
      '100% GOTS-certified organic long-staple cotton (165 GSM) woven in Santo Tirso, Portugal. Machine wash cold gentle, hang dry, warm steam or press.',
    pairedHandle: 'supima-240-heavyweight-tee',
    colors: [
      {
        name: 'Optic White',
        hex: '#FAFAFA',
        image: STUDIO_MEDIA.whiteHanger,
        secondaryImage: STUDIO_MEDIA.modelBackWhite,
        stock: { S: 14, M: 18, L: 3, XL: 9 },
      },
      {
        name: 'Oxford Blue',
        hex: '#7CA1C4',
        image: STUDIO_MEDIA.modelStriped,
        secondaryImage: STUDIO_MEDIA.modelChairShirt,
        stock: { S: 11, M: 16, L: 0, XL: 7 },
      },
    ],
  },
  {
    id: 'prod-2',
    handle: 'supima-240-heavyweight-tee',
    title: '240 GSM Supima Heavyweight Tee',
    type: 'T-Shirt',
    collectionHandles: ['all', 'heavyweight-tees'],
    price: 68,
    fit: 'Regular',
    fabric: 'Supima Cotton',
    gsm: '240 GSM Combed Jersey',
    mill: 'Barcelos, Portugal',
    modelInfo: 'Model is 6\'0" (183 cm) and wears size M',
    skuPrefix: 'GRD-TEE',
    isBestseller: true,
    description:
      'Architectural crewneck T-shirt knitted from long-staple two-ply US Supima cotton at 240 GSM for complete opacity and structure. Features a 24mm twin-stitched bound rib collar that never waves after laundering.',
    fabricCare:
      '100% American Supima extra-long-staple cotton knitted at 240 GSM. Pre-shrunk enzyme finish. Machine wash 30°C, reshape and dry flat.',
    pairedHandle: 'belgian-flax-linen-camp-shirt',
    colors: [
      {
        name: 'Washed Black',
        hex: '#242423',
        image: STUDIO_MEDIA.modelMonoShirt,
        secondaryImage: STUDIO_MEDIA.modelSideTee,
        stock: { S: 22, M: 25, L: 19, XL: 4 },
      },
      {
        name: 'White',
        hex: '#F7F7F5',
        image: STUDIO_MEDIA.modelWhiteTee,
        secondaryImage: STUDIO_MEDIA.modelSideTee,
        stock: { S: 15, M: 30, L: 12, XL: 0 },
      },
    ],
  },
  {
    id: 'prod-3',
    handle: 'belgian-flax-linen-camp-shirt',
    title: 'Belgian Flax Linen Camp Shirt',
    type: 'Linen Shirt',
    collectionHandles: ['all', 'linen-resort'],
    price: 138,
    compareAtPrice: 165,
    fit: 'Relaxed',
    fabric: 'Belgian Linen',
    gsm: '155 GSM European Flax',
    mill: 'Libeco, Belgium',
    modelInfo: 'Model is 6\'1" (185 cm) and wears size L',
    skuPrefix: 'GRD-LIN',
    isNew: true,
    description:
      'Relaxed summer shirting woven in Belgium from 100% Masters of Linen® certified flax. Features a clean one-piece camp collar without topstitching, straight hem with side vents, and aero-washed softness from day one.',
    fabricCare:
      '100% Masters of Linen® Belgian flax (155 GSM). Machine wash cold in laundry bag, hang dry in shade; wear relaxed or steam lightly.',
    pairedHandle: 'supima-240-heavyweight-tee',
    colors: [
      {
        name: 'Stone',
        hex: '#C8C2B6',
        image: STUDIO_MEDIA.stoneHanger,
        secondaryImage: STUDIO_MEDIA.modelChairShirt,
        stock: { S: 8, M: 14, L: 2, XL: 6 },
      },
      {
        name: 'Olive',
        hex: '#4B533E',
        image: STUDIO_MEDIA.modelOliveShirt,
        secondaryImage: STUDIO_MEDIA.sageHanger,
        stock: { S: 0, M: 10, L: 9, XL: 5 },
      },
    ],
  },
  {
    id: 'prod-4',
    handle: 'albini-120s-formal-poplin-shirt',
    title: 'Albini 120/2 Formal Poplin Shirt',
    type: 'Formal Shirt',
    collectionHandles: ['all', 'formal-poplin'],
    price: 175,
    fit: 'Slim',
    fabric: 'Poplin',
    gsm: '125 GSM 120/2 Poplin',
    mill: 'Cotonificio Albini, Italy',
    modelInfo: 'Model is 6\'1" (185 cm) and wears size M',
    skuPrefix: 'GRD-POP',
    isBestseller: true,
    description:
      'Tailored Slim dress shirt woven in Bergamo by Cotonificio Albini from 120/2 two-ply Egyptian Giza cotton poplin. Designed with a balanced semi-spread collar, removable stainless stays, and mitered single-button cuffs.',
    fabricCare:
      '100% two-ply Egyptian Giza cotton woven in Italy. Wash at 30°C or dry clean; iron damp on medium cotton setting.',
    pairedHandle: 'mercerized-interlock-knit-polo',
    colors: [
      {
        name: 'Optic White',
        hex: '#FAFAFA',
        image: STUDIO_MEDIA.modelWhiteShirt,
        secondaryImage: STUDIO_MEDIA.modelBackWhite,
        stock: { S: 12, M: 17, L: 11, XL: 3 },
      },
      {
        name: 'Sky Blue',
        hex: '#A9C6DE',
        image: STUDIO_MEDIA.sageHanger,
        secondaryImage: STUDIO_MEDIA.modelPoisedBW,
        stock: { S: 9, M: 14, L: 8, XL: 0 },
      },
    ],
  },
  {
    id: 'prod-5',
    handle: 'mercerized-interlock-knit-polo',
    title: 'Mercerized Interlock Knit Polo',
    type: 'Polo',
    collectionHandles: ['all', 'knit-polos'],
    price: 115,
    fit: 'Regular',
    fabric: 'Mercerized Cotton',
    gsm: '210 GSM Double Interlock',
    mill: 'Guimarães, Portugal',
    modelInfo: 'Model is 6\'0" (183 cm) and wears size M',
    skuPrefix: 'GRD-POL',
    isNew: true,
    description:
      'Refined short-sleeve polo crafted from 210 GSM gassed and mercerized organic cotton interlock for a clean, silk-matte hand. Detailed with a concealed two-button placket and a structured two-piece shirt collar stand.',
    fabricCare:
      '100% organic double-mercerized cotton interlock (210 GSM). Cold gentle wash inside out, dry flat away from direct heat.',
    pairedHandle: 'mercer-two-ply-oxford-shirt',
    colors: [
      {
        name: 'Navy',
        hex: '#1F2A44',
        image: STUDIO_MEDIA.navyHanger,
        secondaryImage: STUDIO_MEDIA.modelStudioCasual,
        stock: { S: 10, M: 16, L: 13, XL: 4 },
      },
      {
        name: 'Ecru',
        hex: '#E8E2D5',
        image: STUDIO_MEDIA.stoneHanger,
        secondaryImage: STUDIO_MEDIA.modelChairShirt,
        stock: { S: 7, M: 12, L: 2, XL: 6 },
      },
    ],
  },
  {
    id: 'prod-6',
    handle: 'studio-grid-oversized-graphic-tee',
    title: 'Studio Grid Oversized Graphic Tee',
    type: 'Graphic Tee',
    collectionHandles: ['all', 'heavyweight-tees'],
    price: 74,
    compareAtPrice: 90,
    fit: 'Oversized',
    fabric: 'Heavy Jersey',
    gsm: '260 GSM Dry-Hand Jersey',
    mill: 'Porto, Portugal',
    modelInfo: 'Model is 6\'1" (185 cm) and wears size M',
    skuPrefix: 'GRD-GFX',
    isNew: true,
    description:
      'Dropped-shoulder Oversized tee in 260 GSM dry-hand organic carded jersey, featuring an understated tonal water-based Swiss typographic specification print at left chest and back yoke.',
    fabricCare:
      '100% organic dry-hand jersey (260 GSM). Wash inside-out cold; do not iron directly over water-based typographic print.',
    pairedHandle: 'mercer-two-ply-oxford-shirt',
    colors: [
      {
        name: 'Oatmeal',
        hex: '#DDD5C7',
        image: STUDIO_MEDIA.modelStudioCasual,
        secondaryImage: STUDIO_MEDIA.modelWhiteTee,
        stock: { S: 11, M: 15, L: 8, XL: 0 },
      },
      {
        name: 'Charcoal',
        hex: '#3A3B3C',
        image: STUDIO_MEDIA.modelMonoShirt,
        secondaryImage: STUDIO_MEDIA.modelPoisedBW,
        stock: { S: 6, M: 14, L: 3, XL: 9 },
      },
    ],
  },
  {
    id: 'prod-7',
    handle: 'somelos-chambray-overshirt',
    title: 'Somelos Brushed Chambray Shirt',
    type: 'Casual Shirt',
    collectionHandles: ['all', 'oxford-casual'],
    price: 152,
    fit: 'Relaxed',
    fabric: 'Oxford',
    gsm: '190 GSM Selvedge Chambray',
    mill: 'Somelos, Portugal',
    modelInfo: 'Model is 6\'1" (185 cm) and wears size L',
    skuPrefix: 'GRD-CHM',
    isBestseller: true,
    description:
      'Mid-weight casual utility shirt cut from 190 GSM Portuguese indigo-free slate chambray. Features a concealed chest map pocket, gusseted side hems, and horn-tone corozo nut buttons.',
    fabricCare:
      '100% organic cotton chambray (190 GSM). Machine wash cold with like colors, line dry.',
    pairedHandle: 'supima-240-heavyweight-tee',
    colors: [
      {
        name: 'Slate',
        hex: '#5A646E',
        image: STUDIO_MEDIA.sageHanger,
        secondaryImage: STUDIO_MEDIA.modelStudioCasual,
        stock: { S: 5, M: 12, L: 9, XL: 4 },
      },
      {
        name: 'Navy',
        hex: '#1F2A44',
        image: STUDIO_MEDIA.navyHanger,
        secondaryImage: STUDIO_MEDIA.modelStriped,
        stock: { S: 8, M: 11, L: 0, XL: 3 },
      },
    ],
  },
  {
    id: 'prod-8',
    handle: 'normandy-linen-band-collar-shirt',
    title: 'Normandy Linen Band-Collar Shirt',
    type: 'Linen Shirt',
    collectionHandles: ['all', 'linen-resort', 'formal-poplin'],
    price: 148,
    fit: 'Regular',
    fabric: 'Belgian Linen',
    gsm: '150 GSM Long-Fiber Flax',
    mill: 'Libeco, Belgium',
    modelInfo: 'Model is 6\'0" (183 cm) and wears size M',
    skuPrefix: 'GRD-BND',
    description:
      'Minimalist grandad band-collar shirt with a 24mm sculpted collar stand, French placket, and clean back box pleat. Transitions effortlessly from warm-weather tailoring to coastal travel.',
    fabricCare:
      '100% European long-fiber flax (150 GSM). Wash cold gentle, hang dry.',
    pairedHandle: 'mercerized-interlock-knit-polo',
    colors: [
      {
        name: 'Optic White',
        hex: '#FAFAFA',
        image: STUDIO_MEDIA.whiteHanger,
        secondaryImage: STUDIO_MEDIA.modelChairShirt,
        stock: { S: 9, M: 14, L: 7, XL: 5 },
      },
      {
        name: 'Sand',
        hex: '#D6C7B2',
        image: STUDIO_MEDIA.stoneHanger,
        secondaryImage: STUDIO_MEDIA.modelOliveShirt,
        stock: { S: 4, M: 9, L: 2, XL: 0 },
      },
    ],
  },
];

export const CURRENCIES: Record<string, { symbol: string; code: string; rate: number; country: string }> = {
  US: { country: 'United States', code: 'USD', symbol: '$', rate: 1 },
  GB: { country: 'United Kingdom', code: 'GBP', symbol: '£', rate: 0.79 },
  DE: { country: 'European Union', code: 'EUR', symbol: '€', rate: 0.92 },
  CH: { country: 'Switzerland', code: 'CHF', symbol: 'CHF ', rate: 0.88 },
  JP: { country: 'Japan', code: 'JPY', symbol: '¥', rate: 152 },
};

export function formatPrice(usdAmount: number, countryCode: string): string {
  const c = CURRENCIES[countryCode] || CURRENCIES.US;
  const converted = usdAmount * c.rate;
  if (c.code === 'JPY') return `${c.symbol}${Math.round(converted).toLocaleString()}`;
  return `${c.symbol}${converted.toFixed(2)}`;
}
