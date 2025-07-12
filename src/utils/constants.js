// User Roles
export const USER_ROLES = {
  RENTER: 'renter',
  LANDLORD: 'landlord',
  ADMIN: 'admin'
};

// Listing Status
export const LISTING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FEATURED: 'featured',
  EXPIRED: 'expired'
};

// Property Types
export const PROPERTY_TYPES = {
  SINGLE_ROOM: 'single_room',
  CHAMBER_HALL: 'chamber_hall',
  TWO_BEDROOM: 'two_bedroom',
  THREE_BEDROOM: 'three_bedroom',
  APARTMENT: 'apartment',
  STUDIO: 'studio',
  HOUSE: 'house'
};

// Electricity Types
export const ELECTRICITY_TYPES = {
  PREPAID: 'prepaid',
  POSTPAID: 'postpaid',
  SHARED: 'shared',
  NONE: 'none'
};

// Water Sources
export const WATER_SOURCES = {
  PIPE_BORNE: 'pipe_borne',
  WELL: 'well',
  BOREHOLE: 'borehole',
  TANKER: 'tanker',
  NONE: 'none'
};

// Security Features
export const SECURITY_FEATURES = {
  SECURITY_MAN: 'security_man',
  CCTV: 'cctv',
  FENCE: 'fence',
  GATE: 'gate',
  BURGLARY_PROOF: 'burglary_proof',
  ALARM_SYSTEM: 'alarm_system'
};

// Road Conditions
export const ROAD_CONDITIONS = {
  TARRED: 'tarred',
  GRAVEL: 'gravel',
  DIRT: 'dirt'
};

// Noise Levels
export const NOISE_LEVELS = {
  QUIET: 'quiet',
  MODERATE: 'moderate',
  BUSY: 'busy',
  VERY_BUSY: 'very_busy'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Report Types
export const REPORT_TYPES = {
  SCAM: 'scam',
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  FAKE_LISTING: 'fake_listing',
  DUPLICATE: 'duplicate',
  OTHER: 'other'
};

// Ghana Regions
export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
  'Volta',
  'Brong-Ahafo',
  'Western North',
  'Ahafo',
  'Bono East',
  'North East',
  'Savannah',
  'Oti'
];

// Popular Ghana Cities
export const GHANA_CITIES = {
  'Greater Accra': ['Accra', 'Tema', 'Kasoa', 'Madina', 'Adenta', 'Weija', 'Ga East'],
  'Ashanti': ['Kumasi', 'Obuasi', 'Ejisu', 'Mampong', 'Bekwai', 'Konongo'],
  'Western': ['Sekondi-Takoradi', 'Tarkwa', 'Prestea', 'Axim', 'Half Assini'],
  'Eastern': ['Koforidua', 'Akosombo', 'Akim Oda', 'Mpraeso', 'Begoro'],
  'Central': ['Cape Coast', 'Elmina', 'Winneba', 'Kasoa', 'Swedru'],
  'Northern': ['Tamale', 'Yendi', 'Savelugu', 'Gushagu', 'Kumbungu']
};

// Security Score Weights
export const SECURITY_WEIGHTS = {
  SECURITY_MAN: 25,
  CCTV: 20,
  FENCE: 15,
  GATE: 15,
  BURGLARY_PROOF: 15,
  ALARM_SYSTEM: 10
};

// Feature Listing Prices (in GHS)
export const FEATURE_PRICING = {
  BASIC_FEATURE: 50, // 7 days
  PREMIUM_FEATURE: 100, // 14 days
  ULTIMATE_FEATURE: 200 // 30 days
};

// Verification Fees (in GHS)
export const VERIFICATION_FEES = {
  LANDLORD_VERIFICATION: 30,
  PREMIUM_LANDLORD: 100
};
