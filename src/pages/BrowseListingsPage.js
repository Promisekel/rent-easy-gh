import React, { useState, useEffect, useCallback } from 'react';
import { listingService } from '../services/listingService';
import ListingCard from '../components/listings/ListingCard';
import FilterPanel from '../components/listings/FilterPanel';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Mock data for fallback
const mockListings = [
  {
    id: 'mock1',
    title: 'Beautiful 2-Bedroom Apartment in East Legon',
    description: 'Spacious and modern apartment with excellent amenities in a quiet neighborhood.',
    price: 2500,
    paymentTerm: 'Monthly',
    propertyType: 'Two Bedroom',
    bedrooms: 2,
    bathrooms: 2,
    furnished: 'Fully Furnished',
    location: {
      region: 'Greater Accra',
      city: 'Accra',
      district: 'East Legon',
      streetAddress: 'American House, East Legon'
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      'https://images.unsplash.com/photo-1560449752-c4e3d4e8f28c?w=400'
    ],
    amenities: ['Wi-Fi', 'Air Conditioning', 'Parking', 'Security'],
    utilities: {
      electricity: 'Prepaid',
      water: 'Pipe Borne',
      internet: true
    },
    security: {
      level: 'High',
      features: ['Security Man', 'CCTV', 'Fence']
    },
    noise: 'Quiet',
    roadCondition: 'Tarred',
    rentAdvance: '6 months',
    landlordInfo: {
      name: 'John Doe',
      phone: '+233 20 123 4567'
    },
    views: 45,
    createdAt: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: 'mock2',
    title: 'Single Room Self-Contain in Dansoman',
    description: 'Affordable single room with private bathroom and kitchen. Perfect for young professionals.',
    price: 800,
    paymentTerm: 'Monthly',
    propertyType: 'Single Room',
    bedrooms: 1,
    bathrooms: 1,
    furnished: 'Unfurnished',
    location: {
      region: 'Greater Accra',
      city: 'Accra',
      district: 'Dansoman',
      streetAddress: 'Dansoman Estate'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400'
    ],
    amenities: ['Parking', 'Water Storage'],
    utilities: {
      electricity: 'Prepaid',
      water: 'Borehole',
      internet: false
    },
    security: {
      level: 'Moderate',
      features: ['Fence', 'Gate']
    },
    noise: 'Moderate',
    roadCondition: 'Tarred',
    rentAdvance: '1 month',
    landlordInfo: {
      name: 'Mary Asante',
      phone: '+233 24 567 8901'
    },
    views: 23,
    createdAt: new Date('2024-01-20'),
    status: 'active'
  },
  {
    id: 'mock3',
    title: 'Luxury 3-Bedroom House in Ashongman',
    description: 'Spacious family house with garden, garage, and modern amenities. Quiet neighborhood.',
    price: 4000,
    paymentTerm: 'Monthly',
    propertyType: 'House',
    bedrooms: 3,
    bathrooms: 3,
    furnished: 'Semi-Furnished',
    location: {
      region: 'Greater Accra',
      city: 'Accra',
      district: 'Ashongman',
      streetAddress: 'Ashongman Estate'
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'
    ],
    amenities: ['Garden', 'Garage', 'Generator', 'Security'],
    utilities: {
      electricity: 'Postpaid',
      water: 'Pipe Borne',
      internet: true
    },
    security: {
      level: 'High',
      features: ['Security Man', 'CCTV', 'Fence', 'Gate']
    },
    noise: 'Quiet',
    roadCondition: 'Tarred',
    rentAdvance: '12 months',
    landlordInfo: {
      name: 'Kwame Mensah',
      phone: '+233 26 789 0123'
    },
    views: 67,
    createdAt: new Date('2024-01-10'),
    status: 'active'
  },
  {
    id: 'mock4',
    title: 'Chamber and Hall in Tema',
    description: 'Affordable chamber and hall in a convenient location near the harbor. Good transport links.',
    price: 1200,
    paymentTerm: 'Monthly',
    propertyType: 'Chamber and Hall',
    bedrooms: 1,
    bathrooms: 1,
    furnished: 'Unfurnished',
    location: {
      region: 'Greater Accra',
      city: 'Tema',
      district: 'Community 4',
      streetAddress: 'Community 4, Tema'
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    ],
    amenities: ['Parking', 'Water Storage'],
    utilities: {
      electricity: 'Prepaid',
      water: 'Pipe Borne',
      internet: false
    },
    security: {
      level: 'Moderate',
      features: ['Gate']
    },
    noise: 'Busy',
    roadCondition: 'Tarred',
    rentAdvance: '2 months',
    landlordInfo: {
      name: 'Agnes Tetteh',
      phone: '+233 27 456 7890'
    },
    views: 34,
    createdAt: new Date('2024-01-25'),
    status: 'active'
  },
  {
    id: 'mock5',
    title: 'Studio Apartment in Osu',
    description: 'Modern studio apartment in vibrant Osu area. Walking distance to restaurants and nightlife.',
    price: 1800,
    paymentTerm: 'Monthly',
    propertyType: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    furnished: 'Fully Furnished',
    location: {
      region: 'Greater Accra',
      city: 'Accra',
      district: 'Osu',
      streetAddress: 'Oxford Street, Osu'
    },
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400'
    ],
    amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchen', 'Security'],
    utilities: {
      electricity: 'Postpaid',
      water: 'Pipe Borne',
      internet: true
    },
    security: {
      level: 'High',
      features: ['Security Man', 'CCTV']
    },
    noise: 'Busy',
    roadCondition: 'Tarred',
    rentAdvance: '3 months',
    landlordInfo: {
      name: 'David Osei',
      phone: '+233 23 345 6789'
    },
    views: 89,
    createdAt: new Date('2024-01-18'),
    status: 'active'
  }
];

const BrowseListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    region: '',
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnished: '',
    electricityType: '',
    waterSource: '',
    noiseLevel: '',
    roadCondition: '',
    securityLevel: '',
    rentAdvance: '',
    hasInternet: false,
    hasParking: false,
    hasGenerator: false
  });

  // Apply filters function
  const applyFilters = useCallback(() => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title?.toLowerCase().includes(searchLower) ||
        listing.description?.toLowerCase().includes(searchLower) ||
        listing.location?.city?.toLowerCase().includes(searchLower) ||
        listing.location?.district?.toLowerCase().includes(searchLower) ||
        listing.location?.region?.toLowerCase().includes(searchLower)
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter(listing => 
        listing.location?.region === filters.region
      );
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(listing => 
        listing.location?.city === filters.city
      );
    }

    // Property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(listing => 
        listing.propertyType === filters.propertyType
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(listing => 
        listing.price >= Number(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => 
        listing.price <= Number(filters.maxPrice)
      );
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(listing => 
        listing.bedrooms === Number(filters.bedrooms)
      );
    }

    // Furnished filter
    if (filters.furnished) {
      filtered = filtered.filter(listing => 
        listing.furnished === filters.furnished
      );
    }

    // Electricity type filter
    if (filters.electricityType) {
      filtered = filtered.filter(listing => 
        listing.utilities?.electricity?.toLowerCase() === filters.electricityType.toLowerCase()
      );
    }

    // Water source filter
    if (filters.waterSource) {
      filtered = filtered.filter(listing => 
        listing.utilities?.water?.toLowerCase().includes(filters.waterSource.toLowerCase())
      );
    }

    // Noise level filter
    if (filters.noiseLevel) {
      filtered = filtered.filter(listing => 
        listing.noise?.toLowerCase() === filters.noiseLevel.toLowerCase()
      );
    }

    // Road condition filter
    if (filters.roadCondition) {
      filtered = filtered.filter(listing => 
        listing.roadCondition?.toLowerCase() === filters.roadCondition.toLowerCase()
      );
    }

    // Security level filter
    if (filters.securityLevel) {
      filtered = filtered.filter(listing => 
        listing.security?.level?.toLowerCase() === filters.securityLevel.toLowerCase()
      );
    }

    // Rent advance filter
    if (filters.rentAdvance) {
      filtered = filtered.filter(listing => 
        listing.rentAdvance?.includes(filters.rentAdvance)
      );
    }

    // Amenity filters
    if (filters.hasInternet) {
      filtered = filtered.filter(listing => 
        listing.utilities?.internet === true ||
        listing.amenities?.some(amenity => 
          amenity.toLowerCase().includes('wi-fi') || 
          amenity.toLowerCase().includes('internet')
        )
      );
    }

    if (filters.hasParking) {
      filtered = filtered.filter(listing => 
        listing.amenities?.some(amenity => 
          amenity.toLowerCase().includes('parking')
        )
      );
    }

    if (filters.hasGenerator) {
      filtered = filtered.filter(listing => 
        listing.amenities?.some(amenity => 
          amenity.toLowerCase().includes('generator')
        )
      );
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, filters]);

  // Load listings on component mount
  useEffect(() => {
    loadListings();
  }, []);

  // Apply filters whenever filters or search term changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await listingService.getListings({ limit: 50 });
      
      if (data.length === 0) {
        // No listings found, use mock data
        setListings(mockListings);
        setUseMockData(true);
        toast.success('Showing sample listings for demo purposes');
      } else {
        setListings(data);
        setUseMockData(false);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      // Fallback to mock data on error
      setListings(mockListings);
      setUseMockData(true);
      toast.error('Using sample data - Firebase connection needed for live listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnished: '',
      electricityType: '',
      waterSource: '',
      noiseLevel: '',
      roadCondition: '',
      securityLevel: '',
      rentAdvance: '',
      hasInternet: false,
      hasParking: false,
      hasGenerator: false
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (value && value !== '' && value !== false) count++;
    });
    if (searchTerm) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <LoadingSkeleton height="400px" />
            </div>
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <LoadingSkeleton key={index} height="300px" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
              <p className="mt-2 text-gray-600">
                Find your perfect home in Ghana
                {useMockData && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Demo Data
                  </span>
                )}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, property type, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-3 border rounded-lg font-medium transition-colors duration-200 ${
                showFilters 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 h-4 w-4 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
              {Object.entries(filters).map(([key, value]) => {
                if (value && value !== '' && value !== false) {
                  return (
                    <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                      {key}: {value.toString()}
                      <button
                        onClick={() => handleFilterChange(key, key.startsWith('has') ? false : '')}
                        className="ml-2 h-4 w-4 text-gray-600 hover:text-gray-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          {showFilters && (
            <div className="lg:w-1/4">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Listings Grid */}
          <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseListingsPage;
