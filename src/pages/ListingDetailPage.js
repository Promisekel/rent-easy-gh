import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingService } from '../services/listingService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  PhoneIcon,
  FlagIcon,
  MapPinIcon,
  HomeIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  ShieldCheckIcon as ShieldSolidIcon
} from '@heroicons/react/24/solid';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Mock listing data for fallback
  const mockListing = {
    id: id,
    title: 'Beautiful 2-Bedroom Apartment in Dansoman',
    description: 'Modern apartment with excellent amenities in a quiet neighborhood. Perfect for professionals and small families. Close to transport links and shopping centers.',
    price: 2500,
    paymentTerm: 'Monthly',
    propertyType: 'Two Bedroom',
    bedrooms: 2,
    bathrooms: 2,
    furnished: 'Semi-Furnished',
    location: {
      region: 'Greater Accra',
      city: 'Accra',
      district: 'Dansoman',
      streetAddress: 'Dansoman Estate, Block B',
      landmarks: 'Near Dansoman Market, 5 minutes to trotro station'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1584622781564-1d987ba6d50c?w=800',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'
    ],
    amenities: ['WiFi', 'Generator', 'Parking', 'Security', 'Water Storage'],
    utilities: {
      electricity: 'Prepaid',
      electricityEstimate: 150,
      water: 'Pipe Borne',
      internet: true
    },
    security: {
      level: 'High',
      features: ['Security Man', 'CCTV', 'Fence', 'Gated Community']
    },
    buildingMaterial: 'Concrete Block',
    noise: 'Quiet',
    roadCondition: 'Tarred',
    rentAdvance: '6 months',
    advancePaymentNumber: null,
    landlordInfo: {
      name: 'Mrs. Akosua Mensah',
      phone: '+233 24 567 8901',
      whatsapp: '+233 24 567 8901',
      verified: true
    },
    views: 234,
    coordinates: {
      lat: 5.5331,
      lng: -0.2876
    },
    createdAt: new Date('2024-01-15'),
    status: 'active'
  };

  useEffect(() => {
    loadListing();
    // Increment view count
    if (id && !useMockData) {
      listingService.incrementViews(id).catch(console.error);
    }
  }, [id, loadListing, useMockData]);

  const loadListing = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await listingService.getListing(id);
      setListing(data);
      setUseMockData(false);
    } catch (error) {
      console.error('Error loading listing:', error);
      // Fallback to mock data
      setListing(mockListing);
      setUseMockData(true);
      toast.error('Using sample data - Firebase connection needed for live listing');
    } finally {
      setLoading(false);
    }
  }, [id, mockListing]);

  const handlePreviousImage = () => {
    if (listing?.images?.length > 0) {
      setCurrentImageIndex(prev => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (listing?.images?.length > 0) {
      setCurrentImageIndex(prev => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleContactLandlord = () => {
    if (listing?.landlordInfo?.phone) {
      window.open(`tel:${listing.landlordInfo.phone}`, '_self');
    }
  };

  const handleWhatsAppLandlord = () => {
    if (listing?.landlordInfo?.whatsapp) {
      const message = encodeURIComponent(
        `Hi! I'm interested in your ${listing.propertyType} listing "${listing.title}" on Rent Easy GH. Can we discuss the details?`
      );
      window.open(`https://wa.me/${listing.landlordInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleReportListing = () => {
    toast.success('Report submitted. We\'ll review this listing.');
  };

  const getSecurityBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <LoadingSkeleton type="detail" />;
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/listings')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Other Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/listings')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Listings
          </button>
          
          {useMockData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">
                📱 Viewing sample listing data. Connect to Firebase for live listings.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                {listing?.images?.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <HomeIcon className="h-16 w-16" />
                  </div>
                )}
                
                {/* Image Counter */}
                {listing?.images?.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {listing.images.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              {listing?.images?.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-primary-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing?.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{listing?.location?.streetAddress}, {listing?.location?.district}, {listing?.location?.city}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-primary-600">
                      {formatPrice(listing?.price)}
                    </span>
                    <span className="text-gray-500">/ {listing?.paymentTerm?.toLowerCase()}</span>
                    {listing?.landlordInfo?.verified && (
                      <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <ShieldSolidIcon className="h-4 w-4 mr-1" />
                        Verified Landlord
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{listing?.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{listing?.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{listing?.propertyType}</div>
                  <div className="text-sm text-gray-600">Property Type</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{listing?.furnished}</div>
                  <div className="text-sm text-gray-600">Furnished</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{listing?.description}</p>
              </div>

              {/* Property Features */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Security */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Security
                  </h4>
                  <div className="space-y-2">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSecurityBadgeColor(listing?.security?.level)}`}>
                      {listing?.security?.level} Security
                    </div>
                    <div className="mt-2">
                      {listing?.security?.features?.map((feature, index) => (
                        <span key={index} className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs mr-2 mb-1">
                          <CheckIcon className="h-3 w-3 mr-1" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BoltIcon className="h-5 w-5 mr-2" />
                    Utilities
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Electricity:</span>
                      <span className="font-medium">{listing?.utilities?.electricity}</span>
                    </div>
                    {listing?.utilities?.electricityEstimate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Monthly Cost:</span>
                        <span className="font-medium">{formatPrice(listing.utilities.electricityEstimate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Water:</span>
                      <span className="font-medium">{listing?.utilities?.water}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Internet Ready:</span>
                      <span className="font-medium">
                        {listing?.utilities?.internet ? (
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <XMarkIcon className="h-4 w-4 text-red-600" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {listing?.amenities?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="mt-6 grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building Material:</span>
                    <span className="font-medium">{listing?.buildingMaterial || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Noise Level:</span>
                    <span className="font-medium">{listing?.noise || 'Not specified'}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Road Condition:</span>
                    <span className="font-medium">{listing?.roadCondition || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rent Advance:</span>
                    <span className="font-medium">{listing?.rentAdvance || 'Contact landlord'}</span>
                  </div>
                </div>
              </div>

              {/* Landmarks */}
              {listing?.location?.landmarks && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Nearby Landmarks</h4>
                  <p className="text-gray-600 text-sm">{listing.location.landmarks}</p>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                {listing?.coordinates ? (
                  <iframe
                    title="Property Location Map"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${listing.coordinates.lat},${listing.coordinates.lng}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                ) : (
                  <div className="text-center text-gray-500">
                    <MapPinIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Map location not available</p>
                    <p className="text-sm mt-1">{listing?.location?.district}, {listing?.location?.city}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Landlord</h3>
                <p className="text-gray-600">{listing?.landlordInfo?.name}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContactLandlord}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Call Now
                </button>

                <button
                  onClick={handleWhatsAppLandlord}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex-1 py-3 px-4 rounded-lg border transition-colors flex items-center justify-center ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <HeartIcon className="h-5 w-5 mr-2" />
                    )}
                    {isFavorite ? 'Saved' : 'Save'}
                  </button>

                  <button
                    onClick={handleReportListing}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FlagIcon className="h-5 w-5 mr-2" />
                    Report
                  </button>
                </div>
              </div>

              {/* Premium Payment Notice */}
              {listing?.advancePaymentNumber && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium mb-2">Premium Listing</p>
                  <p className="text-yellow-700 text-xs">
                    Contact information available after advance payment verification.
                  </p>
                </div>
              )}

              {/* Property Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
                    {listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{listing?.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
