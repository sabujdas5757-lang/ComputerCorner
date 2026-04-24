/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'Desktops' | 'Laptops' | 'Printers' | 'Cameras' | 'CCTV' | 'Audio' | 'Appliances' | 'Power' | 'Accessories';
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

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Custom Gaming Assemble Desktop',
    category: 'Desktops',
    brand: 'Custom Build',
    description: 'High-performance gaming PC with RTX 40-series, Liquid Cooling, and RGB. Built for Jhargram gamers.',
    image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=800',
    price: '₹45,500',
    oldPrice: '₹55,000',
    discount: 'Starting From'
  },
  {
    id: 'p2',
    name: 'ASUS ROG Strix Gaming Laptop',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Portable power for gaming and creative work. 144Hz display & RGB backlit keyboard.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '₹72,499',
    oldPrice: '₹85,000',
    discount: 'Special Offer'
  },
  {
    id: 'p3',
    name: 'Canon PIXMA MegaTank G Series',
    category: 'Printers',
    brand: 'Canon',
    description: 'High-yield ink tank printer. Perfect for home, office, and Xerox services.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    price: '₹12,600',
    oldPrice: '₹14,000',
    discount: '10% OFF'
  },
  {
    id: 'p4',
    name: 'CP PLUS 4MP CCTV Home Security',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Full HD Wi-Fi camera with night vision and mobile alerts. Protect your home.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '₹2,499',
    oldPrice: '₹3,500',
    discount: 'Best Entry'
  },
  {
    id: 'p5',
    name: 'FINGERS RollingParties-110',
    category: 'Audio',
    brand: 'FINGERS',
    description: 'Bluetooth party speaker with mic & guitar inputs — powerful sound system.',
    image: 'https://images.unsplash.com/photo-1589190282375-f40441539e15?auto=format&fit=crop&q=80&w=800',
    price: '₹14,499',
    oldPrice: '₹16,999',
    discount: 'Retail Price'
  },
  {
    id: 'p6',
    name: 'Microtek Digital Inverter / UPS',
    category: 'Power',
    brand: 'Microtek',
    description: 'Reliable power backup solutions with Online UPS and heavy-duty inverters.',
    image: 'https://images.unsplash.com/photo-1534224039826-c7aa0bea47fe?auto=format&fit=crop&q=80&w=800',
    price: '₹6,850',
    oldPrice: '₹8,000',
    discount: 'Starting'
  },
  {
    id: 'p7',
    name: 'Nikon D3500 DSLR Kit',
    category: 'Cameras',
    brand: 'Nikon',
    description: 'Professional DSLR camera for photography enthusiasts. 24.2 MP and Full HD video.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    price: '₹48,990',
    oldPrice: '₹52,000',
    discount: 'Bundle Deal'
  },
  {
    id: 'p8',
    name: 'Voltas Adjustable Inverter AC',
    category: 'Appliances',
    brand: 'Voltas',
    description: 'Energy-efficient cooling for your home. Stay comfortable in any weather.',
    image: 'https://images.unsplash.com/photo-1621619856624-42f7b935e219?auto=format&fit=crop&q=80&w=800',
    price: '₹32,990',
    oldPrice: '₹42,000',
    discount: 'Seasonal Offer'
  }
];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1603481546238-487240415951?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
];

export const WORKSHOP_LOGS = [
  {
    title: 'Laptop motherboard repair',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Desktop builds & tuning',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Printer service bench',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800'
  }
];

export const PRODUCT_CATEGORIES = [
  {
    title: 'Gaming Desktops',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
    description: 'High-performance custom builds for elite gaming.'
  },
  {
    title: 'Laptops',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    description: 'Modern workstations and slim ultrabooks.'
  },
  {
    title: 'Printers',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    description: 'Laser and InkTank solutions for home & office.'
  },
  {
    title: 'Cameras',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    description: 'Professional DSLR and mirrorless photography gear.'
  },
  {
    title: 'CCTV',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    description: 'Smart security and 24/7 surveillance systems.'
  },
  {
    title: 'Audio',
    image: 'https://images.unsplash.com/photo-1589190282375-f40441539e15?auto=format&fit=crop&q=80&w=800',
    description: 'Premium speakers and cinematic sound setups.'
  },
  {
    title: 'Appliances',
    image: 'https://images.unsplash.com/photo-1621619856624-42f7b935e219?auto=format&fit=crop&q=80&w=800',
    description: 'Energy-efficient home comfort solutions.'
  },
  {
    title: 'Power',
    image: 'https://images.unsplash.com/photo-1534224039826-c7aa0bea47fe?auto=format&fit=crop&q=80&w=800',
    description: 'Reliable UPS and inverter backup systems.'
  },
  {
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    description: 'Keyboards, mice, and essential tech peripherals.'
  }
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
