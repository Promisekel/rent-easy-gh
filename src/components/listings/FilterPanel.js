import React from 'react';
import { 
  GHANA_REGIONS, 
  GHANA_CITIES
} from '../../utils/constants';
import { 
  FURNISHED_STATUS
} from '../../utils/propertyConstants';
import { 
  FunnelIcon
} from '@heroicons/react/24/outline';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const rentAdvanceOptions = ['1 month', '2 months', '3 months', '6 months', '12 months'];
  const bedroomOptions = [1, 2, 3, 4, 5, '6+'];
  const securityLevels = ['High', 'Moderate', 'Low'];

  const handleInputChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  const handleCheckboxChange = (filterName, checked) => {
    onFilterChange(filterName, checked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Location Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
          <div className="space-y-3">
            <div>
              <label htmlFor="region" className="block text-xs font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                id="region"
                value={filters.region}
                onChange={(e) => {
                  handleInputChange('region', e.target.value);
                  // Clear city when region changes
                  if (filters.city) {
                    handleInputChange('city', '');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Regions</option>
                {GHANA_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                id="city"
                value={filters.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!filters.region}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
              >
                <option value="">All Cities</option>
                {filters.region && GHANA_CITIES[filters.region]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Property Type</h4>
          <select
            value={filters.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="Single Room">Single Room</option>
            <option value="Chamber and Hall">Chamber and Hall</option>
            <option value="Two Bedroom">Two Bedroom</option>
            <option value="Three Bedroom">Three Bedroom</option>
            <option value="Four Bedroom">Four Bedroom</option>
            <option value="Apartment">Apartment</option>
            <option value="Studio">Studio</option>
            <option value="House">House</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range (GH₵)</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="minPrice" className="block text-xs font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                value={filters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Bedrooms</h4>
          <select
            value={filters.bedrooms}
            onChange={(e) => handleInputChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any</option>
            {bedroomOptions.map(option => (
              <option key={option} value={option}>{option} {option === 1 ? 'bedroom' : 'bedrooms'}</option>
            ))}
          </select>
        </div>

        {/* Furnished Status */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Furnished Status</h4>
          <select
            value={filters.furnished}
            onChange={(e) => handleInputChange('furnished', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any</option>
            {FURNISHED_STATUS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Utilities */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Utilities</h4>
          <div className="space-y-3">
            <div>
              <label htmlFor="electricityType" className="block text-xs font-medium text-gray-700 mb-1">
                Electricity Type
              </label>
              <select
                id="electricityType"
                value={filters.electricityType}
                onChange={(e) => handleInputChange('electricityType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                <option value="prepaid">Prepaid</option>
                <option value="postpaid">Postpaid</option>
              </select>
            </div>

            <div>
              <label htmlFor="waterSource" className="block text-xs font-medium text-gray-700 mb-1">
                Water Source
              </label>
              <select
                id="waterSource"
                value={filters.waterSource}
                onChange={(e) => handleInputChange('waterSource', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                <option value="pipe">Pipe Borne</option>
                <option value="borehole">Borehole</option>
                <option value="well">Well</option>
                <option value="tanker">Tanker Supply</option>
              </select>
            </div>
          </div>
        </div>

        {/* Environment */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Environment</h4>
          <div className="space-y-3">
            <div>
              <label htmlFor="noiseLevel" className="block text-xs font-medium text-gray-700 mb-1">
                Noise Level
              </label>
              <select
                id="noiseLevel"
                value={filters.noiseLevel}
                onChange={(e) => handleInputChange('noiseLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                <option value="quiet">Quiet</option>
                <option value="moderate">Moderate</option>
                <option value="busy">Busy</option>
              </select>
            </div>

            <div>
              <label htmlFor="roadCondition" className="block text-xs font-medium text-gray-700 mb-1">
                Road Condition
              </label>
              <select
                id="roadCondition"
                value={filters.roadCondition}
                onChange={(e) => handleInputChange('roadCondition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                <option value="tarred">Tarred</option>
                <option value="gravel">Gravel</option>
                <option value="dirt">Dirt Road</option>
              </select>
            </div>

            <div>
              <label htmlFor="securityLevel" className="block text-xs font-medium text-gray-700 mb-1">
                Security Level
              </label>
              <select
                id="securityLevel"
                value={filters.securityLevel}
                onChange={(e) => handleInputChange('securityLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Any</option>
                {securityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rent Advance */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Rent Advance Required</h4>
          <select
            value={filters.rentAdvance}
            onChange={(e) => handleInputChange('rentAdvance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Any</option>
            {rentAdvanceOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Amenities</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasInternet}
                onChange={(e) => handleCheckboxChange('hasInternet', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Internet/Wi-Fi</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasParking}
                onChange={(e) => handleCheckboxChange('hasParking', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Parking Space</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasGenerator}
                onChange={(e) => handleCheckboxChange('hasGenerator', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Generator/Backup Power</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
