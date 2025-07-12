import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, truncateText } from '../../utils/propertyConstants';
import { 
  MapPinIcon,
  HomeIcon,
  EyeIcon,
  HeartIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  WifiIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ListingCard = ({ listing, isFavorite = false, onToggleFavorite }) => {
  // Get security level color
  const getSecurityColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get noise level color
  const getNoiseColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'quiet': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'busy': 
      case 'very_busy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Format location
  const formatLocation = (location) => {
    const parts = [];
    if (location?.district) parts.push(location.district);
    if (location?.city) parts.push(location.city);
    if (location?.region) parts.push(location.region);
    return parts.join(', ');
  };

  // Get main image
  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(listing.id);
    }
  };

  return (
    <Link to={`/listing/${listing.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
            }}
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.featured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                Featured
              </span>
            )}
            {listing.furnished && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                {listing.furnished}
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200"
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
            )}
          </button>

          {/* Image count indicator */}
          {listing.images && listing.images.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
              +{listing.images.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-200">
              {truncateText(listing.title, 60)}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BanknotesIcon className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  /{listing.paymentTerm?.toLowerCase() || 'month'}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{formatLocation(listing.location)}</span>
          </div>

          {/* Property details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              <span>{listing.propertyType}</span>
            </div>
            <div className="flex items-center">
              <span>{listing.bedrooms} bed</span>
              {listing.bathrooms && (
                <span className="ml-1">• {listing.bathrooms} bath</span>
              )}
            </div>
          </div>

          {/* Key features */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Security level */}
            {listing.security?.level && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSecurityColor(listing.security.level)}`}>
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                {listing.security.level} Security
              </span>
            )}

            {/* Noise level */}
            {listing.noise && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNoiseColor(listing.noise)}`}>
                {listing.noise} Area
              </span>
            )}

            {/* Internet */}
            {(listing.utilities?.internet || listing.amenities?.some(a => a.toLowerCase().includes('wi-fi'))) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
                <WifiIcon className="h-3 w-3 mr-1" />
                Internet
              </span>
            )}

            {/* Electricity type */}
            {listing.utilities?.electricity && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-100">
                <BoltIcon className="h-3 w-3 mr-1" />
                {listing.utilities.electricity}
              </span>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{listing.views || 0} views</span>
            </div>
            <div>
              {listing.rentAdvance && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {listing.rentAdvance} advance
                </span>
              )}
            </div>
          </div>

          {/* Description preview */}
          {listing.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {truncateText(listing.description, 100)}
            </p>
          )}
        </div>

        {/* Quick contact footer */}
        <div className="px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{listing.landlordInfo?.name || 'Landlord'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {listing.createdAt ? (
                  new Date(listing.createdAt).toLocaleDateString()
                ) : (
                  'Recently listed'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
