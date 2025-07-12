// Property Types
export const PROPERTY_TYPES = [
  'Single Room',
  'Chamber and Hall',
  'Two Bedroom',
  'Three Bedroom',
  'Four Bedroom',
  'Five+ Bedroom',
  'Apartment',
  'Studio',
  'House',
  'Commercial Space',
  'Office Space',
  'Shop',
  'Warehouse'
];

// Ghana Cities by Region
export const GHANA_CITIES = {
  'Greater Accra': [
    'Accra', 'Tema', 'Kasoa', 'Madina', 'Adenta', 'Ga East', 'Ga West', 
    'Ashaiman', 'Teshie', 'Nungua', 'Dansoman', 'Achimota', 'East Legon',
    'Airport Residential', 'Cantonments', 'Labone', 'Osu', 'Dzorwulu'
  ],
  'Ashanti': [
    'Kumasi', 'Obuasi', 'Ejisu', 'Juaben', 'Bekwai', 'Mampong', 'Konongo',
    'Asante Akim', 'Asokore Mampong', 'Ejura', 'Offinso'
  ],
  'Western': [
    'Sekondi-Takoradi', 'Tarkwa', 'Prestea', 'Axim', 'Half Assini',
    'Elubo', 'Enchi', 'Wiawso', 'Sefwi Bekwai'
  ],
  'Eastern': [
    'Koforidua', 'Akosombo', 'New Tafo', 'Akim Oda', 'Mpraeso',
    'Begoro', 'Somanya', 'Akropong', 'Aburi', 'Nsawam'
  ],
  'Central': [
    'Cape Coast', 'Elmina', 'Winneba', 'Kasoa', 'Swedru', 'Dunkwa',
    'Agona Swedru', 'Saltpond', 'Anomabu'
  ],
  'Northern': [
    'Tamale', 'Yendi', 'Savelugu', 'Gushegu', 'Karaga', 'Tolon',
    'Kumbungu', 'Sagnarigu'
  ],
  'Volta': [
    'Ho', 'Hohoe', 'Keta', 'Aflao', 'Sogakope', 'Dzodze', 'Akatsi',
    'Kpando', 'Jasikan', 'Kadjebi'
  ],
  'Brong Ahafo': [
    'Sunyani', 'Techiman', 'Berekum', 'Dormaa Ahenkro', 'Nkoranza',
    'Kintampo', 'Wenchi', 'Drobo', 'Sampa'
  ],
  'Upper East': [
    'Bolgatanga', 'Bawku', 'Navrongo', 'Paga', 'Zebilla', 'Garu',
    'Tempane', 'Binduri'
  ],
  'Upper West': [
    'Wa', 'Lawra', 'Jirapa', 'Tumu', 'Nadowli', 'Funsi', 'Gwollu'
  ]
};

// Amenities
export const AMENITIES = [
  'Air Conditioning',
  'Heating',
  'Wi-Fi',
  'Cable TV',
  'Kitchen',
  'Refrigerator',
  'Washing Machine',
  'Dryer',
  'Dishwasher',
  'Microwave',
  'Parking',
  'Garage',
  'Balcony',
  'Terrace',
  'Garden',
  'Swimming Pool',
  'Gym/Fitness Center',
  'Security',
  'CCTV',
  'Generator',
  'Water Storage Tank',
  'Prepaid Meter',
  'Furnished',
  'Semi-Furnished',
  'Unfurnished',
  'Pet Friendly',
  'Elevator',
  'Wheelchair Accessible'
];

// Property Features
export const PROPERTY_FEATURES = [
  'New Construction',
  'Recently Renovated',
  'High Ceilings',
  'Hardwood Floors',
  'Tile Floors',
  'Carpeted',
  'Built-in Wardrobes',
  'Walk-in Closet',
  'En-suite Bathroom',
  'Guest Toilet',
  'Dining Room',
  'Living Room',
  'Family Room',
  'Study Room',
  'Maid\'s Room',
  'Storage Room',
  'Laundry Room',
  'Basement',
  'Attic',
  'Roof Top Access'
];

// Price Ranges for Filtering
export const PRICE_RANGES = [
  { label: 'Under GH₵ 500', min: 0, max: 500 },
  { label: 'GH₵ 500 - GH₵ 1,000', min: 500, max: 1000 },
  { label: 'GH₵ 1,000 - GH₵ 2,000', min: 1000, max: 2000 },
  { label: 'GH₵ 2,000 - GH₵ 3,000', min: 2000, max: 3000 },
  { label: 'GH₵ 3,000 - GH₵ 5,000', min: 3000, max: 5000 },
  { label: 'GH₵ 5,000 - GH₵ 10,000', min: 5000, max: 10000 },
  { label: 'Above GH₵ 10,000', min: 10000, max: Infinity }
];

// Listing Status
export const LISTING_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RENTED: 'rented',
  PENDING: 'pending'
};

// Payment Terms
export const PAYMENT_TERMS = [
  'Monthly',
  'Quarterly',
  '6 Months',
  'Yearly',
  '2 Years',
  '3 Years',
  'Negotiable'
];

// Furnished Status
export const FURNISHED_STATUS = [
  'Fully Furnished',
  'Semi-Furnished',
  'Unfurnished'
];

// Utility Helper Functions
export const formatPrice = (price) => {
  if (!price && price !== 0) return 'N/A';
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  // Handle Firestore Timestamp
  if (date.toDate) {
    date = date.toDate();
  }
  
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Validation Constants
export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 2000
  },
  PRICE: {
    MIN: 50,
    MAX: 100000
  },
  IMAGES: {
    MAX_COUNT: 10,
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
};
