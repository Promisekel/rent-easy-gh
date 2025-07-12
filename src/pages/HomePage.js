import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  
  const features = [
    {
      icon: HomeIcon,
      title: 'Quality Listings',
      description: 'Verified properties with detailed information including security scores and amenities.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Search',
      description: 'Find your perfect home with advanced filters by location, price, and features.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Landlords',
      description: 'All landlords are verified with Ghana Card for your safety and security.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: StarIcon,
      title: 'Premium Features',
      description: 'Featured listings and premium landlords for enhanced visibility and trust.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: MapPinIcon,
      title: 'Location Mapping',
      description: 'Integrated Google Maps to show exact locations and nearby landmarks.',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Secure Payments',
      description: 'Integrated with Paystack and Mobile Money for secure transactions.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Active Listings', icon: HomeIconSolid, color: 'text-blue-600' },
    { number: '500+', label: 'Verified Landlords', icon: ShieldCheckIcon, color: 'text-green-600' },
    { number: '16', label: 'Regions Covered', icon: MapPinIcon, color: 'text-purple-600' },
    { number: '24/7', label: 'Support Available', icon: StarIconSolid, color: 'text-yellow-600' }
  ];

  const testimonials = [
    {
      name: 'Kwame Asante',
      location: 'Accra',
      text: 'Found my perfect apartment in East Legon within a week. The landlord was verified and the process was so smooth!',
      rating: 5
    },
    {
      name: 'Akosua Mensah',
      location: 'Kumasi',
      text: 'As a landlord, Rent Easy GH helped me find quality tenants quickly. The platform is trustworthy and efficient.',
      rating: 5
    },
    {
      name: 'John Doe',
      location: 'Tamale',
      text: 'The security scores feature helped me choose a safe neighborhood. Highly recommend this platform!',
      rating: 5
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to listings with search parameters
    window.location.href = `/listings?location=${encodeURIComponent(searchLocation)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Interactive Search */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Home</span>
              <br />in Ghana
              {/* v2.0 - Force cache refresh */}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              🏠 Ghana's premier rental platform connecting landlords and renters across all 16 regions. 
              Discover quality rentals with security scores and transparent pricing.
            </p>
            
            {/* Interactive Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-6 shadow-2xl backdrop-blur-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Where do you want to live?</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter city or region (e.g., Accra, Kumasi)"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Search Homes
                  </button>
                </div>
              </form>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <HomeIcon className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
                Browse All Listings
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                <PlayIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands Across Ghana
            </h2>
            <p className="text-xl text-gray-600">Join our growing community of satisfied users</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-600', '-400')} to-${stat.color.split('-')[1]}-600 mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Rent Easy GH?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making property rental in Ghana safe, transparent, and convenient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-500 transform hover:-translate-y-2 ${
                  activeFeature === index ? 'shadow-2xl scale-105' : 'shadow-lg hover:shadow-xl'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(0)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor} group-hover:rotate-12 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-500">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect - Arrow */}
                  <div className="mt-4 flex items-center text-sm font-semibold text-transparent group-hover:text-blue-600 transition-colors duration-300">
                    Learn more 
                    <ArrowRightIcon className="h-4 w-4 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Active Indicator */}
                {activeFeature === index && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced How it Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to find your dream home</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white font-bold text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  1
                </div>
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-red-300 to-yellow-300"></div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <MagnifyingGlassIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Search & Filter</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use our advanced search to find properties by location, price, and specific features you need.
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-500">Advanced filtering options</span>
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full text-white font-bold text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  2
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yellow-300 to-green-300"></div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ShieldCheckIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Landlord</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect directly with verified landlords via WhatsApp or phone call for immediate response.
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-500">Verified landlords only</span>
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white font-bold text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  3
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <HomeIconSolid className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Move In</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete the rental process with secure payment options including Mobile Money integration.
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-500">Secure payment methods</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Find Your 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Perfect Home</span>?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            🎉 Join thousands of satisfied renters and landlords on Ghana's most trusted rental platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
            >
              Get Started Today
              <ArrowRightIcon className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/listings"
              className="group border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <PlayIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Browse Listings
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-200 text-sm">Verified Properties</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-blue-200 text-sm">Customer Support</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">Secure</div>
              <div className="text-blue-200 text-sm">Payment System</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-blue-200 text-sm">To Get Started</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
