import React from 'react';

const LoadingSkeleton = ({ height = '200px', className = '', type = 'card' }) => {
  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-pulse">
              <div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="h-12 bg-gray-200 rounded-lg w-40"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-gray-100 w-12 h-12"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Quick insights skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Listings Section Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
            </div>
            
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-96 bg-gray-200"></div>
                <div className="p-4 flex space-x-2">
                  <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="w-20 h-16 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              {/* Property Details Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>

              {/* Map Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
                
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex space-x-2">
                    <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
                    <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse ${className}`} style={{ height }}>
      <div className="bg-gray-200 rounded-lg h-full flex flex-col">
        {/* Image skeleton */}
        <div className="bg-gray-300 rounded-t-lg h-3/5"></div>
        
        {/* Content skeleton */}
        <div className="p-4 flex-1 space-y-3">
          {/* Title */}
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          
          {/* Price */}
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          
          {/* Location */}
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          
          {/* Features */}
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
            <div className="h-6 bg-gray-300 rounded-full w-12"></div>
            <div className="h-6 bg-gray-300 rounded-full w-14"></div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Grid skeleton for multiple cards
export const ListingGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <LoadingSkeleton key={index} height="350px" />
      ))}
    </div>
  );
};

// Filter panel skeleton
export const FilterPanelSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        
        {/* Filter sections */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
