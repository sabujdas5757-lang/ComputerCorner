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
  category: 'Desktops' | 'Laptops' | 'Printers' | 'Cameras' | 'CCTV' | 'Audio' | 'Appliances' | 'Power' | 'Accessories' | 'Monitors' | 'Processors' | 'Motherboards' | 'Projectors';
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
    price: '45500 to 47500 The price may be higher or lower',
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
    price: '72499 to 74499 The price may be higher or lower',
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
    price: '12600 to 14600 The price may be higher or lower',
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
    price: '2499 to 4499 The price may be higher or lower',
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
    price: '48990 to 50990 The price may be higher or lower',
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
    price: '54990 to 56990 The price may be higher or lower',
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
    price: '13800 to 15800 The price may be higher or lower',
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
    price: '4495 to 6495 The price may be higher or lower',
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
    price: '8500 to 10500 The price may be higher or lower',
    oldPrice: '₹12,000',
    discount: 'Safety Pack'
  },
  {
    id: 'p12',
    name: 'ASUS Vivobook Go 15 E1504FA',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Thin and light laptop with a stunning 15.6-inch display, perfect for productivity on the go.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Model': 'E1504FA-BQ2341WS',
      'Processor': 'AMD Ryzen 3 7320U',
      'Memory': '16GB LPDDR5',
      'Storage': '512GB PCIe SSD',
      'Display': '15.6" FHD (1920x1080)',
      'Color': 'Mixed Silver'
    },
    price: '38990 to 40990 The price may be higher or lower',
    oldPrice: '₹42,000',
    discount: 'Great Value'
  },
  {
    id: 'p13',
    name: 'ASUS TUF Gaming A15',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Military-grade durability meets high-speed gaming performance.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Model': 'FA506NCG-HN200WS',
      'Processor': 'AMD Ryzen 7 7445HS',
      'Graphics': 'NVIDIA RTX 3050 4GB',
      'Memory': '16GB DDR5',
      'Storage': '512GB NVMe SSD',
      'Display': '15.6" 144Hz Refresh Rate'
    },
    price: '68490 to 70490 The price may be higher or lower',
    oldPrice: '₹75,000',
    discount: 'Gaming Ready'
  },
  {
    id: 'p14',
    name: 'Dell Inspiron 15 3530',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Reliable performance for everyday tasks with the latest 13th Gen Intel power.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Model': 'ODC1525000401RINS1',
      'Processor': 'Intel Core i5-1335U (13th Gen)',
      'Memory': '16GB DDR4',
      'Storage': '512GB SSD',
      'Display': '15.6" FHD WVA AG'
    },
    price: '56800 to 58800 The price may be higher or lower',
    oldPrice: '₹64,500',
    discount: 'Professional'
  },
  {
    id: 'p15',
    name: 'HP Victus 15 Gaming',
    category: 'Laptops',
    brand: 'HP',
    description: 'Designed for high-performance gaming with an sophisticated aesthetic.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Model': '15-FB3012AX',
      'Processor': 'AMD Ryzen 5 8645HS',
      'Graphics': 'NVIDIA RTX 3050 6GB',
      'Memory': '16GB DDR5',
      'Storage': '512GB Gen4 SSD'
    },
    price: '62990 to 64990 The price may be higher or lower',
    oldPrice: '₹71,000',
    discount: 'Trending'
  },
  {
    id: 'p16',
    name: 'Lenovo IdeaPad Slim 3',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Smarter and lighter, the perfect balance of performance and style.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Model': '82VG00T8IN',
      'Processor': 'AMD Ryzen 3 7320U',
      'Memory': '8GB LPDDR5',
      'Storage': '512GB SSD',
      'Display': '15.6" FHD Anti-Glare'
    },
    price: '34500 to 36500 The price may be higher or lower',
    oldPrice: '₹39,000',
    discount: 'Budget Friendly'
  },
  {
    id: 'p17',
    name: 'IFOTO A4 130GSM 50 SHEET',
    category: 'Accessories',
    brand: 'IFOTO',
    description: 'High-quality photopaper for everyday printing. 130GSM, 50 Sheets per pack. Stock: 78 PKT',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '250 to 2250 The price may be higher or lower',
    discount: 'Bulk Available'
  },
  {
    id: 'p18',
    name: 'IFOTO A4 180GSM 20 SHEET',
    category: 'Accessories',
    brand: 'IFOTO',
    description: 'Premium photopaper with 180GSM weight for better durability. 20 Sheets. Stock: 134 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '120 to 2120 The price may be higher or lower',
    discount: 'Top Choice'
  },
  {
    id: 'p19',
    name: 'IFOTO A4 180GSM 50 SHEET',
    category: 'Accessories',
    brand: 'IFOTO',
    description: 'Extra value pack with 50 sheets of 180GSM photopaper. Stock: 1 PKT',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '290 to 2290 The price may be higher or lower',
    discount: 'Limited Stock'
  },
  {
    id: 'p20',
    name: 'IFOTO PG 4R 180GSM 100 SHEET (4*6)',
    category: 'Accessories',
    brand: 'IFOTO',
    description: 'Glossy 4R size photopaper for photo printing. 180GSM, 100 Sheets. Stock: 50 PKT',
    image: 'https://images.unsplash.com/photo-1616628188506-4da83921312f?auto=format&fit=crop&q=80&w=800',
    price: '180 to 2180 The price may be higher or lower',
    discount: 'Popular'
  },
  {
    id: 'p21',
    name: 'NOVA PRISMAJET PG 4R (4*6) 254GSM',
    category: 'Accessories',
    brand: 'NOVA',
    description: 'Professional grade 254GSM Prismajet photopaper. 100 Sheets. Stock: 16 PKT',
    image: 'https://images.unsplash.com/photo-1616628188506-4da83921312f?auto=format&fit=crop&q=80&w=800',
    price: '350 to 2350 The price may be higher or lower',
    discount: 'Professional'
  },
  {
    id: 'p22',
    name: 'NOVA PRISMAJET PG 4R (4*6) 270GSM',
    category: 'Accessories',
    brand: 'NOVA',
    description: 'Ultra-premium 270GSM Prismajet photopaper for the best results. 100 Sheets. Stock: 30 PKT',
    image: 'https://images.unsplash.com/photo-1616628188506-4da83921312f?auto=format&fit=crop&q=80&w=800',
    price: '380 to 2380 The price may be higher or lower',
    discount: 'Best Quality'
  },
  {
    id: 'p23',
    name: 'NOVA PRISMAJET PG A4 270GSM',
    category: 'Accessories',
    brand: 'NOVA',
    description: 'A4 size 270GSM Prismajet photopaper. 20 Sheets. Stock: 31 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '220 to 2220 The price may be higher or lower',
    discount: 'Standard'
  },
  {
    id: 'p24',
    name: 'NOVA PROFESSIONAL PG A4 130GSM',
    category: 'Accessories',
    brand: 'NOVA',
    description: 'Nova Professional series 130GSM photopaper. 100 Sheets. Stock: 14 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '320 to 2320 The price may be higher or lower',
    discount: 'Value Pack'
  },
  {
    id: 'p25',
    name: 'VMS 4*6 100 SHEETS (180GSM)',
    category: 'Accessories',
    brand: 'VMS',
    description: 'VMS brand 4x6 photopaper, 180GSM weight. 100 Sheets. Stock: 11 PCS',
    image: 'https://images.unsplash.com/photo-1616628188506-4da83921312f?auto=format&fit=crop&q=80&w=800',
    price: '165 to 2165 The price may be higher or lower',
    discount: 'Reliable'
  },
  {
    id: 'p26',
    name: 'VMS A4 PHOTOPAPER 260GSM',
    category: 'Accessories',
    brand: 'VMS',
    description: 'Heavyweight A4 photopaper from VMS, 260GSM for professional prints.',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '450 to 2450 The price may be higher or lower',
    discount: 'Heavy Duty'
  },
  {
    id: 'p27',
    name: 'HP Smart Tank 580',
    category: 'Printers',
    brand: 'HP',
    description: 'All-in-one wireless ink tank printer with smart-guided buttons and low-cost printing.',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Functions': 'Print, scan, copy, wireless',
      'Print Speed': 'Up to 12 ppm (black), 5 ppm (color)',
      'Connectivity': 'Self-healing Wi-Fi, Bluetooth LE, USB 2.0',
      'Duty Cycle': 'Up to 3,000 pages'
    },
    price: '14990 to 16990 The price may be higher or lower',
    oldPrice: '₹16,500',
    discount: 'Bestseller'
  },
  {
    id: 'p28',
    name: 'HP LaserJet Pro M126nw',
    category: 'Printers',
    brand: 'HP',
    description: 'Reliable monochrome laser printer for office use with wireless networking capabilities.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Functions': 'Print, Copy, Scan',
      'Technology': 'Laser',
      'Network': 'Wireless, Ethernet',
      'Monthly Duty Cycle': 'Up to 8,000 pages'
    },
    price: '18800 to 20800 The price may be higher or lower',
    oldPrice: '₹21,000',
    discount: 'Office Pro'
  },
  {
    id: 'p29',
    name: 'HP Ink Tank 415',
    category: 'Printers',
    brand: 'HP',
    description: 'High-capacity wireless ink tank printer for volume printing needs.',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Functions': 'Print, copy, scan, wireless',
      'Tank system': 'High-capacity with spill-free refill',
      'Yield': 'Up to 8000 color or 6000 black pages'
    },
    price: '13400 to 15400 The price may be higher or lower',
    oldPrice: '₹15,200',
    discount: 'Value Choice'
  },
  {
    id: 'p30',
    name: 'HP LaserJet Pro M126a',
    category: 'Printers',
    brand: 'HP',
    description: 'Compact and reliable monochrome laser printer for home and small offices. Stock: 6 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Functions': 'Print, Copy, Scan', 'Speed': 'Up to 20 ppm', 'Connectivity': 'USB 2.0' },
    price: '14950 to 16950 The price may be higher or lower',
    discount: 'High Demand'
  },
  {
    id: 'p31',
    name: 'HP All-in-One Ink Tank Wireless 416',
    category: 'Printers',
    brand: 'HP',
    description: 'Wireless ink tank printer with spill-free refill system. Stock: 5 No.s',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Functions': 'Print, Scan, Copy, Wi-Fi', 'Yield': 'Up to 8000 color pages' },
    price: '13800 to 15800 The price may be higher or lower',
    discount: 'Wireless'
  },
  {
    id: 'p32',
    name: 'HP DeskJet Ultra 4929 MFP',
    category: 'Printers',
    brand: 'HP',
    description: 'Multi-function printer designed for low-cost high-yield printing. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1549416415-467a35368a62?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Functions': 'Print, Scan, Copy', 'Cartridge': 'HP 47 High Yield' },
    price: '8900 to 10900 The price may be higher or lower',
    discount: 'Compact'
  },
  {
    id: 'p33',
    name: 'HP Ink Tank 319',
    category: 'Printers',
    brand: 'HP',
    description: 'Cost-effective ink tank printer for volume monochrome and color printing. Stock: 8 No.s',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Connectivity': 'USB 2.0', 'Yield': 'Up to 6000 black pages' },
    price: '11500 to 13500 The price may be higher or lower',
    discount: 'Valued'
  },
  {
    id: 'p34',
    name: 'HP Ink Tank 419',
    category: 'Printers',
    brand: 'HP',
    description: 'Advanced wireless ink tank printer with high-yield capacity. Stock: 5 No.s',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Features': 'Wi-Fi Direct, Mobile Printing', 'Refill': 'Spill-free system' },
    price: '14200 to 16200 The price may be higher or lower',
    discount: 'Top Rated'
  },
  {
    id: 'p35',
    name: 'HP LaserJet Pro M126nw (CZ175A)',
    category: 'Printers',
    brand: 'HP',
    description: 'Enterprise-ready monochrome laser printer with wireless networking. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Network': 'Wi-Fi, Ethernet', 'Functions': '3-in-1 MFP' },
    price: '18500 to 20500 The price may be higher or lower',
    discount: 'Office Ready'
  },
  {
    id: 'p36',
    name: 'HP LaserJet MFP M108w',
    category: 'Printers',
    brand: 'HP',
    description: 'Ultra-compact laser printer with wireless capabilities. Stock: 1 No.s',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Size': 'Compact footprint', 'Wi-Fi': 'Built-in' },
    price: '15400 to 17400 The price may be higher or lower',
    discount: 'Rare Stock'
  },
  {
    id: 'p37',
    name: 'HP LaserJet P1108 Plus',
    category: 'Printers',
    brand: 'HP',
    description: 'The legendary workhorse for fast, high-quality text documents. Stock: 7 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Technology': 'Laser', 'Cartridge': 'HP 88A' },
    price: '12200 to 14200 The price may be higher or lower',
    discount: 'Durable'
  },
  {
    id: 'p38',
    name: 'HP LaserJet M1005 MFP',
    category: 'Printers',
    brand: 'HP',
    description: 'The most popular all-in-one laser printer in Jhargram. Robust and reliable. Stock: 4 No.s',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Functions': 'Print, Scan, Copy', 'Display': 'LCD' },
    price: '22500 to 24500 The price may be higher or lower',
    discount: 'Classic'
  },
  {
    id: 'p39',
    name: 'HP LaserJet M1005w (381U4A)',
    category: 'Printers',
    brand: 'HP',
    description: 'Modern wireless version of the classic M1005 series. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Wireless': 'Smart App Support', 'Speed': 'Fast Laser' },
    price: '24800 to 26800 The price may be higher or lower',
    discount: 'New Arrival'
  },
  {
    id: 'p40',
    name: 'HP LaserJet Smart Tank MFP 2606sdw',
    category: 'Printers',
    brand: 'HP',
    description: 'Next-gen laser tank with ultra-low printing cost and automatic loading. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Type': 'Laser Tank', 'ADF': 'Automatic Document Feeder' },
    price: '28990 to 30990 The price may be higher or lower',
    discount: 'Premium'
  },
  {
    id: 'p41',
    name: 'HP LaserJet Tank MFP 1005 (381U3A)',
    category: 'Printers',
    brand: 'HP',
    description: 'High-volume laser tank printer with easy refill experience. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Yield': '5000 pages of toner', 'Interface': 'USB 2.0' },
    price: '21500 to 23500 The price may be higher or lower',
    discount: 'Eco-Friendly'
  },
  {
    id: 'p42',
    name: 'HP LaserJet Pro M226dw',
    category: 'Printers',
    brand: 'HP',
    description: 'Professional wireless MFP with duplex printing for busy environments. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Duplex': 'Automatic', 'Mobile': 'Apple AirPrint Ready' },
    price: '26400 to 28400 The price may be higher or lower',
    discount: 'Business'
  },
  {
    id: 'p43',
    name: 'HP Smart Tank 516',
    category: 'Printers',
    brand: 'HP',
    description: 'Glossy finish all-in-one ink tank with superior color accuracy. Stock: 5 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Color': 'Vibrant Photo Quality', 'Wi-Fi': 'Dual Band' },
    price: '15200 to 17200 The price may be higher or lower',
    discount: 'Photo Specialist'
  },
  {
    id: 'p44',
    name: 'HP Smart Tank 530',
    category: 'Printers',
    brand: 'HP',
    description: 'Integrated ink tank printer with ADF and smart-guided buttons. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'ADF': '35-page capacity', 'Display': 'Hidden touch design' },
    price: '17800 to 19800 The price may be higher or lower',
    discount: 'Full Featured'
  },
  {
    id: 'p45',
    name: 'HP Smart Ink Tank AIO 675 (28C12A)',
    category: 'Printers',
    brand: 'HP',
    description: 'Smart tank with automatic dual-sided printing for maximum efficiency. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Duplex': 'Auto-printing', 'Smart App': 'HP Smart' },
    price: '20500 to 22500 The price may be higher or lower',
    discount: 'Efficient'
  },
  {
    id: 'p46',
    name: 'HP Smart Ink Tank AIO 720 (6UU46A)',
    category: 'Printers',
    brand: 'HP',
    description: 'The ultimate smart tank with advanced security and rapid speeds. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Security': 'Wolf Security Protected', 'Speed': 'Fast Color' },
    price: '22400 to 24400 The price may be higher or lower',
    discount: 'Top Tier'
  },
  {
    id: 'p47',
    name: 'HP Smart Tank 500',
    category: 'Printers',
    brand: 'HP',
    description: 'Reliable entry-level ink tank for students and teachers. Stock: 7 No.s',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Focus': 'Simplicity', 'Volume': 'High capacity tanks' },
    price: '12900 to 14900 The price may be higher or lower',
    discount: 'Best Entry'
  },
  {
    id: 'p48',
    name: 'HP Smart Tank 520 AIO',
    category: 'Printers',
    brand: 'HP',
    description: 'The modern standard for home multi-function ink tank printing. Stock: 17 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Interface': 'USB 2.0', 'Yield': '6000 pages black' },
    price: '13500 to 15500 The price may be higher or lower',
    discount: 'Massive Stock'
  },
  {
    id: 'p49',
    name: 'HP Smart Tank 521 AIO',
    category: 'Printers',
    brand: 'HP',
    description: 'Upgraded version of the 520 with improved print head longevity. Stock: 7 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '13900 to 15900 The price may be higher or lower',
    discount: 'Reliable'
  },
  {
    id: 'p50',
    name: 'HP Smart Tank 524 AIO (2Yrs)',
    category: 'Printers',
    brand: 'HP',
    description: 'Value pack with 2-year ink supply included in the box. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '14800 to 16800 The price may be higher or lower',
    discount: 'Extended Value'
  },
  {
    id: 'p51',
    name: 'HP Smart Tank 525 All-in-One',
    category: 'Printers',
    brand: 'HP',
    description: 'Professional look with integrated ink sensor alerts. Stock: 14 No.s',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '14500 to 16500 The price may be higher or lower',
    discount: 'Popular Choice'
  },
  {
    id: 'p52',
    name: 'HP Smart Tank 580 AIO Wi-Fi',
    category: 'Printers',
    brand: 'HP',
    description: 'Our most connected smart tank for seamless smartphone printing. Stock: 9 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Wi-Fi': 'Self-healing technology', 'App': 'Best-in-class HP Smart' },
    price: '14990 to 16990 The price may be higher or lower',
    discount: 'Best Connected'
  },
  {
    id: 'p53',
    name: 'HP Smart Tank 581 All-in-One',
    category: 'Printers',
    brand: 'HP',
    description: 'Enhanced color vibrancy for marketing materials and photos. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    price: '15200 to 17200 The price may be higher or lower',
    discount: 'Color Pro'
  },
  {
    id: 'p54',
    name: 'HP Smart Tank 585 AIO Wi-Fi Dark Blue',
    category: 'Printers',
    brand: 'HP',
    description: 'Exclusive Dark Blue edition with premium build and top wireless features.',
    image: 'https://images.unsplash.com/photo-1589739900243-4b53b1b46f5c?auto=format&fit=crop&q=80&w=800',
    specifications: { 'Edition': 'Special Dark Blue', 'Wi-Fi': 'Dual Band' },
    price: '15800 to 17800 The price may be higher or lower',
    discount: 'Premium Look'
  },
  {
    id: 'p55',
    name: 'SAMSUNG MONITOR 24" IPS LED LF24T350FHWXXL',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: '3-sided borderless display brings a clean and modern aesthetic to any working environment.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Screen Size': '24 Inch',
      'Panel Type': 'IPS',
      'Resolution': '1920 x 1080',
      'Refresh Rate': '75Hz',
      'Response Time': '5ms'
    },
    price: '10500 to 12500 The price may be higher or lower',
    discount: 'Popular'
  },
  {
    id: 'p56',
    name: 'SAMSUNG LED MONITOR 24" LS24C334GAWXXL 100HZ',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: 'Borderless 100Hz monitor for smooth gaming and video transitions. Stock: 9 PCS',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Model': 'LS24C334GAWXXL',
      'Refresh Rate': '100Hz',
      'Panel': 'IPS',
      'Design': '3-Sided Borderless'
    },
    price: '11800 to 13800 The price may be higher or lower',
    discount: '100Hz Smooth'
  },
  {
    id: 'p57',
    name: 'SAMSUNG MONITOR LED 22" IPS LS22C310EAWXXL',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: 'Crisp IPS panel with wide viewing angles for office and home use. Stock: 7 PCS',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '8400 to 10400 The price may be higher or lower',
    discount: 'Compact IPS'
  },
  {
    id: 'p58',
    name: 'SAMSUNG MONITOR 18.5" LS19A330',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: 'Essential monitor for basic computing tasks. Compact and energy-efficient. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '5900 to 7900 The price may be higher or lower',
    discount: 'Entry Level'
  },
  {
    id: 'p59',
    name: 'SAMSUNG MONITOR 22" LS22A334NHWXXL',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: '22-inch display with reliable performance for work and studies.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '7800 to 9800 The price may be higher or lower',
    discount: 'Standard'
  },
  {
    id: 'p60',
    name: 'SAMSUNG MONITOR 27" IPS LS27C334GAWXXL 100HZ',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: 'Large 27-inch IPS display with 100Hz high refresh rate for immersive experience.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    specifications: {
      'Size': '27 Inch',
      'Refresh Rate': '100Hz',
      'Panel': 'IPS'
    },
    price: '14500 to 16500 The price may be higher or lower',
    discount: 'Large Screen'
  },
  {
    id: 'p61',
    name: 'SAMSUNG MONITOR 27" LS27C312EAWXXI',
    category: 'Monitors',
    brand: 'SAMSUNG',
    description: 'Sleek 27-inch monitor with vivid colors and sharp details.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '13900 to 15900 The price may be higher or lower',
    discount: 'Vivid'
  },
  {
    id: 'p62',
    name: 'AMD RYZEN 3 4350G OEM',
    category: 'Processors',
    brand: 'AMD',
    description: 'Quad-core processor with integrated Radeon graphics. Stock: 10 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '9500 to 11500 The price may be higher or lower',
    discount: 'OEM Pack'
  },
  {
    id: 'p63',
    name: 'AMD RYZEN 5 3600',
    category: 'Processors',
    brand: 'AMD',
    description: '6-core, 12-thread unlocked desktop processor with Wraith Stealth cooler. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '10200 to 12200 The price may be higher or lower',
    discount: 'Best Budget'
  },
  {
    id: 'p64',
    name: 'AMD RYZEN 7 5800X',
    category: 'Processors',
    brand: 'AMD',
    description: 'High-performance 8-core processor for elite gaming and content creation. (Without Cooler). Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '24500 to 26500 The price may be higher or lower',
    discount: 'Pro Gaming'
  },
  {
    id: 'p65',
    name: 'CPU AMD ATHLON 3000G',
    category: 'Processors',
    brand: 'AMD',
    description: 'Dual-core entry-level processor for basic productivity. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '4800 to 6800 The price may be higher or lower',
    discount: 'Value'
  },
  {
    id: 'p66',
    name: 'CPU AMD RYZEN 3 3200G',
    category: 'Processors',
    brand: 'AMD',
    description: 'Ryzen 3 with Radeon Vega 8 Graphics for smooth casual gaming. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '8900 to 10900 The price may be higher or lower',
    discount: 'Ready'
  },
  {
    id: 'p67',
    name: 'CPU AMD RYZEN 5 5500GT',
    category: 'Processors',
    brand: 'AMD',
    description: 'High-speed 6-core processor with integrated graphics. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '12400 to 14400 The price may be higher or lower',
    discount: 'GT Series'
  },
  {
    id: 'p68',
    name: 'CPU AMD RYZEN 5 5600GT',
    category: 'Processors',
    brand: 'AMD',
    description: 'Advanced 6-core performance for work and play. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '14200 to 16200 The price may be higher or lower',
    discount: 'Performance'
  },
  {
    id: 'p69',
    name: 'CPU AMD RYZEN 5 5600X',
    category: 'Processors',
    brand: 'AMD',
    description: 'The standard for mainstream gaming performance. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '15800 to 17800 The price may be higher or lower',
    discount: 'Gamer Choice'
  },
  {
    id: 'p70',
    name: 'CPU AMD RYZEN 5 7500F',
    category: 'Processors',
    brand: 'AMD',
    description: 'Next-gen AM5 socket gaming CPU for modern rigs. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '16900 to 18900 The price may be higher or lower',
    discount: 'AM5 Ready'
  },
  {
    id: 'p71',
    name: 'CPU AMD RYZEN 5 7600X',
    category: 'Processors',
    brand: 'AMD',
    description: 'High-speed Zen 4 architecture for extreme responsiveness. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '20500 to 22500 The price may be higher or lower',
    discount: 'Zen 4'
  },
  {
    id: 'p72',
    name: 'CPU AMD RYZEN 5 8600G',
    category: 'Processors',
    brand: 'AMD',
    description: 'Top-tier integrated graphics for a smooth 1080p gaming experience. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '22800 to 24800 The price may be higher or lower',
    discount: 'Elite APU'
  },
  {
    id: 'p73',
    name: 'CPU AMD RYZEN 5 9600X',
    category: 'Processors',
    brand: 'AMD',
    description: 'The latest Zen 5 performance for cutting-edge builds. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '26500 to 28500 The price may be higher or lower',
    discount: 'Future Proof'
  },
  {
    id: 'p74',
    name: 'CPU AMD RYZEN 7 3700X',
    category: 'Processors',
    brand: 'AMD',
    description: 'Legendary 8-core, 16-thread processor for multitasking. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '18500 to 20500 The price may be higher or lower',
    discount: 'Reliable'
  },
  {
    id: 'p75',
    name: 'CPU AMD RYZEN 7 5700G',
    category: 'Processors',
    brand: 'AMD',
    description: '8-core responsiveness with the fastest integrated graphics. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '19800 to 21800 The price may be higher or lower',
    discount: 'G-Series'
  },
  {
    id: 'p76',
    name: 'CPU AMD RYZEN 7 5700',
    category: 'Processors',
    brand: 'AMD',
    description: 'Solid 8-core performance for professional applications. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '17400 to 19400 The price may be higher or lower',
    discount: 'Pro Content'
  },
  {
    id: 'p77',
    name: 'CPU AMD RYZEN 7 5700X',
    category: 'Processors',
    brand: 'AMD',
    description: 'Power-efficient 8-core gaming world champ. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800',
    price: '18900 to 20900 The price may be higher or lower',
    discount: 'Best 8-Core'
  },
  {
    id: 'p78',
    name: 'EZVIZ SMART HOME CAMERA CS-C6N (1080P)',
    category: 'CCTV',
    brand: 'EZVIZ',
    description: '360-degree coverage with smart tracking and night vision. Stock: 15 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2100 to 4100 The price may be higher or lower',
    discount: 'Popular'
  },
  {
    id: 'p79',
    name: 'HIKVISION 16 CHANNEL DVR 1080P (DS-7116HGHI-K1)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Efficient 16-channel DVR supporting 1080p Lite resolution. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '7800 to 9800 The price may be higher or lower',
    discount: 'High Capacity'
  },
  {
    id: 'p80',
    name: 'HIKVISION 16CH 12V 20A SMPS (DS-2FA120K-DW-IN)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Reliable 16-channel power supply for CCTV installations. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2400 to 4400 The price may be higher or lower',
    discount: 'Essential'
  },
  {
    id: 'p81',
    name: 'HIKVISION 16 CHANNEL TURBO HD DVR (IDS-7216HQHI-M2/FA)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Advanced Turbo HD DVR with facial recognition support. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '14500 to 16500 The price may be higher or lower',
    discount: 'Smart Features'
  },
  {
    id: 'p82',
    name: 'HIKVISION 2MP 30MT IP BULLET (HV DS-2CD1023G0E-I)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Professional IP bullet camera with 30m IR range and PoE. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: 'IP Camera'
  },
  {
    id: 'p83',
    name: 'HIKVISION 2MP 50MT IP BULLET (HV DS-2CD1T23G0-I)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Long-range IP bullet camera with 50m IR distance. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4800 to 6800 The price may be higher or lower',
    discount: 'Long Range'
  },
  {
    id: 'p84',
    name: 'HIKVISION 2MP 50MT IR BULLET CAMERA (DS-2CE16D0T-IT3F)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'High-definition analog bullet camera with 50m IR range. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2650 to 4650 The price may be higher or lower',
    discount: 'Analog Pro'
  },
  {
    id: 'p85',
    name: 'HIKVISION 2MP COLORVU BULLET CAMERA (DS-2CE10DF0T-PFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: '24/7 color imaging even in total darkness with ColorVu technology. Stock: 5 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3100 to 5100 The price may be higher or lower',
    discount: '24/7 Color'
  },
  {
    id: 'p86',
    name: 'HIKVISION 2MP IR AUDIO BULLET CAMERA (DS-2CE16D0T-ITPFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Audio over coaxial cable with high-quality built-in mic. Stock: 9 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1950 to 3950 The price may be higher or lower',
    discount: 'Audio Over Coax'
  },
  {
    id: 'p87',
    name: 'HIKVISION 2MP IR BULLET CAMERA (DS-2CE16D0T-ITP/ECO)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Eco-series 2MP bullet camera, perfect for budget installations. Stock: 14 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1450 to 3450 The price may be higher or lower',
    discount: 'Budget'
  },
  {
    id: 'p88',
    name: 'HIKVISION 2MP IR DOME CAMERA (DS-2CE56D0T-ITP/ECO)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Compact 2MP dome camera for indoor security. Stock: 9 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1350 to 3350 The price may be higher or lower',
    discount: 'Indoor'
  },
  {
    id: 'p89',
    name: 'HIKVISION 2MP IR SMART HYBIRD LIGHT AUDIO BULLET CAMERA (DS-2CE16D0T-LPFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Smart hybrid light with audio support for better identification. Stock: 5 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2250 to 4250 The price may be higher or lower',
    discount: 'Hybrid Light'
  },
  {
    id: 'p90',
    name: 'HIKVISION 2MP IR SMART HYBIRD LIGHT AUDIO DOME CAMERA (DS-2CE76D0T-LPFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Dome camera with integrated audio and smart lighting options. Stock: 17 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2150 to 4150 The price may be higher or lower',
    discount: 'Best Seller'
  },
  {
    id: 'p91',
    name: 'HIKVISION 2 MP SMART HYBRID LIGHT IP BULLET CAMERA (DS-2CD1023G2-LIU)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'IP bullet camera featuring smart hybrid illumination and AI tracking. Stock: 7 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3900 to 5900 The price may be higher or lower',
    discount: 'Smart IP'
  },
  {
    id: 'p92',
    name: 'HIKVISION 32 CHANNEL 2 SATA (NVR DS-7632NXI-K2)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Enterprise-grade NVR with 32-channel support and dual SATA bays. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '22500 to 24500 The price may be higher or lower',
    discount: 'Enterprise'
  },
  {
    id: 'p93',
    name: 'HIKVISION 4 CHANNEL DVR 1080P (DS-7104HGHI-K1)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Compact 4-channel DVR for home setups. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: 'Home Pack'
  },
  {
    id: 'p94',
    name: 'HIKVISION 4PORT 10/100M POE (DS-3E0106P-E/M)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Reliable PoE switch for powering up to 4 IP cameras. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2800 to 4800 The price may be higher or lower',
    discount: 'Network'
  },
  {
    id: 'p95',
    name: 'HIKVISION 4PORT FULL GIGA POE (DS-3E0505P-E/M)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Gigabit PoE switch for high-speed IP data transmission. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4500 to 6500 The price may be higher or lower',
    discount: 'Gigabit'
  },
  {
    id: 'p96',
    name: 'HIKVISION 5MP IR BULLET CAMERA (DS-2CE16H0T-ITPFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Super high-resolution 5MP analog bullet camera with audio. Stock: 7 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: '5MP Audio'
  },
  {
    id: 'p97',
    name: 'HIKVISION 5MP IR DOME CAMERA (DS-2CE76H0T-ITPFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Superior 5MP indoor dome camera with integrated audio. Stock: 7 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3100 to 5100 The price may be higher or lower',
    discount: 'High Res'
  },
  {
    id: 'p98',
    name: 'HIKVISION 8 CH 12V 10A SMPS (DS-2FA120A-DW-IN)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Dedicated 8-channel power adapter for structured cabling. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1650 to 3650 The price may be higher or lower',
    discount: 'Power'
  },
  {
    id: 'p99',
    name: 'HIKVISION 8CH 1SATA NVR (DS-7608NI-Q1)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Streamlined 8-channel NVR for digital IP surveillance. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '6900 to 8900 The price may be higher or lower',
    discount: 'Digital'
  },
  {
    id: 'p100',
    name: 'HIKVISION 8 CH 5MP DVR (IDS-7108HQHI-M1/S)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Smart 8-channel DVR supporting up to 5MP resolution. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '8200 to 10200 The price may be higher or lower',
    discount: 'HQ Series'
  },
  {
    id: 'p101',
    name: 'HIKVISION 8 CHANNEL DVR 1080P (DS-7108HGHI-K1)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Standard 8-channel analog DVR for small businesses. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4900 to 6900 The price may be higher or lower',
    discount: 'Standard'
  },
  {
    id: 'p102',
    name: 'HIKVISION 8MP 8CH 2 SATA NVR (DS-7608NI-Q2)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: '4K ready NVR with 8-channel support and high bandwidth. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '12800 to 14800 The price may be higher or lower',
    discount: '4K Ready'
  },
  {
    id: 'p103',
    name: 'HIKVISION 8PORT 10/100M POE (DS-3E0310P-E/M)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: '8-port PoE switch for larger IP deployments. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '5800 to 7800 The price may be higher or lower',
    discount: 'Pro Network'
  },
  {
    id: 'p104',
    name: 'HIKVISION 8PORT SFP GIGA POE (DS-3E0510P-E/M)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Gigabit PoE switch with SFP fiber uplink ports. Stock: 5 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '9500 to 11500 The price may be higher or lower',
    discount: 'Fiber Ready'
  },
  {
    id: 'p105',
    name: 'HIKVISION CCTV CABLE 3+1/RG59 90MTR (DS-1LH1SCA3C-090B)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Premium quality copper cable for professional signal transmission. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2600 to 4600 The price may be higher or lower',
    discount: 'Full Copper'
  },
  {
    id: 'p106',
    name: 'HIKVISION 3K Smart Hybrid Light Audio Bullet Camera (DS-2CE16K0T-LPFS)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Ultra-high 3K resolution with smart hybrid light and audio. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3800 to 5800 The price may be higher or lower',
    discount: '3K Ultra'
  },
  {
    id: 'p107',
    name: 'HIKVISION 2MP 30MT SMART HYBRID IP AUDIO DOME (DS-2CD1323G2-LIU)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Smart IP dome with AI detection and built-in audio mic. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4100 to 6100 The price may be higher or lower',
    discount: 'Smart Dome'
  },
  {
    id: 'p108',
    name: 'HIKVISION 2 MP COLORVU NETWORK BULLET CAMERA (DS-2CD1027G2-L)',
    category: 'CCTV',
    brand: 'HIKVISION',
    description: 'Vivid color images 24/7 with ColorVu IP technology and high protection.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '5400 to 7400 The price may be higher or lower',
    discount: 'Color Pro'
  },
  {
    id: 'p109',
    name: 'CP PLUS 1.3MP BULLET 20M (CP USC-TA13L2-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-definition bullet camera with 20m IR range for clear night vision.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1250 to 3250 The price may be higher or lower',
    discount: 'Budget Choice'
  },
  {
    id: 'p110',
    name: 'CP PLUS 1.3MP CUBE CAM 10MTR (CP-UNC-CS13LI-VMW)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Compact wireless cube camera for indoor monitoring with 10m range.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2800 to 4800 The price may be higher or lower',
    discount: 'Wireless'
  },
  {
    id: 'p111',
    name: 'CP PLUS 16CH NVR 1SATA (CP-UNR-216F1-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '16-channel network video recorder with 1 SATA bay for storage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '6500 to 8500 The price may be higher or lower',
    discount: 'Standard NVR'
  },
  {
    id: 'p112',
    name: 'CP PLUS 16CH NVR 2SATA PORT (CP-UNR-4K4162-V4)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Professional 4K 16-channel NVR with dual SATA support for reliability.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '9800 to 11800 The price may be higher or lower',
    discount: '4K Pro'
  },
  {
    id: 'p113',
    name: 'CP PLUS 16CH NVR (CP-UNR-4K2162-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-performance 16-channel NVR for surveillance systems overhead.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '8400 to 10400 The price may be higher or lower',
    discount: 'Reliable'
  },
  {
    id: 'p114',
    name: 'CP PLUS 16PORT GIGA POE (CP-ANW-HP16G2F1-T15)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Gigabit PoE switch with 16 ports for high-speed IP camera networks.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '12500 to 14500 The price may be higher or lower',
    discount: 'Gigabit PoE'
  },
  {
    id: 'p115',
    name: 'CP PLUS 1MP BULLET (CP-USC-TC10PL2-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Entry-level 1MP bullet camera for basic security needs.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '950 to 2950 The price may be higher or lower',
    discount: 'Value'
  },
  {
    id: 'p116',
    name: 'CP PLUS 2.4MP 30MTR BULLET CAMERA (CP-URC-TC24PL3C)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '2.4MP high-resolution bullet camera with impressive 30m night focus.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1850 to 3850 The price may be higher or lower',
    discount: 'High Res'
  },
  {
    id: 'p117',
    name: 'CP PLUS 2.4MP AUDIO COLOUR BULLET 20M (CP-GPC-TA24PL2C-SE-V2-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Full color 2.4MP bullet camera with audio recording capabilities.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2450 to 4450 The price may be higher or lower',
    discount: 'Full Color + Audio'
  },
  {
    id: 'p118',
    name: 'CP PLUS 2.4MP AUDIO COLOUR DOME 20M (CP-GPC-DA24PL2C-SE-V2-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Smart indoor dome with audio and 24/7 color visibility.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2350 to 4350 The price may be higher or lower',
    discount: 'Smart Interior'
  },
  {
    id: 'p119',
    name: 'CP PLUS 2.4MP BULLET 20M (CP USC-TA24L2-360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Standard 2.4MP bullet camera for everyday outdoor security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1550 to 3550 The price may be higher or lower',
    discount: 'Standard'
  },
  {
    id: 'p120',
    name: 'CP PLUS 2.4MP BULLET 80M (CP-USC-TA24L8C-0600)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Long-range 80m bullet camera for large premises monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: 'Long Range'
  },
  {
    id: 'p121',
    name: 'CP PLUS 2.4MP BULLET CAMERA 30MTR (CP-URC-TC24PL3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Robust 2.4MP bullet camera with 30m IR and weatherproof design.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1950 to 3950 The price may be higher or lower',
    discount: 'Weatherproof'
  },
  {
    id: 'p122',
    name: 'CP PLUS 2.4MP COLOUR BULLET 40M (CP-GPC-T24L4-V5)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '40m color night vision bullet camera for wide coverage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2900 to 4900 The price may be higher or lower',
    discount: 'Full Coverage'
  },
  {
    id: 'p123',
    name: 'CP PLUS 2.4MP COLOUR DOME 20M (CP-GPC-DA24PL2-SE-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-quality indoor color dome with 20m IR range.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2100 to 4100 The price may be higher or lower',
    discount: 'Clear View'
  },
  {
    id: 'p124',
    name: 'CP PLUS 2.4MP DOME WITH MIC 30MT (CP-USC-DA24L3C-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Integrated microphone dome camera with 30m range for audio security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2400 to 4400 The price may be higher or lower',
    discount: 'Audio + IR'
  },
  {
    id: 'p125',
    name: 'CP PLUS 2.4MP DUAL LIGHT DOME CAMERA (CP-URC-DC24PL3C-L-V2-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Advanced dual light hybrid dome for superior day and night monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2750 to 4750 The price may be higher or lower',
    discount: 'Hybrid Light'
  },
  {
    id: 'p126',
    name: 'CP PLUS 2.4MP FHD WDR BULLET 60MTR (CP-USC-TA24ZL6-DS)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '60m long-range WDR bullet camera for complex lighting environments.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3800 to 5800 The price may be higher or lower',
    discount: 'WDR Pro'
  },
  {
    id: 'p127',
    name: 'CP PLUS 2.4MP INDIGO BULLET 20M (CP-VAC-T24PL2-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Compact Indigo series bullet camera with sleek design.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1500 to 3500 The price may be higher or lower',
    discount: 'Indigo Edition'
  },
  {
    id: 'p128',
    name: 'CP PLUS 2.4MP WDR BULLET 30MTR (CP-USC-TA24L3-D)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Wide Dynamic Range (WDR) 30m bullet for balanced exposure.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2300 to 4300 The price may be higher or lower',
    discount: 'Balanced'
  },
  {
    id: 'p129',
    name: 'CP PLUS 2MP FHD NETWORK BULLET 30MT (CP-UNC-TA21PL3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Full HD network bullet camera with smart IP monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2900 to 4900 The price may be higher or lower',
    discount: 'Network IP'
  },
  {
    id: 'p130',
    name: 'CP PLUS 2MP FHD NETWORK DOME 30MT (CP-UNC-DA21PL3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'IP-based FHD dome camera for professional interior security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2700 to 4700 The price may be higher or lower',
    discount: 'Professional'
  },
  {
    id: 'p131',
    name: 'CP PLUS 2MP FHD NETWORK DOME (CP-UNC-DA21PL3-V2-0280)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Updated V2 network dome with improved sensor and 30m range.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2850 to 4850 The price may be higher or lower',
    discount: 'Upgraded'
  },
  {
    id: 'p132',
    name: 'CP PLUS 2MP FHD WDR IP BULLET 30MTR (CP-UNC-TB21L3-MDS)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Meta-data supporting WDR IP bullet for intelligent surveillance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3500 to 5500 The price may be higher or lower',
    discount: 'Smart WDR'
  },
  {
    id: 'p133',
    name: 'CP PLUS 2MP FULL HD WDR IP BULLET (CP-UNC-TA21L3-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Versatile V3 series IP bullet with strong WDR performance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: 'V3 Series'
  },
  {
    id: 'p134',
    name: 'CP PLUS 2MP IP 30MTR DUAL LIGHT BULLET (CP-UNC-TA21L3C-L-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Dual light GPC series IP bullet for enhanced identification.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3400 to 5400 The price may be higher or lower',
    discount: 'Dual Illumination'
  },
  {
    id: 'p135',
    name: 'CP PLUS 2MP IP 30MTR DUAL LIGHT DOME (CP-UNC-DA21L3C-L-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'GPC series dual light IP dome with smart color night vision.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3300 to 5300 The price may be higher or lower',
    discount: 'Smart GPC'
  },
  {
    id: 'p136',
    name: 'CP PLUS 2MP IP AUDIO BULLET (CP-UNC-TA21PL3C-V3-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Audio enabled IP bullet with 30m detection and V3 technology.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3150 to 5150 The price may be higher or lower',
    discount: 'Audio Over IP'
  },
  {
    id: 'p137',
    name: 'CP PLUS 2MP IP AUDIO DOME 30M (CP-UNC-DA21PL3C-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Clear audio recording dome with 30m infrared and IP connection.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3050 to 5050 The price may be higher or lower',
    discount: 'Secure Interior'
  },
  {
    id: 'p138',
    name: 'CP PLUS 2MP IP BULLET (CP-UNC-TA21PL3-Y-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Reliable Y-series IP bullet for long-term security monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2600 to 4600 The price may be higher or lower',
    discount: 'Trust Pack'
  },
  {
    id: 'p139',
    name: 'CP PLUS 2 MP IP FHD WDR VANDAL DOME (CP-UNC-VB21L3-MDS)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'IK10 vandal-proof dome for high-risk security areas.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4200 to 6200 The price may be higher or lower',
    discount: 'Vandal Proof'
  },
  {
    id: 'p140',
    name: 'CP PLUS 2MP NETWORK BULLET 50MT (UNC-TA21L5C-V-0600)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Mid-range 50m network bullet for larger outdoor spaces.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3600 to 5600 The price may be higher or lower',
    discount: 'Outdoor Pro'
  },
  {
    id: 'p141',
    name: 'CP PLUS 2MP NETWORK BULLET 80MT (CP-UNC-TA21L8-0600)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Long-range reach with 80m IR for massive perimeter security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4500 to 6500 The price may be higher or lower',
    discount: 'Perimeter Star'
  },
  {
    id: 'p142',
    name: 'CP PLUS 2MP NETWORK BULLET GUARD+ (CP-UNC-TA21L2-GP)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Guard+ series camera with enhanced day/night sensitivity.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3100 to 5100 The price may be higher or lower',
    discount: 'Guard+'
  },
  {
    id: 'p143',
    name: 'CP PLUS 2MP NETWORK DOME (CP-UNC-DA21L3B-LQ)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Interactive dome camera with built-in mic and speaker.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3800 to 5800 The price may be higher or lower',
    discount: '2-Way Audio'
  },
  {
    id: 'p144',
    name: 'CP PLUS 2MP NETWORK DOME GUARD+ (CP-UNC-DA21L2-GP)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Interior Guard+ dome for premium indoor surveillance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2950 to 4950 The price may be higher or lower',
    discount: 'Guard+ Interior'
  },
  {
    id: 'p145',
    name: 'CP PLUS 2MTR FULL HD IR NETWORK DOME (UNC-DA21PL3C-Y-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-speed 2MP network dome with advanced Y-series optics.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2750 to 4750 The price may be higher or lower',
    discount: 'Elite Tech'
  },
  {
    id: 'p146',
    name: 'CP PLUS 32CH NVR 2SATA PORT (CP-UNR-4K4322-V4)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-capacity 32-channel NVR with dual SATA for extensive storage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '14500 to 16500 The price may be higher or lower',
    discount: '32-Channel Pro'
  },
  {
    id: 'p147',
    name: 'CP PLUS 3MP EZYKAM+ BULLET CAMERA (CP-V31A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '3MP ultra-high resolution EzyKam+ for detailed home monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3400 to 5400 The price may be higher or lower',
    discount: '3MP Clear'
  },
  {
    id: 'p148',
    name: 'CP PLUS 4CH 4K DVR (CP-UVR-0401L1-4KH)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Ultra HD 4K 4-channel DVR for crisp analog recordings.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4500 to 6500 The price may be higher or lower',
    discount: '4K DVR'
  },
  {
    id: 'p149',
    name: 'CP PLUS 4CH 5MP DVR (CP-UVR-0401F1-HC)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '5MP support on 4-channels for high-quality surveillance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: '5MP Ready'
  },
  {
    id: 'p150',
    name: 'CP PLUS 4CH 5MP DVR (CP-UVR-0401F1-IC)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Compact 5MP 4-channel DVR with smart-record features.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3100 to 5100 The price may be higher or lower',
    discount: 'Eco High-Res'
  },
  {
    id: 'p151',
    name: 'CP PLUS 4CH DVR (CP-UVR-0401E1-V4)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Reliable 4-channel DVR for basic analog surveillance setups.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2450 to 4450 The price may be higher or lower',
    discount: 'Reliable'
  },
  {
    id: 'p152',
    name: 'CP PLUS 4CH NVR (CP-UNR-C104F1)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Entry-level 4-channel NVR for IP camera integration.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3400 to 5400 The price may be higher or lower',
    discount: 'IP Ready'
  },
  {
    id: 'p153',
    name: 'CP PLUS 4G ROUTER (CP-XR-DE21-S)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Dedicated 4G router for remote CCTV monitoring without broadband.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '2800 to 4800 The price may be higher or lower',
    discount: 'Remote Access'
  },
  {
    id: 'p154',
    name: 'CP PLUS 4MP COSMIC HDCVI 20M (CP UVC-TA40L2-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '4MP high-resolution cosmic series bullet for crystal clear analog feed.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2150 to 4150 The price may be higher or lower',
    discount: '4MP Clear'
  },
  {
    id: 'p155',
    name: 'CP PLUS 4MP EZYKAM+ BULLET CAMERA (CP-V41A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Smart Wi-Fi 4MP bullet camera for hassle-free home security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3900 to 5900 The price may be higher or lower',
    discount: 'Smart WiFi'
  },
  {
    id: 'p156',
    name: 'CP PLUS 4MP FHD IP NETWORK BULLET (CP-UNC-TA41PL3-Y)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Professional 4MP network bullet for high-end digital surveillance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4200 to 6200 The price may be higher or lower',
    discount: 'Network Pro'
  },
  {
    id: 'p157',
    name: 'CP PLUS 4MP FHD NETWORK DOME (CP-UNC-DS41ML3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Discreet 4MP IP dome with superior night vision capabilities.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3950 to 5950 The price may be higher or lower',
    discount: 'Discreet'
  },
  {
    id: 'p158',
    name: 'CP PLUS 4MP FHD WDR VANDAL DOME (CP-UNC-VB41L3-MDS)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Vandal-proof 4MP WDR camera for tough outdoor or public environments.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '5400 to 7400 The price may be higher or lower',
    discount: 'Vandal Guard'
  },
  {
    id: 'p159',
    name: 'CP PLUS 4MP IP NETWORK BULLET (CP-UNC-TA41PL3C-Y)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Advanced IP bullet with meta-data support for smart identification.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4450 to 6450 The price may be higher or lower',
    discount: 'Meta Smart'
  },
  {
    id: 'p160',
    name: 'CP PLUS 4MP IP NETWORK DOME (CP-UNC-DA41PL3C-Y)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-speed 4MP IP dome with wide landscape coverage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4100 to 6100 The price may be higher or lower',
    discount: 'Wide Angle'
  },
  {
    id: 'p161',
    name: 'CP PLUS 4MP IR NETWORK BULLET (CP-UNC-TA41PL3C-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Infrared focused 4MP bullet for dark perimeter security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3900 to 5900 The price may be higher or lower',
    discount: 'Night Master'
  },
  {
    id: 'p162',
    name: 'CP PLUS 4MP SOLAR BATTERY CAMERA CP-Z44R',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Eco-friendly 4MP solar powered camera for wire-free installations.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '8500 to 10500 The price may be higher or lower',
    discount: 'Solar Powered'
  },
  {
    id: 'p163',
    name: 'CP PLUS 5MP BULLET 20M (USC-TC51PL2-V3-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '5MP super high resolution bullet for detailed face and plate identification.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2650 to 4650 The price may be higher or lower',
    discount: '5MP High-Res'
  },
  {
    id: 'p164',
    name: 'CP PLUS 5MP DOME 20M (CP-USC-DA51PL2-0360)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Superior 5MP indoor dome for ultra-clear interior oversight.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2500 to 4500 The price may be higher or lower',
    discount: 'Top Detail'
  },
  {
    id: 'p165',
    name: 'CP PLUS 5MP INDIGO DOME 20M (CP-VAC-D50L2-V2)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Indigo series 5MP dome with premium sensor for low light.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2900 to 4900 The price may be higher or lower',
    discount: 'Low Light Pro'
  },
  {
    id: 'p166',
    name: 'CP PLUS 6U RACK (CP-HA-RK5545-6LP)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Secure 6U wall-mount rack for housing DVRs and networking gear.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    price: '1850 to 3850 The price may be higher or lower',
    discount: 'Organization'
  },
  {
    id: 'p167',
    name: 'CP PLUS 8CH 4K NVR (UNR-4K2082-V2)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '8-channel 4K NVR for high-definition digital storage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '7800 to 9800 The price may be higher or lower',
    discount: '4K Digital'
  },
  {
    id: 'p168',
    name: 'CP PLUS 8CH 5MP DVR (CP-UVR-0801F1-IC)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Advanced 8-channel DVR optimized for 5MP camera input.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4900 to 6900 The price may be higher or lower',
    discount: 'Mid-Range'
  },
  {
    id: 'p169',
    name: 'CP PLUS 8CH HD DVR (CP-UVR-0801E1-CV4)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Reliable 8-channel HD DVR with V4 architecture for stability.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3850 to 5850 The price may be higher or lower',
    discount: 'Reliable V4'
  },
  {
    id: 'p170',
    name: 'CP PLUS 8CH NVR (CP-UNR-108F1)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Essential 8-channel network video recorder for small networks.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4200 to 6200 The price may be higher or lower',
    discount: 'Standard'
  },
  {
    id: 'p171',
    name: 'CP PLUS 8 PORT GIGA POE SWITCH (CP-DNW-GPU8G2-96-V4)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'High-performance 8-port Gigabit PoE switch for IP surveillance lines.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '7200 to 9200 The price may be higher or lower',
    discount: 'Gigabit PoE'
  },
  {
    id: 'p172',
    name: 'CP PLUS 8 PORT POE SWITCH (CP-ANW-HPU8H2-N12)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Reliable 8-port PoE switch for powering analog-to-IP bridges.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '4500 to 6500 The price may be higher or lower',
    discount: 'Essential'
  },
  {
    id: 'p173',
    name: 'CP PLUS 8 PORT POE SWITCH (CP-SAVW-HPU8H2-96)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Smart Managed 8-port PoE switch for refined network control.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '6400 to 8400 The price may be higher or lower',
    discount: 'Smart Managed'
  },
  {
    id: 'p174',
    name: 'CP PLUS BAGS',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Official branded laptop/equipment bags for field techs and fans.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    price: '850 to 2850 The price may be higher or lower',
    discount: 'Branded'
  },
  {
    id: 'p175',
    name: 'CP PLUS 2.4MP DUAL LIGHT BULLET (CP-URC-TC24PL3C-L-V2)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'V2 Hybrid bullet with dual light support for improved night clarity.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2600 to 4600 The price may be higher or lower',
    discount: 'Hybrid V2'
  },
  {
    id: 'p176',
    name: 'CP PLUS CCTV CABLE (3+1) CO-AXIAL CP-ECC-90RS',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: '90m roll of high-grade copper 3+1 coaxial cable for CCTV.',
    image: 'https://images.unsplash.com/photo-1558444455-241300977800?auto=format&fit=crop&q=80&w=800',
    price: '1450 to 3450 The price may be higher or lower',
    discount: 'Best Quality'
  },
  {
    id: 'p177',
    name: 'CP PLUS CAMERA 4MP (CP-Z43A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Premium Z-series 4MP camera for high-clarity monitoring.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3400 to 5400 The price may be higher or lower',
    discount: 'Z-Series'
  },
  {
    id: 'p178',
    name: 'CP PLUS CAMERA (CP-UNC-TA21L8C-V-0600)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Super long-range IP bullet with refined optics for wide landscapes.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '5200 to 7200 The price may be higher or lower',
    discount: 'Ultra Focus'
  },
  {
    id: 'p179',
    name: 'CP PLUS CAMERA EZYKAM (CP-E21A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Original EzyKam model for simple and effective indoor security.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1850 to 3850 The price may be higher or lower',
    discount: 'Classic'
  },
  {
    id: 'p180',
    name: 'CP PLUS CAMERA EZYKAM (CP-E28A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Refined EzyKam with improved Wi-Fi range and cloud support.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1950 to 3950 The price may be higher or lower',
    discount: 'Enhanced'
  },
  {
    id: 'p181',
    name: 'CP PLUS CAMERA EZYKAM (CP-E38A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-speed pan/tilt EzyKam for comprehensive room coverage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2400 to 4400 The price may be higher or lower',
    discount: 'PT Monitor'
  },
  {
    id: 'p182',
    name: 'CP PLUS CAMERA EZYKAM (EZ-P23)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Portable series EzyKam for quick setup and flexible usage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2100 to 4100 The price may be higher or lower',
    discount: 'Portable'
  },
  {
    id: 'p183',
    name: 'CP PLUS HD 2.4MP 30MTR DOME (CP-URC-DC24PL3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-definition 2.4MP dome with sharp 30m infrared focus.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1900 to 3900 The price may be higher or lower',
    discount: 'HD Dome'
  },
  {
    id: 'p184',
    name: 'CP PLUS CAT6 CABLE 305M (CP-BUT-6TGL1-305)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: '305m industrial grade CAT6 ethernet cable for IP networking.',
    image: 'https://images.unsplash.com/photo-1558444455-241300977800?auto=format&fit=crop&q=80&w=800',
    price: '6800 to 8800 The price may be higher or lower',
    discount: 'Bulk Pack'
  },
  {
    id: 'p185',
    name: 'CP PLUS CCTV CABLE 180 MTR',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: '180m high-performance CCTV cable for extensive building wiring.',
    image: 'https://images.unsplash.com/photo-1558444455-241300977800?auto=format&fit=crop&q=80&w=800',
    price: '2600 to 4600 The price may be higher or lower',
    discount: 'Long Roll'
  },
  {
    id: 'p186',
    name: 'CP PLUS CCTV CABLE 3+1 CO-AXIAL (CP-ECC-180RS)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: '180m premium coaxial cable with improved shielding for interference.',
    image: 'https://images.unsplash.com/photo-1558444455-241300977800?auto=format&fit=crop&q=80&w=800',
    price: '2900 to 4900 The price may be higher or lower',
    discount: 'Premium Shield'
  },
  {
    id: 'p187',
    name: 'CP PLUS CCTV CABLE (3+1) COAXIAL (CP-ECC-90RSO)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: '90m budget-friendly coaxial cable for small residential setups.',
    image: 'https://images.unsplash.com/photo-1558444455-241300977800?auto=format&fit=crop&q=80&w=800',
    price: '1250 to 3250 The price may be higher or lower',
    discount: 'Value Roll'
  },
  {
    id: 'p188',
    name: 'CP PLUS DOME CAMERA FHD 2.4MP (CP-URC-DC24PL2-V3)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Mainstream 2.4MP dome with V3 processing for better color balance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1600 to 3600 The price may be higher or lower',
    discount: 'Popular'
  },
  {
    id: 'p189',
    name: 'CP PLUS DVR 8CH W/O HDD (CP-UVR-0801E1-IC2)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Efficient 8-channel DVR without Hard Drive, ready for customization.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3950 to 5950 The price may be higher or lower',
    discount: 'Custom Ready'
  },
  {
    id: 'p190',
    name: 'CP PLUS DVR HDCVI 16CH (CP-UVR-1601E1-IC2)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Comprehensive 16-channel HDCVI DVR for large scale analog coverage.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '7400 to 9400 The price may be higher or lower',
    discount: '16-Port Link'
  },
  {
    id: 'p191',
    name: 'CP PLUS EZYKAM 3MP WIFI PT (CP-E31A)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: '3MP high-definition Wi-Fi pan/tilt camera with mobile alerts.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2800 to 4800 The price may be higher or lower',
    discount: '3MP Smart'
  },
  {
    id: 'p192',
    name: 'CP PLUS EZY KAM 4G (CP-V32G)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Self-sufficient 4G SIM based camera for areas without Wi-Fi.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4500 to 6500 The price may be higher or lower',
    discount: 'SIM Based'
  },
  {
    id: 'p193',
    name: 'CP PLUS FULL HD IR DOME 2.4MM (CP-URC-DC24PL3C-L)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Hybrid series dome with wide 2.4mm lens for corner-to-corner visibility.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2650 to 4650 The price may be higher or lower',
    discount: 'Wide View'
  },
  {
    id: 'p194',
    name: 'CP PLUS GIGA POE SWITCH (CP-DNW-HPU8G2-96-V3)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: '8 Port PoE + 2 Gigabit Uplink ports for streamlined data management.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '6900 to 8900 The price may be higher or lower',
    discount: 'High Bandwidth'
  },
  {
    id: 'p195',
    name: 'CP PLUS HDCVI 4CH DVR (CP-UVR-0401E1-IC2)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Mainstream 4-channel HDCVI DVR, solid for residential use.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2900 to 4900 The price may be higher or lower',
    discount: 'Home Series'
  },
  {
    id: 'p196',
    name: 'CP Plus IP 2MP Smart Dual Light Bullet (CP-UNC-TA21PL3C)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Next-gen smart dual light IP bullet for intelligent motion discovery.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3200 to 5200 The price may be higher or lower',
    discount: 'Smart Discover'
  },
  {
    id: 'p197',
    name: 'CP-PLUS IP DUAL LIGHT 4MP BULLET (CP-UNC-TA41L3C-L)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'High-end 4MP IP bullet with dual light hybrid performance.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4800 to 6800 The price may be higher or lower',
    discount: '4MP Hybrid'
  },
  {
    id: 'p198',
    name: 'CP-PLUS IP DUAL LIGHT 4MP DOME (CP-UNC-DA41L3C-L)',
    category: 'CCTV',
    brand: 'CP PLUS',
    description: 'Premium 4MP IP dome with dual illumination for indoor clarity.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4500 to 6500 The price may be higher or lower',
    discount: 'Elite Interior'
  },
  {
    id: 'p199',
    name: 'CP PLUS MICRO SD CARD 128GB U3',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'High-speed 128GB U3 card for 4K video recording on IP cameras.',
    image: 'https://images.unsplash.com/photo-1558239027-d4a902589f8a?auto=format&fit=crop&q=80&w=800',
    price: '1450 to 3450 The price may be higher or lower',
    discount: 'U3 Fast'
  },
  {
    id: 'p200',
    name: 'CP PLUS MICRO SD CARD 64GB U3',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Reliable 64GB U3 card optimized for continuous surveillance use.',
    image: 'https://images.unsplash.com/photo-1558239027-d4a902589f8a?auto=format&fit=crop&q=80&w=800',
    price: '850 to 2850 The price may be higher or lower',
    discount: 'Value Speed'
  },
  {
    id: 'p201',
    name: 'CP PLUS POE 4 PORT SW (CP-SAVW-HPU4H2-65)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Smart series 4-port PoE switch with power management.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '2600 to 4600 The price may be higher or lower',
    discount: 'Smart PoE'
  },
  {
    id: 'p202',
    name: 'CP PLUS POE SWITCH 4 PORT (CP-DNW-HPU4H2-48)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Essential 4-port PoE switch for simple IP camera setups.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '1950 to 3950 The price may be higher or lower',
    discount: 'Essential PoE'
  },
  {
    id: 'p203',
    name: 'CP PLUS POWER SUPP-12V 5AMP (CP-MD50-12D)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Dedicated 5A power supply for up to 4 camera units.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    price: '850 to 2850 The price may be higher or lower',
    discount: '4-Ch Power'
  },
  {
    id: 'p204',
    name: 'CP PLUS POWER SUPPLY-12V 10AMP (CP-MD100-120)',
    category: 'Accessories',
    brand: 'CP PLUS',
    description: 'Robust 10A power supply for up to 8 high-power cameras.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    price: '1450 to 3450 The price may be higher or lower',
    discount: '8-Ch Power'
  },
  {
    id: 'p205',
    name: 'ASUS LAPTOP E1404FA-NK3321WS (R3-7320U/8GB/512GB/14")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Thin and light productivity laptop with Ryzen 3 processing power.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '34000 to 36000 The price may be higher or lower',
    discount: 'Student Edition'
  },
  {
    id: 'p206',
    name: 'ASUS LAPTOP E1504FA-BQ2341WS (R3-7320U/16GB/512GB/SILVER)',
    category: 'Laptops',
    brand: 'ASUS',
    description: '15.6-inch laptop with 16GB RAM for smooth multitasking.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '38500 to 40500 The price may be higher or lower',
    discount: 'Value + RAM'
  },
  {
    id: 'p207',
    name: 'ASUS LAPTOP E1504FA-BQ2490WS (RYZEN 5/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Powerful Ryzen 5 laptop for demanding home and office work.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '44000 to 46000 The price may be higher or lower',
    discount: 'Mid-Range Power'
  },
  {
    id: 'p208',
    name: 'ASUS LAPTOP E1504FA-NJ132WS (RYZEN 5/8GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Ryzen 5 performance in a balanced configuration for daily use.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '39500 to 41500 The price may be higher or lower',
    discount: 'Popular Choice'
  },
  {
    id: 'p209',
    name: 'ASUS LAPTOP E1504FA-NJ133WS (R5-7520U/8GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Efficient Ryzen 5 7000 series laptop for the modern professional.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '41000 to 43000 The price may be higher or lower',
    discount: 'New Gen'
  },
  {
    id: 'p210',
    name: 'ASUS LAPTOP E1504FA-NJ1505WS (R5-7520U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'High-speed Ryzen 5 laptop with 16GB RAM for ultimate productivity.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '45500 to 47500 The price may be higher or lower',
    discount: 'Pro Productivity'
  },
  {
    id: 'p211',
    name: 'ASUS LAPTOP E1504FA-NJ322WS (R3-7320U/8GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Balanced Ryzen 3 laptop for essential computing needs.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '35000 to 37000 The price may be higher or lower',
    discount: 'Essential'
  },
  {
    id: 'p212',
    name: 'ASUS LAPTOP FX507ZC4-HN115WS (I5-12500H/8/512/3050-4GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Entry-level gaming laptop with dedicated RTX 3050 graphics.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '68000 to 70000 The price may be higher or lower',
    discount: 'Gaming Ready'
  },
  {
    id: 'p213',
    name: 'ASUS LAPTOP FX607VJB-RL179WS (CORE 5/16/512/RTX 3050-6GB/16")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'High-refresh 16-inch gaming laptop with 6GB VRAM.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '88000 to 90000 The price may be higher or lower',
    discount: '6GB RTX'
  },
  {
    id: 'p214',
    name: 'ASUS LAPTOP K5504VAB-BN416WS (I5-13TH GEN/16GB DDR5/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Premium laptop with 13th Gen Intel and DDR5 memory.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '62000 to 64000 The price may be higher or lower',
    discount: 'DDR5 Speed'
  },
  {
    id: 'p215',
    name: 'ASUS LAPTOP M3607KA-SH099WS (RYZEN AI 5 330/16GB/512GB/16")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Cutting-edge AI-enabled Ryzen laptop with large 16-inch display.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '74000 to 76000 The price may be higher or lower',
    discount: 'AI Powered'
  },
  {
    id: 'p216',
    name: 'ASUS LAPTOP S3407VA-LY075WS (INTEL CORE 5 210H/16GB/512GB/14")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Thin and powerful 14-inch laptop with latest Core 5 processor.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '58500 to 60500 The price may be higher or lower',
    discount: 'Compact Power'
  },
  {
    id: 'p217',
    name: 'ASUS LAPTOP S3407VA-LY080WS (INTEL CORE 5 210H/16GB/512GB/14")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Premium 14-inch laptop optimized for high-performance productivity.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '59000 to 61000 The price may be higher or lower',
    discount: 'Modern Pro'
  },
  {
    id: 'p218',
    name: 'ASUS LAPTOP TP3402VAO-LZ612WS (INTEL I5-13420H/16GB/512GB/14")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Versatile 2-in-1 touchscreen laptop with 13th Gen Intel H-series.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '64500 to 66500 The price may be higher or lower',
    discount: '2-in-1 Touch'
  },
  {
    id: 'p219',
    name: 'ASUS LAPTOP V3607VJ-RP134WS (CORE 5 210H/16GB D5/512GB/RTX 3050-6GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Content creator powerhouse with 144Hz display and RTX 3050.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '78500 to 80500 The price may be higher or lower',
    discount: 'Creator Pro'
  },
  {
    id: 'p220',
    name: 'ASUS LAPTOP V3607VU-RP550WS (INTEL CORE 5 210H/16GB D5/512GB/RTX 4050)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Ultimate 16-inch creator laptop with NVIDIA RTX 4050 graphics.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '95000 to 97000 The price may be higher or lower',
    discount: 'RTX 4050'
  },
  {
    id: 'p221',
    name: 'ASUS LAPTOP X1404VA-NK760WS (I3-1315U/8GB/512GB/14")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Reliable 13th Gen Intel i3 laptop for studies and office.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '36500 to 38500 The price may be higher or lower',
    discount: 'Value i3'
  },
  {
    id: 'p222',
    name: 'ASUS LAPTOP X1404VA-NK761WS (I3-1315U/8GB/512GB/14" FHD)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Full HD 14-inch laptop with efficient 13th Gen power.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '37000 to 39000 The price may be higher or lower',
    discount: 'FHD Clear'
  },
  {
    id: 'p223',
    name: 'ASUS LAPTOP X1404VAP-EB1541WS (INTEL CORE 5 120U/16GB/512GB/14")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Modern Core 5 laptop with 16GB RAM for snappy performance.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '51500 to 53500 The price may be higher or lower',
    discount: 'Modern Choice'
  },
  {
    id: 'p224',
    name: 'ASUS LAPTOP X1404VAP-EB1542WS (INTEL CORE 5 120U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Sleek and powerful Core 5 workstation for home use.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '52000 to 54000 The price may be higher or lower',
    discount: 'Snappy'
  },
  {
    id: 'p225',
    name: 'ASUS LAPTOP X1504VA-BQ321WS (I3-1315U/8GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Budget-friendly 13th Gen i3 laptop for daily tasks.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '35500 to 37500 The price may be higher or lower',
    discount: 'Budget i3'
  },
  {
    id: 'p226',
    name: 'ASUS LAPTOP X1504VA-BQ322WS (I3-1315U/8GB/512GB/15.6")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Classic 15.6-inch laptop with efficient Intel performance.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '36000 to 38000 The price may be higher or lower',
    discount: 'Classic View'
  },
  {
    id: 'p227',
    name: 'ASUS LAPTOP X1504VA-BQ331WS (I3-1315U/12GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Enhanced 12GB RAM configuration for better multi-tasking.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '37500 to 39500 The price may be higher or lower',
    discount: '12GB Boost'
  },
  {
    id: 'p228',
    name: 'ASUS LAPTOP X1504VA-BQ341WS (I3-1315U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'High-performance configuration of the popular X15 series.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '39000 to 41000 The price may be higher or lower',
    discount: 'Max RAM'
  },
  {
    id: 'p229',
    name: 'ASUS LAPTOP X1504VA-BQ342WS (I3-1315U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Silver edition X15 with 16GB RAM and fast SSD.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '39500 to 41500 The price may be higher or lower',
    discount: 'Silver Pro'
  },
  {
    id: 'p230',
    name: 'ASUS LAPTOP X1504VA-BQ343WS (I3-1315U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Efficient i3 model with ample 16GB memory for versatile use.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '40000 to 42000 The price may be higher or lower',
    discount: 'Work Ready'
  },
  {
    id: 'p231',
    name: 'ASUS LAPTOP X1504VAP-BQ1543WS (INTEL CORE 5 120U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'High-end 15.6-inch laptop with latest Gen Core 5 power.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '53500 to 55500 The price may be higher or lower',
    discount: 'Latest Gen'
  },
  {
    id: 'p232',
    name: 'ASUS LAPTOP X1504VAP-BQ224WS (INTEL CORE 5 120U/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Cool Silver 15.6-inch laptop with high-performance specs.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '54000 to 56000 The price may be higher or lower',
    discount: 'Silver Elite'
  },
  {
    id: 'p233',
    name: 'ASUS LAPTOP X1605VA-MB1627WS (I5-13420H/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Powerful 16-inch laptop with H-series Intel i5 for creators.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '58500 to 60500 The price may be higher or lower',
    discount: 'H-Series Power'
  },
  {
    id: 'p234',
    name: 'ASUS LAPTOP X1605VA-MB1628WS (I7-13620H/16GB/512GB/16")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'High-performance Intel i7 laptop for professional grade work.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '72000 to 74000 The price may be higher or lower',
    discount: 'i7 Master'
  },
  {
    id: 'p235',
    name: 'ASUS LAPTOP X1607CA-MB139WS (ULTRA 5-225H/16GB/512GB/16")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Next-gen Intel Ultra series laptop with 16-inch display.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '82000 to 84000 The price may be higher or lower',
    discount: 'Ultra Tech'
  },
  {
    id: 'p236',
    name: 'ASUS LAPTOP X415EA-EB502TS',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Essential laptop for daily usage with proven design.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '32500 to 34500 The price may be higher or lower',
    discount: 'Daily Essential'
  },
  {
    id: 'p237',
    name: 'ASUS TUF GAMING FA506NCG-HN200WS (R7-7445HS/RTX3050/16GB/512GB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Powerful Ryzen 7 gaming laptop with RTX 3050 and 144Hz screen.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    price: '71500 to 73500 The price may be higher or lower',
    discount: 'TUF Gaming'
  },
  {
    id: 'p238',
    name: 'ASUS TUF GAMING FA506NCG-HN251WS (R7-7445HS/RTX3050/16GB/1TB)',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'TUF Gaming laptop with massive 1TB SSD for games and apps.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    price: '75500 to 77500 The price may be higher or lower',
    discount: '1TB Storage'
  },
  {
    id: 'p239',
    name: 'ASUS TUF GAMING FA607NUG-RL136WS (R7-7445HS/RTX4050/16GB/16")',
    category: 'Laptops',
    brand: 'ASUS',
    description: 'Elite 16-inch gaming laptop with NVIDIA RTX 4050 graphics.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    price: '98000 to 100000 The price may be higher or lower',
    discount: 'RTX 4050 Pro'
  },
  {
    id: 'p240',
    name: 'LENOVO LAPTOP 81WB0190IN',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Reliable Lenovo laptop for student and home office work. Model 81WB0190IN.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '40352 to 42352 The price may be higher or lower',
    discount: 'Jhargram Special'
  },
  {
    id: 'p241',
    name: 'LENOVO LAPTOP 81WE01MYIN',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Thin and light Lenovo laptop with essential features for daily computing.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '36633 to 38633 The price may be higher or lower',
    discount: 'Everyday Value'
  },
  {
    id: 'p242',
    name: 'LENOVO LAPTOP 82H801CSIN',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'High-performance configuration with sharp display and fast storage.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '39746 to 41746 The price may be higher or lower',
    discount: 'Smart Buy'
  },
  {
    id: 'p243',
    name: 'LENOVO LAPTOP 82K200X6IN',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Powerful Lenovo laptop for advanced productivity and multitasking.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '48403 to 50403 The price may be higher or lower',
    discount: 'Performance'
  },
  {
    id: 'p244',
    name: 'LENOVO LAPTOP 82R4011MIN (R5-5500U/8GB/512GB)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Ryzen 5 5500U powerhouse for creators and students alike.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '34500 to 36500 The price may be higher or lower',
    discount: 'Ryzen 5 Power'
  },
  {
    id: 'p245',
    name: 'LENOVO LAPTOP 82RK00VWIN (I3-12TH/8GB/512GB)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: '12th Gen Intel i3 performance for modern application speeds.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '38000 to 40000 The price may be higher or lower',
    discount: '12th Gen Gen'
  },
  {
    id: 'p246',
    name: 'LENOVO LAPTOP 82VG00T8IN (RYZEN 3-7320U/8GB/512GB)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Efficient Ryzen 3 7000 series laptop for the smart professional.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '32500 to 34500 The price may be higher or lower',
    discount: 'Fresh Tech'
  },
  {
    id: 'p247',
    name: 'LENOVO LAPTOP 83DA003GIN (ULTRA5 125H/16GB/1TB/14")',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Ultra 5 series with 1TB of super-fast storage for professional collections.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '74500 to 76500 The price may be higher or lower',
    discount: 'Ultra 1TB'
  },
  {
    id: 'p248',
    name: 'LENOVO LAPTOP 83K100C6IN (I5-13420H/16GB/512GB)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Professional grade 13th Gen i5 laptop with 16GB RAM and MSO-24.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '55500 to 57500 The price may be higher or lower',
    discount: 'Business Pro'
  },
  {
    id: 'p249',
    name: 'LENOVO LAPTOP 83K100CAIN (I5-13420H/8GB/512GB)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Discreet and powerful 13th Gen i5 laptop for everyday multitasking.',
    image: 'https://images.unsplash.com/photo-1541806757478-de20b5723b7e?auto=format&fit=crop&q=80&w=800',
    price: '48000 to 50000 The price may be higher or lower',
    discount: 'Pure i5'
  },
  {
    id: 'p250',
    name: 'LENOVO LAPTOP 83LK009VIN (I5-12450HX/16GB/512GB/RTX3050)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Gaming and workstation powerhouse with NVIDIA RTX graphics.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '68500 to 70500 The price may be higher or lower',
    discount: 'Gaming Ready'
  },
  {
    id: 'p251',
    name: 'LENOVO LAPTOP 83LK0031IN (I5-12450HX/12GB/512GB/RTX2050)',
    category: 'Laptops',
    brand: 'LENOVO',
    description: 'Balanced entry gaming laptop with 12GB RAM and RTX 2050.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '55000 to 57000 The price may be higher or lower',
    discount: 'Budget Gaming'
  },
  {
    id: 'p252',
    name: 'HP LAPTOP 15-EG3027TU',
    category: 'Laptops',
    brand: 'HP',
    description: 'Sleek HP 15 series laptop for modern productivity and style.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '54990 to 56990 The price may be higher or lower',
    discount: 'Premium HP'
  },
  {
    id: 'p253',
    name: 'HP LAPTOP 15-FB3012AX (R5-8645HS/16GB/512GB/RTX3050)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Victus gaming laptop with Ryzen 5 and dedicated RTX graphics.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '54027 to 56027 The price may be higher or lower',
    discount: 'Victus Gaming'
  },
  {
    id: 'p254',
    name: 'HP LAPTOP 15-FC0502AU (R3-7320U/8GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Everyday budget laptop with efficient Ryzen 3 processing.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '25436 to 27436 The price may be higher or lower',
    discount: 'Budget Fit'
  },
  {
    id: 'p255',
    name: 'HP LAPTOP 15-FD0465TU (I3-13TH/8GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Reliable 13th Gen Intel i3 laptop for studies and office.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '30195 to 32195 The price may be higher or lower',
    discount: 'Value i3'
  },
  {
    id: 'p256',
    name: 'HP LAPTOP 15-FD0466TU (I5-13TH/8GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Solid 13th Gen Intel i5 laptop for multi-tasking performance.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '39469 to 41469 The price may be higher or lower',
    discount: 'Standard i5'
  },
  {
    id: 'p257',
    name: 'HP LAPTOP 15-FD0582TU (I3-13TH/8GB/512GB/BACKLIT)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Professional i3 laptop with backlit keyboard and MSO-24.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '29258 to 31258 The price may be higher or lower',
    discount: 'Office Ready'
  },
  {
    id: 'p258',
    name: 'HP LAPTOP 15-FD0624TU (I3-13TH/8GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Balanced 13th Gen i3 laptop for daily entertainment and work.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '31361 to 33361 The price may be higher or lower',
    discount: 'Reliable'
  },
  {
    id: 'p259',
    name: 'HP LAPTOP 15-FD0640TU (INTEL CORE 5 120U/16GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'High-performance Core 5 laptop with 16GB RAM for heavy users.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '44078 to 46078 The price may be higher or lower',
    discount: 'Top Tier'
  },
  {
    id: 'p260',
    name: 'HP LAPTOP 15-FD0682TU (CORE 5 120U/16GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Professional Core 5 laptop optimized for business productivity.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '45860 to 47860 The price may be higher or lower',
    discount: 'Business Elite'
  },
  {
    id: 'p261',
    name: 'HP LAPTOP 15-FD0883TU (INTEL CORE 3 100U/8GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Modern Core 3 laptop for everyday efficiency and reliability.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '36271 to 38271 The price may be higher or lower',
    discount: 'Core 3 Value'
  },
  {
    id: 'p262',
    name: 'HP LAPTOP 15-FD1254TU (ULTRA 5 125H/16GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Next-gen Intel Ultra 5 powered laptop for advanced mobile computing.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '54915 to 56915 The price may be higher or lower',
    discount: 'Ultra Series'
  },
  {
    id: 'p263',
    name: 'HP LAPTOP 15-FD1284TU (CORE 3 100U/16GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Ample 16GB RAM on a Core 3 platform for smooth day-to-day usage.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '35894 to 37894 The price may be higher or lower',
    discount: 'Smart Balance'
  },
  {
    id: 'p264',
    name: 'HP LAPTOP 15-FR0045TU (I5-13420H/16GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Power-packed i5 H-series laptop for designers and gamers.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '50677 to 52677 The price may be higher or lower',
    discount: 'H-Series Pro'
  },
  {
    id: 'p265',
    name: 'HP LAPTOP 15S-EQ2223AU',
    category: 'Laptops',
    brand: 'HP',
    description: 'Reliable HP 15s series for student success and office tasks.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '31602 to 33602 The price may be higher or lower',
    discount: 'Student Pick'
  },
  {
    id: 'p266',
    name: 'HP LAPTOP 15S-FR4000TU',
    category: 'Laptops',
    brand: 'HP',
    description: 'Classic HP 15s style with modern internal components.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '36961 to 38961 The price may be higher or lower',
    discount: 'Daily Driver'
  },
  {
    id: 'p267',
    name: 'HP LAPTOP 250R G10 (CORE 3-100U/8GB/512GB)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Turbo Silver business laptop with reliable Core 3 performance.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '29237 to 31237 The price may be higher or lower',
    discount: 'Business Value'
  },
  {
    id: 'p268',
    name: 'HP LAPTOP 255 G10 (R7-7730U/16GB/512GB/DOS)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Ryzen 7 high-performance machine ready for any OS installation.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '38559 to 40559 The price may be higher or lower',
    discount: 'Ryzen 7 Pro'
  },
  {
    id: 'p269',
    name: 'HP LAPTOP VICTUS 15-FA1332TX (I7-13TH/RTX4050)',
    category: 'Laptops',
    brand: 'HP',
    description: 'High-end Victus gaming with 13th Gen i7 and massive RTX 4050.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '81355 to 83355 The price may be higher or lower',
    discount: 'Elite Gaming'
  },
  {
    id: 'p270',
    name: 'HP LAPTOP VICTUS 15-FB0184AX (R5-5600H/8GB/512GB/RX6500M)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Radeon RX6500M powered gaming laptop for unique graphics performance.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '40902 to 42902 The price may be higher or lower',
    discount: 'Radeon Power'
  },
  {
    id: 'p271',
    name: 'HP LAPTOP VICTUS GAMING 15-FB0040AX (R5/GTX1650)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Proven R5 and GTX1650 combo for reliable entry-level gaming.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '46495 to 48495 The price may be higher or lower',
    discount: 'Gaming Classic'
  },
  {
    id: 'p272',
    name: 'HP LAPTOP VICTUS GAMING 15-FB0180AX (R5-5600H/8GB/RTX3050)',
    category: 'Laptops',
    brand: 'HP',
    description: 'RTX 3050 powered Victus for smooth competitive gaming.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '46135 to 48135 The price may be higher or lower',
    discount: 'RTX Deal'
  },
  {
    id: 'p273',
    name: 'HP VICTUS LAPTOP 15-FA1327TX (I5-13420H/16GB/RTX3050-6GB)',
    category: 'Laptops',
    brand: 'HP',
    description: '16GB RAM and 6GB RTX 3050 for heavy duty tasks and gaming.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '60169 to 62169 The price may be higher or lower',
    discount: '6GB VRAM Pro'
  },
  {
    id: 'p274',
    name: 'HP VICTUS LAPTOP 15-FA2191TX (I5-13TH/16GB/RTX3050)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Latest architecture Victus with 13th Gen Intel and RTX gaming.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '52302 to 54302 The price may be higher or lower',
    discount: 'Modern Victus'
  },
  {
    id: 'p275',
    name: 'HP VICTUS LAPTOP 15-FA2303TX (I5-14450HX/24GB/RTX3050)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Massive 24GB RAM and 14th Gen Intel HX power for ultimate speed.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '65677 to 67677 The price may be higher or lower',
    discount: '24GB Overkill'
  },
  {
    id: 'p276',
    name: 'HP VICTUS LAPTOP 16-R1703TX (I5-14450HX/16GB/RTX3050)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Large 16-inch screen and 14th Gen HX performance for gamers.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    price: '68400 to 70400 The price may be higher or lower',
    discount: '16-Inch Power'
  },
  {
    id: 'p277',
    name: 'HP LAPTOP 15-EG3027TU (SILVER EDITION)',
    category: 'Laptops',
    brand: 'HP',
    description: 'Elegant Silver edition laptop with professional look.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    price: '55500 to 57500 The price may be higher or lower',
    discount: 'Elegant'
  },
  {
    id: 'p278',
    name: 'DELL LAPTOP G-15 OGN5530003P01RINO (I5-13TH/16GB/512GB/RTX3050)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'High-performance G-series gaming laptop with 13th Gen Intel and RTX 3050.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '72500 to 74500 The price may be higher or lower',
    discount: 'G-Series Elite'
  },
  {
    id: 'p279',
    name: 'DELL LAPTOP INS5440-OIN54403003C1RINU10 (CORE3/8GB/512GB/DOS)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Practical Core 3 laptop for professional work, ready for OS custom setup.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '34000 to 36000 The price may be higher or lower',
    discount: 'Business Ready'
  },
  {
    id: 'p280',
    name: 'DELL LAPTOP INSPIRON ODC1525585001RINB1 (R5-7520U/8GB/512GB/BLACK)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Sleek Black Inspiron with Ryzen 5 power for smooth daily multitasking.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '42500 to 44500 The price may be higher or lower',
    discount: 'Sleek Black'
  },
  {
    id: 'p281',
    name: 'DELL LAPTOP INSPIRON ODC1525585101RINB1 (R3-7320U/8GB/512GB/BLACK)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Reliable Inspiron 15 with Ryzen 3, perfect for students and home use.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '37500 to 39500 The price may be higher or lower',
    discount: 'Student Value'
  },
  {
    id: 'p282',
    name: 'DELL LAPTOP ODC1525000401RINS1 (I5-13TH/16GB/512GB/FHD/SILVER)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Premium Silver configuration with 13th Gen i5 and 16GB RAM.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '56800 to 58800 The price may be higher or lower',
    discount: 'Silver Pro'
  },
  {
    id: 'p283',
    name: 'DELL LAPTOP ODC1525002001RINB1 (INTEL CORE 3-100U/8GB/512GB/BLACK)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Modern Core 3 black edition laptop for reliable performance.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '36500 to 38500 The price may be higher or lower',
    discount: 'Core 3 Black'
  },
  {
    id: 'p284',
    name: 'DELL LAPTOP ODC1525002001RINS1 (INTEL CORE 3-100U/8GB/512GB/SILVER)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Elegant Silver laptop with latest Core 3 processor for great value.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '37000 to 39000 The price may be higher or lower',
    discount: 'Elegant Silver'
  },
  {
    id: 'p285',
    name: 'DELL LAPTOP ODC1525580201RINS1 (RYZEN 5/16GB/512GB/SILVER)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Powerful Ryzen 5 silver laptop with ample 16GB memory.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '46500 to 48500 The price may be higher or lower',
    discount: 'Ryzen Elite'
  },
  {
    id: 'p286',
    name: 'DELL LAPTOP OGN55301106G201RINO (I5-13TH/16GB/1TB/RTX3050)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'High-performance gaming machine with RTX 3050 and 1TB storage.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '78000 to 80000 The price may be higher or lower',
    discount: 'G-Series 1TB'
  },
  {
    id: 'p287',
    name: 'DELL LAPTOP OIN353034011RINB1MO (I5-13TH GEN/8GB/512GB/BLACK)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Stealthy Black edition i5 laptop for professional mobility.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '44500 to 46500 The price may be higher or lower',
    discount: 'Pro Stealth'
  },
  {
    id: 'p288',
    name: 'DELL LAPTOP OIN353034011RINS1M (I5-13TH/8GB/512GB/SILVER)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Classic Silver i5 laptop with balanced specs for home and office.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '45000 to 47000 The price may be higher or lower',
    discount: 'Office Classic'
  },
  {
    id: 'p289',
    name: 'DELL LAPTOP OIN54453522F1RINU10 (R5/16GB/512GB/14" FHD)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Compact 14-inch Ryzen 5 laptop with high-speed memory focus.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '48500 to 50500 The price may be higher or lower',
    discount: 'Ryzen Compact'
  },
  {
    id: 'p290',
    name: 'DELL LAPTOP OIN7640150101RINU1 (I5-13TH/16GB/512GB/16" FHD)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Large 16-inch display with 13th Gen Intel power for clear oversight.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '55500 to 57500 The price may be higher or lower',
    discount: 'Big Screen i5'
  },
  {
    id: 'p291',
    name: 'DELL LAPTOP VOSTRO VN35205KF550020RG1 (I5-12TH/8GB/512GB)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Vostro business laptop with proven i5 reliability and MSO.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '46000 to 48000 The price may be higher or lower',
    discount: 'Business Vostro'
  },
  {
    id: 'p292',
    name: 'LAPTOP DELL PRO 15 PV15255 (AMD R5 7520U/8GB/512GB)',
    category: 'Laptops',
    brand: 'DELL',
    description: 'Professional 15.6-inch laptop with efficient Ryzen 5 processing.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    price: '43500 to 45500 The price may be higher or lower',
    discount: 'Pro Productivity'
  },
  {
    id: 'p293',
    name: 'LENOVO MONITER 66BCAC1IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'High-quality Lenovo monitor with sharp visuals for office work.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '8950 to 10950 The price may be higher or lower',
    discount: 'Clear View'
  },
  {
    id: 'p294',
    name: 'LENOVO MONITER 66CFAC1IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Sleek design monitor optimized for home entertainment and productivity.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '9450 to 11450 The price may be higher or lower',
    discount: 'Sleek Fit'
  },
  {
    id: 'p295',
    name: 'LENOVO MONITER 66F0KAC1IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Large display monitor with wide viewing angles and vivid colors.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '12800 to 14800 The price may be higher or lower',
    discount: 'Wide Angle'
  },
  {
    id: 'p296',
    name: 'LENOVO MONITER 66F1KAC1IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Premium monitor with enhanced color accuracy for design professionals.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '14500 to 16500 The price may be higher or lower',
    discount: 'Pro Color'
  },
  {
    id: 'p297',
    name: 'LENOVO MONITER 66F2KAC1IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Reliable everyday monitor with blue-light filter for eye comfort.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '7900 to 9900 The price may be higher or lower',
    discount: 'Eye Care'
  },
  {
    id: 'p298',
    name: 'LENOVO MONITER 66FBKAC6IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Compact monitor for space-saving desk setups without quality loss.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '6450 to 8450 The price may be higher or lower',
    discount: 'Space Saver'
  },
  {
    id: 'p299',
    name: 'LENOVO MONITER 67B7KAC6IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'High-refresh rate monitor for smooth visual transitions.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '11900 to 13900 The price may be higher or lower',
    discount: 'High Refresh'
  },
  {
    id: 'p300',
    name: 'LENOVO MONITER 67BAKAC6IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Modern borderless monitor for a seamless dual-screen experience.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '10500 to 12500 The price may be higher or lower',
    discount: 'Borderless'
  },
  {
    id: 'p301',
    name: 'LENOVO MONITER 67BBKAC6IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Versatile monitor with adjustable stand for ergonomic comfort.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '13200 to 15200 The price may be higher or lower',
    discount: 'Ergo Stand'
  },
  {
    id: 'p302',
    name: 'LENOVO MONITER 67BCKAC6IN',
    category: 'Monitors',
    brand: 'LENOVO',
    description: 'Top-of-the-line Lenovo monitor with ultra-crisp resolution.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    price: '16800 to 18800 The price may be higher or lower',
    discount: 'Ultra Crisp'
  },
  {
    id: 'p303',
    name: 'MOTHERBOARD MSI B550M-A PRO',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Reliable micro-ATX B550 motherboard for Ryzen processors.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '5475 to 7475 The price may be higher or lower',
    discount: 'Ryzen 5000 Ready'
  },
  {
    id: 'p304',
    name: 'MOTHERBOARD MSI B760M-A PRO WIFI DDR5',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Next-gen B760 motherboard with DDR5 support and built-in WiFi.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '12100 to 14100 The price may be higher or lower',
    discount: 'DDR5 + WiFi'
  },
  {
    id: 'p305',
    name: 'MOTHERBOARD MSI H510M PLUS II',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Essential H510 chipset for 10th and 11th Gen Intel CPUs.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '4218 to 6218 The price may be higher or lower',
    discount: 'Budget Intel'
  },
  {
    id: 'p306',
    name: 'MOTHERBOARD MSI H610M-E PRO',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Reliable H610 motherboard for 12th, 13th, and 14th Gen Intel.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '5223 to 7223 The price may be higher or lower',
    discount: 'Intel 14th Gen'
  },
  {
    id: 'p307',
    name: 'MOTHERBOARD MSI MPG B550 GAMING PLUS',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Full ATX gaming motherboard with robust power delivery and RGB.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '11050 to 13050 The price may be higher or lower',
    discount: 'Gaming Elite'
  },
  {
    id: 'p308',
    name: 'MOTHERBOARD MSI PRO B650M-B DDR5',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Productivity-focused B650 motherboard for Ryzen 7000/8000/9000.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '7833 to 9833 The price may be higher or lower',
    discount: 'Ryzen 7000'
  },
  {
    id: 'p309',
    name: 'MOTHERBOARD MSI PRO B650-S WIFI DDR5',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Versatile B650 board with WiFi 6E and DDR5 support.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '12050 to 14050 The price may be higher or lower',
    discount: 'WiFi 6E Ready'
  },
  {
    id: 'p310',
    name: 'MSI-B450M-PRO-VDH-MAX',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'The classic B450 workhorse for AMD Ryzen builds.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '4300 to 6300 The price may be higher or lower',
    discount: 'Value King'
  },
  {
    id: 'p311',
    name: 'MSI B760M BOMBER WIFI DDR5 MBD',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'High-performance DDR5 gaming motherboard with military-inspired design.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '9281 to 11281 The price may be higher or lower',
    discount: 'Bomber Edition'
  },
  {
    id: 'p312',
    name: 'MSI B760M-E PRO DDR4 MOTHERBOARD',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Reliable B760 motherboard using affordable DDR4 memory.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '6875 to 8875 The price may be higher or lower',
    discount: 'DDR4 Support'
  },
  {
    id: 'p313',
    name: 'MSI B760M-E PRO DDR5 MBD',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Entry-level B760 DDR5 motherboard for modern Intel builds.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '8000 to 10000 The price may be higher or lower',
    discount: 'Modern Tech'
  },
  {
    id: 'p314',
    name: 'MSI B760M MORTAR WIFI II D5 MBD',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Elite Mortar series with robust VRM and advanced cooling tags.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '15200 to 17200 The price may be higher or lower',
    discount: 'Mortar Elite'
  },
  {
    id: 'p315',
    name: 'MSI B760M-P PRO DDR5 MBD',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Professional B760 series with DDR5 for creative workflows.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '9650 to 11650 The price may be higher or lower',
    discount: 'Pro Series'
  },
  {
    id: 'p316',
    name: 'MSI MOTHERBOARD B650M GAMING WIFI DDR5',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Optimized gaming motherboard for AM5 platform with WiFi.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '8533 to 10533 The price may be higher or lower',
    discount: 'AM5 Gaming'
  },
  {
    id: 'p317',
    name: 'MSI MOTHERBOARD B760M GAMING WIFI DDR5',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'Balanced gaming features for Intel 13th and 14th Gen CPUs.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '9650 to 11650 The price may be higher or lower',
    discount: 'Intel Gamer'
  },
  {
    id: 'p318',
    name: 'MSI MOTHERBOARD Z790-S PRO WIFI DDR5',
    category: 'Motherboards',
    brand: 'MSI',
    description: 'High-end Z790 platform with overclocking support and WiFi.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    price: '18500 to 20500 The price may be higher or lower',
    discount: 'Enthusiast'
  },
  {
    id: 'p319',
    name: 'SECUREYE 1 PORT 10/100/1000 MEDIA CONVERTER (PAIR) S-SMSF-GE',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Gigabit media converter pair for seamless fiber-to-ethernet transition. Stock: 18 PCS',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '2400 to 4400 The price may be higher or lower',
    discount: 'Gigabit'
  },
  {
    id: 'p320',
    name: 'SECUREYE 1 PORT 10/100 MEDIA CONVERTER (PAIR) S-SMSF-FE',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Reliable fast ethernet media converter pair for fiber networking. Stock: 9 PCS',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '1500 to 3500 The price may be higher or lower',
    discount: 'Essential'
  },
  {
    id: 'p321',
    name: 'SECUREYE 2MP DUO BULLET CAMERA (SP-C2RN)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'High-definition 2MP bullet camera with crisp day/night visibility. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2100 to 4100 The price may be higher or lower',
    discount: 'Classic'
  },
  {
    id: 'p322',
    name: 'SECUREYE 2 SATA 32CH NVR (SP-R232)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Enterprise grade 32-channel NVR with dual SATA support. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '14500 to 16500 The price may be higher or lower',
    discount: 'Enterprise'
  },
  {
    id: 'p323',
    name: 'SECUREYE 4G PT DEFENDER DUE LINKAGE (S-SSD-PTZ5)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Advanced 4G PTZ camera with smart linkage for perimeter defense. Stock: 5 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '6800 to 8800 The price may be higher or lower',
    discount: '4G Smart'
  },
  {
    id: 'p324',
    name: 'SECUREYE 4G CAMERA PT LENSGUARD (SC-PTZ1-G)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Reliable 4G pan-tilt camera with protective lens housing. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '4900 to 6900 The price may be higher or lower',
    discount: '4G Ready'
  },
  {
    id: 'p325',
    name: 'SECUREYE 4G DUAL LANCE SOLAR CAMERA (S-SSD-PTZ8)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Solar-powered dual lens 4G camera for off-grid surveillance. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '9500 to 11500 The price may be higher or lower',
    discount: 'Solar Pro'
  },
  {
    id: 'p326',
    name: 'SECUREYE 4G PT CAMERA SOLAR EYE DUO (S-CWC200)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Compact solar eye duo 4G camera for outdoor security. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '8200 to 10200 The price may be higher or lower',
    discount: 'Eco Power'
  },
  {
    id: 'p327',
    name: 'SECUREYE 4MP IP DOME CAMERA (SP-C4XN-13W)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'High-resolution 4MP IP dome camera with wide field of view. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3600 to 5600 The price may be higher or lower',
    discount: '4MP Sharp'
  },
  {
    id: 'p328',
    name: 'SECUREYE BODY WORN DIGITAL CAMERA (SC-S-BW15)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Professional body-worn camera for security and law enforcement. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '12000 to 14000 The price may be higher or lower',
    discount: 'Professional'
  },
  {
    id: 'p329',
    name: 'SECUREYE HANDHELD METAL DETECTOR (SC-S-HMD-200)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'High sensitivity handheld metal detector for security screening. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '1250 to 3250 The price may be higher or lower',
    discount: 'Safety'
  },
  {
    id: 'p330',
    name: 'SECUREYE IP FACE + FINGER BIOMETRIC READER (SC-S-FB6K)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Advanced biometric attendance and access control with face recognition. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '8500 to 10500 The price may be higher or lower',
    discount: 'Biometric'
  },
  {
    id: 'p331',
    name: 'SECUREYE MAGNETIC LOCK 280KG SINGLE (SC-S-280S-1)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Strong 280kg holding force electromagnetic lock for secure doors. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2200 to 4200 The price may be higher or lower',
    discount: 'Security'
  },
  {
    id: 'p332',
    name: 'SECUREYE N300 S-XPON-1000-WDONT-R-N',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'High-speed XPON ONU and router with N300 wireless capability. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '1850 to 3850 The price may be higher or lower',
    discount: 'Network Hub'
  },
  {
    id: 'p333',
    name: 'SECUREYE N300 S-XPON-1110-WDONT',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Versatile data, voice, and WiFi XPON end-point for modern offices. Stock: 17 PCS',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    price: '1950 to 3950 The price may be higher or lower',
    discount: 'Office Ready'
  },
  {
    id: 'p334',
    name: 'SECUREYE WIFI CAMERA PT LENSGUARD (S-PTZ2-W)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Discreet WiFi pan-tilt camera with smart lens protection. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2600 to 4600 The price may be higher or lower',
    discount: 'WiFi Master'
  },
  {
    id: 'p335',
    name: 'SECUREYE WIFI PT CAMERA LENSGUARD DUO (S-PTZ-4W)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Enhanced duo lens WiFi PTZ camera for comprehensive coverage. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3400 to 5400 The price may be higher or lower',
    discount: 'Duo Lens'
  },
  {
    id: 'p336',
    name: 'SECUREYE WIFI VIDEO CALLING PT CAMERA (SC-S-CCI)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Innovative talk-frame camera supporting two-way video communication. Stock: 9 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '3800 to 5800 The price may be higher or lower',
    discount: 'Video Call'
  },
  {
    id: 'p337',
    name: 'SECUREYE 2MP IP BULLET CAMERA (SP-C2QN-13V2.0)',
    category: 'CCTV',
    brand: 'SECUREYE',
    description: 'Updated 2MP IP bullet camera with superior night low-light performance. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    price: '2350 to 4350 The price may be higher or lower',
    discount: 'V2.0 Pro'
  },
  {
    id: 'p338',
    name: 'EPSON BUSINESS PROJECTOR EB-E12',
    category: 'Projectors',
    brand: 'EPSON',
    description: 'High-quality business projector with 3LCD technology for bright and vivid presentations. Stock: 6 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '20800 to 22800 The price may be higher or lower',
    discount: 'Professional'
  },
  {
    id: 'p339',
    name: 'PROJECTOR SCREEN 4x6 SLOW AUTO LOCK',
    category: 'Projectors',
    brand: 'Generic',
    description: 'Manual slow-retraction projector screen, 4x6 feet, with auto-lock mechanism. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '2550 to 4550 The price may be higher or lower',
    discount: 'Auto-Lock'
  },
  {
    id: 'p340',
    name: 'PROJECTOR SCREEN ZEB 84" MOTORIZED PSM84A',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Smart motorized projector screen for effortless home theater setup. Stock: 2 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '4650 to 6650 The price may be higher or lower',
    discount: 'Motorized'
  },
  {
    id: 'p341',
    name: 'ZEBRONICS PROJECTOR LED (PIXAPLAY 27)',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'High-brightness LED projector for crisp home entertainment. Stock: 3 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '17750 to 19750 The price may be higher or lower',
    discount: 'LED Bright'
  },
  {
    id: 'p342',
    name: 'ZEBRONICS PROJECTOR LED PIXA PLAY 51',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Affordable and compact LED projector for entry-level home cinema. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '5400 to 7400 The price may be higher or lower',
    discount: 'Entry Choice'
  },
  {
    id: 'p343',
    name: 'ZEBRONICS PROJECTOR LED (PIXAPLAY 58)',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Versatile LED projector with great color reproduction for movies and gaming. Stock: 4 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '12100 to 14100 The price may be higher or lower',
    discount: 'Versatile'
  },
  {
    id: 'p344',
    name: 'ZEBRONICS PROJECTOR PIXA PLAY 17',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Balanced performance projector for everyday home and office use. Stock: 1 PCS',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '15000 to 17000 The price may be higher or lower',
    discount: 'Balanced'
  },
  {
    id: 'p345',
    name: 'ZEBRONICS PROJECTOR PIXA PLAY 33',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Advanced Pixa Play series projector for immersive visual experience.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '12500 to 14500 The price may be higher or lower',
    discount: 'Popular'
  },
  {
    id: 'p346',
    name: 'ZEBRONICS PROJECTOR PIXA PLAY 55',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Sleek and powerful LED projector with high contrast ratio.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '10500 to 12500 The price may be higher or lower',
    discount: 'Sleek'
  },
  {
    id: 'p347',
    name: 'ZEBRONICS PROJECTOR PIXA PLAY 59',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'High-resolution gaming projector with low latency and vibrant output.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '13800 to 15800 The price may be higher or lower',
    discount: 'Gamer Choice'
  },
  {
    id: 'p348',
    name: 'ZEBRONICS PROJECTOR PIXA PLAY 62',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Professional grade home cinema projector for enthusiasts.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '16500 to 18500 The price may be higher or lower',
    discount: 'Enthusiast'
  },
  {
    id: 'p349',
    name: 'ZEBRONICS PROJECTOR PIXA PLAY 64',
    category: 'Projectors',
    brand: 'ZEBRONICS',
    description: 'Top-of-the-line Pixa Play model with ultimate brightness and smart features.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    price: '18900 to 20900 The price may be higher or lower',
    discount: 'Ultimate'
  }
];

