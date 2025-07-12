import React from 'react';
import { 
  HomeIcon, 
  EyeIcon, 
  StarIcon, 
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats }) => {
  const statItems = [
    {
      name: 'Total Listings',
      value: stats.totalListings,
      icon: HomeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null,
      description: 'Active properties'
    },
    {
      name: 'Total Views',
      value: stats.totalViews,
      icon: EyeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12%',
      description: 'This month'
    },
    {
      name: 'Featured Listings',
      value: stats.featuredListings,
      icon: StarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null,
      description: 'Premium placements'
    },
    {
      name: 'Pending Review',
      value: stats.pendingListings,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: null,
      description: 'Awaiting approval'
    }
  ];

  const formatValue = (value, name) => {
    if (name === 'Total Views' && value > 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value?.toLocaleString() || '0';
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <ChartBarIcon className="h-6 w-6 mr-2" />
        Dashboard Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <div key={item.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${item.bgColor}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {item.name}
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatValue(item.value, item.name)}
                      </p>
                      {item.change && (                      <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        {item.change}
                      </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar for certain stats */}
            {item.name === 'Featured Listings' && stats.totalListings > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Featured vs Total</span>
                  <span>{Math.round((stats.featuredListings / stats.totalListings) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((stats.featuredListings / stats.totalListings) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Status indicator for pending listings */}
            {item.name === 'Pending Review' && stats.pendingListings > 0 && (
              <div className="mt-4 flex items-center text-xs text-yellow-600">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                Requires attention
              </div>
            )}
            
            {/* View rate indicator */}
            {item.name === 'Total Views' && stats.totalListings > 0 && (
              <div className="mt-4">
                <div className="text-xs text-gray-600 mb-1">
                  Avg. views per listing
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {Math.round(stats.totalViews / stats.totalListings)} views
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Quick insights */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalListings > 0 ? Math.round((stats.totalViews / stats.totalListings) * 10) / 10 : 0}
            </div>
            <div className="text-sm text-blue-700 font-medium">Avg Views/Listing</div>
            <div className="text-xs text-blue-600 mt-1">
              {stats.totalViews > 50 ? 'Great visibility!' : 'Consider featuring listings'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalListings > 0 ? Math.round((stats.featuredListings / stats.totalListings) * 100) : 0}%
            </div>
            <div className="text-sm text-purple-700 font-medium">Featured Rate</div>
            <div className="text-xs text-purple-600 mt-1">
              {stats.featuredListings / stats.totalListings < 0.3 ? 'Consider featuring more' : 'Good promotion mix'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalListings - stats.pendingListings}
            </div>
            <div className="text-sm text-green-700 font-medium">Active Listings</div>
            <div className="text-xs text-green-600 mt-1">
              {stats.pendingListings === 0 ? 'All listings active' : `${stats.pendingListings} pending`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
