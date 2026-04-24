/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Desktops' | 'Laptops' | 'Printers' | 'Cameras' | 'CCTV' | 'Audio' | 'Appliances' | 'Power' | 'Accessories';
  brand: string;
  description: string;
  image: string;
  additionalImages?: string[];
  specifications?: Record<string, string>;
  reviews?: Review[];
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
    additionalImages: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'
    ],
    specifications: {
      'Processor': 'Intel Core i7-13700K',
      'Graphics': 'NVIDIA GeForce RTX 4070 Ti 12GB',
      'RAM': '32GB DDR5 5200MHz RGB',
      'Storage': '1TB NVMe Gen4 SSD',
      'Cooling': '240mm AIO Liquid Cooler',
      'Cabinet': 'Lian Li O11 Dynamic Dynamic'
    },
    reviews: [
      { user: 'Bikram Das', rating: 5, comment: 'Extreme performance! The build quality is top-notch.', date: '21 March 2024' },
      { user: 'Sayan Roy', rating: 4, comment: 'Great service. They helped me pick the right parts.', date: '15 Feb 2024' }
    ],
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
    additionalImages: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'
    ],
    specifications: {
      'Display': '15.6" FHD 144Hz IPS',
      'Processor': 'AMD Ryzen 7 6800H',
      'Graphics': 'RTX 3060 6GB',
      'Memory': '16GB DDR5',
      'Storage': '512GB SSD'
    },
    reviews: [
      { user: 'Joydeep Sen', rating: 5, comment: 'Perfect for my college and gaming. Very smooth.', date: 'Jan 2024' }
    ],
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
    specifications: {
      'Type': 'Ink Tank All-in-One',
      'Functions': 'Print, Scan, Copy',
      'Interface': 'Hi-Speed USB',
      'Yield': 'Up to 6000 pages (Black)'
    },
    reviews: [
      { user: 'Amit Ghosh', rating: 5, comment: 'Very low printing cost. Highly recommend.', date: '10 Feb 2024' }
    ],
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
    name: 'HP Pavilion 15',
    category: 'Laptops',
    brand: 'HP',
    description: 'Powerful performance and stunning visuals. AMD Ryzen 5, 8GB RAM, 512GB SSD.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '₹54,990',
    oldPrice: '₹62,000',
    discount: 'Student Pick'
  },
  {
    id: 'p9',
    name: 'Epson EcoTank L3210',
    category: 'Printers',
    brand: 'Epson',
    description: 'AIO InkTank printer for cost-effective printing with low cost per page.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    price: '₹13,800',
    oldPrice: '₹15,500',
    discount: 'Top Seller'
  },
  {
    id: 'p10',
    name: 'Logitech G502 HERO',
    category: 'Accessories',
    brand: 'Logitech',
    description: 'High performance wired gaming mouse with HERO 25K sensor and RGB lighting.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    price: '₹4,495',
    oldPrice: '₹5,999',
    discount: 'Gaming Essential'
  },
  {
    id: 'p11',
    name: 'Hikvision Turbo HD Kit',
    category: 'CCTV',
    brand: 'Hikvision',
    description: 'Complete 4-camera security system with DVR and remote mobile monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '₹8,500',
    oldPrice: '₹12,000',
    discount: 'Safety Pack'
  }
];

export const GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
    title: 'Shop Exterior',
    description: 'TP Computer Corner - Jhargram Tech Hub'
  },
  {
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800',
    title: 'Modern Retail Space',
    description: 'Explore our wide range of laptops and gadgets'
  },
  {
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    title: 'Service Workshop',
    description: 'Where precision meets repair'
  },
  {
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    title: 'Custom PC Station',
    description: 'Ready-to-go and custom-built gaming rigs'
  },
  {
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    title: 'Showroom Interior',
    description: 'The best tech brands under one roof'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    title: 'Software & Solutions',
    description: 'Expert software support and licensing'
  }
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
