export type Role = 'farmer' | 'buyer' | 'storage_owner';

export type Language =
  | 'English'
  | 'Telugu'
  | 'Hindi';

export interface User {
  username: string;
  email: string;
  role: Role;
  name: string;
  phone: string;
  location: string;
  preferredLanguage: Language;
  cropsGrown?: string;
  businessName?: string;
  buyerType?: string;
  profileImage?: string;
}

export const LANGUAGES: Language[] = [
  'English',
  'Telugu',
  'Hindi',
];

export interface MarketPrice {
  id: number;
  crop: string;
  market: string;
  price: number;
  unit: string;
  updated: string;
}

export interface Buyer {
  id: number;
  username?: string;
  name: string;
  businessName: string;
  location: string;
  crop: string;
  quantity: number;
  price: number;
  contact: string;
}

export interface Request {
  id: number;
  buyerId: number;
  buyerUsername?: string;
  buyerName: string;
  farmerUsername?: string;
  farmerName?: string;
  crop: string;
  quantity: number;
  price: number;
  location: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  date: string;
}

export interface Storage {
  id: number;
  name: string;
  distance: number;
  capacity: number;
  available: number;
  crops: string[];
  cost: string;
  location: string;
  phone: string;
}

export interface Transport {
  id: number;
  name: string;
  capacity: number;
  estimatedCost: number;
  type: string;
}

export interface CropDiagnosis {
  crop: string;
  problem: string;
  confidence: number;
  severity: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
}

export const DEMO_USERS: User[] = [
  {
    username: 'farmer',
    email: 'farmer@demo.com',
    role: 'farmer',
    name: 'Demo Farmer',
    phone: '+91 98765 43210',
    location: 'Tenali, Andhra Pradesh',
    preferredLanguage: 'English',
    cropsGrown: 'Tomato, Chilli, Rice',
  },
  {
    username: 'buyer',
    email: 'buyer@demo.com',
    role: 'buyer',
    name: 'Demo Buyer',
    phone: '+91 87654 32109',
    location: 'Guntur, Andhra Pradesh',
    preferredLanguage: 'English',
    businessName: 'FreshFarm Produce',
    buyerType: 'Business',
  },
];

export const DEMO_PASSWORDS: Record<string, string> = {
  farmer: 'farmer123',
  buyer: 'buyer123',
};

export const MARKET_PRICES: MarketPrice[] = [
  { id: 1, crop: 'Tomato', market: 'Guntur Market', price: 2800, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 2, crop: 'Tomato', market: 'Vijayawada Market', price: 2650, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 3, crop: 'Tomato', market: 'Tenali Market', price: 2550, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 4, crop: 'Tomato', market: 'Ongole Market', price: 2700, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 5, crop: 'Rice', market: 'Guntur Market', price: 2400, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 6, crop: 'Rice', market: 'Vijayawada Market', price: 2350, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 7, crop: 'Rice', market: 'Tenali Market', price: 2300, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 8, crop: 'Chilli', market: 'Guntur Market', price: 12000, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 9, crop: 'Chilli', market: 'Vijayawada Market', price: 11500, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 10, crop: 'Cotton', market: 'Guntur Market', price: 6500, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 11, crop: 'Cotton', market: 'Ongole Market', price: 6200, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 12, crop: 'Potato', market: 'Vijayawada Market', price: 1800, unit: 'Quintal', updated: '19 Sep 2026' },
  { id: 13, crop: 'Potato', market: 'Tenali Market', price: 1750, unit: 'Quintal', updated: '19 Sep 2026' },
];

export const BUYERS: Buyer[] = [
  { id: 1, name: 'FreshFarm Produce', businessName: 'FreshFarm Produce Pvt Ltd', location: 'Guntur', crop: 'Tomato', quantity: 1000, price: 2700, contact: '+91 90000 11111' },
  { id: 2, name: 'LocalFresh Traders', businessName: 'LocalFresh Trading Co.', location: 'Vijayawada', crop: 'Tomato', quantity: 500, price: 2650, contact: '+91 90000 22222' },
  { id: 3, name: 'GreenHarvest Buyer', businessName: 'GreenHarvest Agro', location: 'Tenali', crop: 'Tomato', quantity: 750, price: 2600, contact: '+91 90000 33333' },
  { id: 4, name: 'RiceWorld Exports', businessName: 'RiceWorld International', location: 'Guntur', crop: 'Rice', quantity: 2000, price: 2380, contact: '+91 90000 44444' },
  { id: 5, name: 'SpiceRoute Traders', businessName: 'SpiceRoute Commerce', location: 'Guntur', crop: 'Chilli', quantity: 500, price: 11800, contact: '+91 90000 55555' },
  { id: 6, name: 'CottonPlus Textiles', businessName: 'CottonPlus Mills', location: 'Ongole', crop: 'Cotton', quantity: 1500, price: 6400, contact: '+91 90000 66666' },
  { id: 7, name: 'Potato King', businessName: 'Potato King Wholesalers', location: 'Vijayawada', crop: 'Potato', quantity: 3000, price: 1780, contact: '+91 90000 77777' },
];

