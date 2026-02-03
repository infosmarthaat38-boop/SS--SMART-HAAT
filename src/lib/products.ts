
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  description: string;
  category: string;
  imageUrl: string;
  details: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'CLASSIC GOLD WATCH',
    price: 299.99,
    originalPrice: 599.99,
    discountPercentage: 50,
    description: 'A TIMELESS MINIMALIST SMART WATCH THAT BLENDS TECHNOLOGY WITH LUXURY.',
    category: 'ACCESSORIES',
    imageUrl: 'https://picsum.photos/seed/watch1/600/600',
    details: ['WATER RESISTANT', 'SAPPHIRE GLASS', 'PREMIUM LEATHER STRAP']
  },
  {
    id: '2',
    name: 'SUEDE LEATHER TOTE',
    price: 189.00,
    originalPrice: 378.00,
    discountPercentage: 50,
    description: 'SOPHISTICATED SUEDE LEATHER HANDBAG FOR THE MODERN PROFESSIONAL.',
    category: 'BAGS',
    imageUrl: 'https://picsum.photos/seed/bag1/600/600',
    details: ['ITALIAN LEATHER', 'SPACIOUS INTERIOR', 'GOLD-TONE HARDWARE']
  },
  {
    id: '3',
    name: 'URBAN PRIME SNEAKERS',
    price: 145.00,
    originalPrice: 290.00,
    discountPercentage: 50,
    description: 'SLEEK, COMFORTABLE, AND VERSATILE SNEAKERS DESIGNED FOR CITY EXPLORERS.',
    category: 'FOOTWEAR',
    imageUrl: 'https://picsum.photos/seed/shoes1/600/600',
    details: ['BREATHABLE MESH', 'CUSHIONED SOLE', 'RECYCLED MATERIALS']
  },
  {
    id: '4',
    name: 'HERITAGE WOOL COAT',
    price: 450.00,
    originalPrice: 900.00,
    discountPercentage: 50,
    description: 'HANDCRAFTED WOOL COAT IN A CLASSIC BEIGE SILHOUETTE.',
    category: 'OUTERWEAR',
    imageUrl: 'https://picsum.photos/seed/coat1/600/600',
    details: ['100% MERINO WOOL', 'SILK LINING', 'REGULAR FIT']
  },
  {
    id: '5',
    name: 'OBSIDIAN SUNGLASSES',
    price: 120.00,
    originalPrice: 240.00,
    discountPercentage: 50,
    description: 'DESIGNER SUNGLASSES WITH UV PROTECTION AND A BOLD FRAME.',
    category: 'ACCESSORIES',
    imageUrl: 'https://picsum.photos/seed/glasses1/600/600',
    details: ['UV400 PROTECTION', 'HAND-POLISHED ACETATE', 'INCLUDES CASE']
  },
  {
    id: '6',
    name: 'LUMIERE FRAGRANCE',
    price: 85.00,
    originalPrice: 170.00,
    discountPercentage: 50,
    description: 'A DELICATE BLEND OF FLORAL AND WOODY NOTES FOR A SIGNATURE SCENT.',
    category: 'BEAUTY',
    imageUrl: 'https://picsum.photos/seed/perfume1/600/600',
    details: ['50ML SPRAY', 'LONG-LASTING', 'NOTES OF SANDALWOOD AND JASMINE']
  }
];
