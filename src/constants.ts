/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'Graphics' | 'Printers' | 'Audio' | 'Storage' | 'Accessories';
  brand: string;
  description: string;
  image?: string;
  price: string;
  oldPrice?: string;
  discount?: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  location: string;
  initials: string;
}

export interface AMCFeature {
  text: string;
}

export const AMCFEATURES: AMCFeature[] = [
  { text: 'Quarterly on-site health checks' },
  { text: 'Priority response for breakdowns' },
  { text: 'Discounted parts & labour' },
  { text: 'Printer, network & CCTV upkeep' },
  { text: 'Monthly performance reports' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    text: "My old HP laptop wouldn't turn on. Computer Corner fixed the motherboard in two days and it runs like new.",
    author: "Arup Mahato",
    location: "Jhargram",
    initials: "AM"
  },
  {
    id: 't2',
    text: "Bought a Dell desktop for my shop's billing. Clean installation, fair price and prompt follow-up service.",
    author: "Sutapa Ghosh",
    location: "Raghunathpur",
    initials: "SG"
  },
  {
    id: 't3',
    text: "Their AMC keeps all 12 of our office PCs running. No downtime in the last year — that's rare for our area.",
    author: "Rahul Sen",
    location: "Local business owner",
    initials: "RS"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'GIGABYTE GeForce RTX 5070',
    category: 'Graphics',
    brand: 'GIGABYTE',
    description: 'Next-gen gaming graphics. Perfect for 1440p & 4K gaming builds.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
    price: '₹62,500',
    oldPrice: '₹70,000',
    discount: '11% OFF'
  },
  {
    id: 'p2',
    name: 'FINGERS RollingParties-110',
    category: 'Audio',
    brand: 'FINGERS',
    description: 'Bluetooth party speaker with mic & guitar inputs — record & play built-in.',
    image: 'https://images.unsplash.com/photo-1629837943033-05742416f0e4?auto=format&fit=crop&q=80&w=800',
    price: '₹14,499',
    oldPrice: '₹16,999',
    discount: '15% OFF'
  },
  {
    id: 'p3',
    name: 'Canon PIXMA MegaTank G',
    category: 'Printers',
    brand: 'Canon',
    description: 'Wi-Fi Printer — high-yield ink tank for home & small office printing.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    price: '₹12,600',
    oldPrice: '₹13,000',
    discount: '3% OFF'
  },
  {
    id: 'p4',
    name: 'Kingston XS1000',
    category: 'Storage',
    brand: 'Kingston',
    description: 'USB 3.2 External SSD — pocket-sized, blazing fast file transfers.',
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=800',
    price: '₹5,000',
    oldPrice: '₹6,000',
    discount: '17% OFF'
  },
  {
    id: 'p5',
    name: 'Morpho L1 / Mantra L1',
    category: 'Accessories',
    brand: 'Morpho',
    description: 'L1-certified biometric fingerprint devices — ready for Aadhaar services.',
    image: 'https://images.unsplash.com/photo-1507206130118-b5907f817163?auto=format&fit=crop&q=80&w=800',
    price: '₹3,850',
    oldPrice: '₹4,000',
    discount: '4% OFF'
  }
];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1525547718511-b0564ec3f7c9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'
];

export const WORKSHOP_LOGS = [
  {
    title: 'Laptop motherboard repair',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Desktop builds & tuning',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Printer service bench',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600'
  }
];