export const STORAGES: Storage[] = [
  { id: 1, name: 'Guntur Cold Storage', distance: 18, capacity: 500, available: 120, crops: ['Tomato', 'Chilli', 'Potato'], cost: '₹2 / crate / day', location: 'Guntur', phone: '+91 80000 11111' },
  { id: 2, name: 'Vijayawada Agro Storage', distance: 35, capacity: 800, available: 250, crops: ['Tomato', 'Rice', 'Cotton'], cost: '₹1.5 / crate / day', location: 'Vijayawada', phone: '+91 80000 22222' },
  { id: 3, name: 'Tenali FarmCool', distance: 12, capacity: 300, available: 80, crops: ['Tomato', 'Potato', 'Chilli'], cost: '₹2.5 / crate / day', location: 'Tenali', phone: '+91 80000 33333' },
  { id: 4, name: 'Ongole AgriCold', distance: 55, capacity: 600, available: 180, crops: ['Cotton', 'Rice'], cost: '₹1.8 / crate / day', location: 'Ongole', phone: '+91 80000 44444' },
];

export const TRANSPORTS: Transport[] = [
  { id: 1, name: 'Mini Truck', capacity: 1000, estimatedCost: 1200, type: 'Mini Truck' },
  { id: 2, name: 'Small Cargo Truck', capacity: 2000, estimatedCost: 2000, type: 'Small Cargo Truck' },
  { id: 3, name: 'Large Cargo Truck', capacity: 5000, estimatedCost: 4500, type: 'Large Cargo Truck' },
  { id: 4, name: 'Refrigerated Van', capacity: 800, estimatedCost: 2800, type: 'Refrigerated Van' },
];

export const CROP_DIAGNOSES: Record<string, CropDiagnosis> = {
  Tomato: {
    crop: 'Tomato',
    problem: 'Early Blight',
    confidence: 92,
    severity: 'Moderate',
    symptoms: ['Brown spots on leaves', 'Yellowing leaves', 'Leaf damage', 'Dark lesions with concentric rings'],
    treatments: [
      'Remove badly affected leaves.',
      'Keep the field clean and free of debris.',
      'Avoid excessive moisture on leaves.',
      'Monitor nearby plants closely.',
      'Apply copper-based fungicide if advised by an expert.',
    ],
    prevention: ['Maintain field cleanliness', 'Inspect crops regularly', 'Avoid unnecessary leaf wetness', 'Use disease-resistant varieties when possible'],
  },
  Rice: {
    crop: 'Rice',
    problem: 'Bacterial Leaf Blight',
    confidence: 88,
    severity: 'Moderate',
    symptoms: ['Water-soaked leaf edges', 'Yellow to white stripes along leaf margins', 'Wilting of seedlings'],
    treatments: [
      'Drain excess water from fields.',
      'Remove and destroy infected plant parts.',
      'Avoid excessive nitrogen fertilizer.',
      'Consult an agricultural expert for treatment options.',
    ],
    prevention: ['Use certified seeds', 'Maintain proper field drainage', 'Avoid injuries to plants during transplanting'],
  },
  Chilli: {
    crop: 'Chilli',
    problem: 'Powdery Mildew',
    confidence: 85,
    severity: 'Mild',
    symptoms: ['White powdery coating on leaves', 'Leaf curling', 'Stunted growth'],
    treatments: [
      'Remove heavily infected leaves.',
      'Improve air circulation around plants.',
      'Avoid overhead irrigation.',
      'Consult expert for appropriate fungicide.',
    ],
    prevention: ['Plant in well-ventilated areas', 'Avoid overcrowding', 'Regular field inspection'],
  },
  Cotton: {
    crop: 'Cotton',
    problem: 'Leaf Spot',
    confidence: 79,
    severity: 'Mild',
    symptoms: ['Round or angular brown spots', 'Yellow halos around spots', 'Premature leaf drop'],
    treatments: [
      'Remove and destroy affected leaves.',
      'Avoid working in fields when plants are wet.',
      'Consult local agricultural office.',
    ],
    prevention: ['Crop rotation', 'Use certified planting material', 'Proper drainage'],
  },
  Potato: {
    crop: 'Potato',
    problem: 'Late Blight',
    confidence: 91,
    severity: 'Severe',
    symptoms: ['Dark brown patches on leaves', 'White mold on underside of leaves', 'Tuber rot'],
    treatments: [
      'Remove and destroy infected plants immediately.',
      'Avoid overhead irrigation.',
      'Ensure proper field drainage.',
      'Seek expert guidance on fungicide application.',
    ],
    prevention: ['Use certified seed potatoes', 'Avoid planting in waterlogged areas', 'Monitor weather conditions'],
  },
};

export const CROPS = [
  'Tomato',
  'Rice',
  'Chilli',
  'Cotton',
  'Potato',
];

export const LOCATIONS = [
  'Guntur',
  'Vijayawada',
  'Tenali',
  'Ongole',
  'All Locations',
];