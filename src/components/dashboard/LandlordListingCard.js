import React from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const LandlordListingCard = ({ 
  listing, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleFeature 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    
    // Handle Firestore timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    }
    
    // Handle regular Date object
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    // Handle string dates
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Left side - Property info */}
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              {/* Property image */}
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Property details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {listing.location?.district}, {listing.location?.city}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {formatPrice(listing.price)} / month
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Listed {formatDate(listing.createdAt)}
                    </div>
                  </div>

                  {/* Status and featured badges */}
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
                    </span>
                    
                    {listing.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <StarIconSolid className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {listing.views || 0} views
                  </div>
                  <div className="flex items-center">
                    <PhotoIcon className="h-4 w-4 mr-1" />
                    {listing.images?.length || 0} photos
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{listing.propertyType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(listing.id)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View
            </button>

            <button
              onClick={() => onEdit(listing.id)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>

            <button
              onClick={() => onToggleFeature(listing.id, listing.featured)}
              className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                listing.featured
                  ? 'border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <StarIcon className="h-4 w-4 mr-1" />
              {listing.featured ? 'Unfeature' : 'Feature'}
            </button>
          </div>

          <button
            onClick={() => onDelete(listing.id)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>

        {/* Additional info for pending listings */}
        {listing.status === 'pending' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Pending Review:</strong> Your listing is being reviewed by our team. This usually takes 1-2 business days.
            </p>
          </div>
        )}

        {/* Additional info for rejected listings */}
        {listing.status === 'rejected' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Listing Rejected:</strong> {listing.rejectionReason || 'Please contact support for more information.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordListingCard;