export const GALLERY_IMAGES = [
  {
    url: 'https://lh3.googleusercontent.com/p/AF1QipPWUyOc6qlWd1DuwxsaQLFmHW5rNTkop2o8tR3b=s680-w680-h510-rw',
    title: 'Store Front',
    description: 'Our primary hub at Raghunathpur, Jhargram'
  },
  {
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    title: 'Gaming Zone',
    description: 'Latest gaming assemblies ready for action'
  },
  {
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    title: 'Premium Laptops',
    description: 'A wide range of MacBook and Windows laptops'
  },
  {
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    title: 'Surveillance Tech',
    description: 'Advanced CCTV solutions for total security'
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    title: 'Expert Service',
    description: 'Precision hardware repair and servicing'
  },
  {
    url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    title: 'Digital Community',
    description: 'Follow our tech journey on Social Media'
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
    title: 'Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    description: 'IPS, LED, and High-Refresh rate gaming monitors.'
  },
  {
    title: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    description: 'Keyboards, mice, and essential tech peripherals.'
  },
  {
    title: 'Processors',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    description: 'AMD Ryzen and Intel Core high-performance CPUs.'
  },
  {
    title: 'Motherboards',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    description: 'Stable and feature-rich MSI, ASUS, and Gigabyte boards.'
  },
  {
    title: 'Projectors',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    description: 'High-brightness business and home cinema projectors.'
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
