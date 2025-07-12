import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES, GHANA_REGIONS } from '../utils/constants';
import { validation } from '../services/authService';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/solid';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.RENTER,
    location: '',
    ghanaCardNumber: '',
    momoNumber: '',
    businessName: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validation.isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validation.isValidGhanaPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Ghana phone number (+233 or 0 followed by 9 digits)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validation.isStrongPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    // Landlord-specific validations
    if (formData.role === USER_ROLES.LANDLORD) {
      if (formData.ghanaCardNumber && !validation.isValidGhanaCard(formData.ghanaCardNumber)) {
        newErrors.ghanaCardNumber = 'Ghana Card format: GHA-123456789-0';
      }
      
      if (formData.momoNumber && !validation.isValidGhanaPhone(formData.momoNumber)) {
        newErrors.momoNumber = 'Please enter a valid Ghana phone number for Mobile Money';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-green-600 rounded-lg p-2">
                <HomeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rent Easy GH</h1>
                <p className="text-sm text-gray-600">Ghana's Premier Rental Platform</p>
              </div>
            </Link>
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <span>Already have an account?</span>
              <Link 
                to="/signin" 
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Welcome Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome to Ghana's 
                <span className="text-green-600 block">Most Trusted</span> 
                Rental Platform
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Join thousands of satisfied landlords and renters who trust Rent Easy GH 
                for safe, secure, and hassle-free property transactions across Ghana.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verified Properties</h3>
                  <p className="text-sm text-gray-600">All listings verified for your safety</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Trusted Users</h3>
                  <p className="text-sm text-gray-600">ID-verified landlords and renters</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mobile Payments</h3>
                  <p className="text-sm text-gray-600">Secure Mobile Money integration</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">All Regions</h3>
                  <p className="text-sm text-gray-600">Properties across all 16 regions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Create Your Account</h3>
                <p className="text-gray-600 mt-2">Start your property journey today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      <UserIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="First Name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      <UserIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="+233 20 123 4567 or 0201234567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I am a: *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      formData.role === USER_ROLES.RENTER 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value={USER_ROLES.RENTER}
                        checked={formData.role === USER_ROLES.RENTER}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex-1 text-center">
                        <UserIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="font-medium text-gray-900">Renter</div>
                        <div className="text-xs text-gray-500">Looking for a place</div>
                      </div>
                      {formData.role === USER_ROLES.RENTER && (
                        <div className="absolute top-2 right-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </label>

                    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      formData.role === USER_ROLES.LANDLORD 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="role"
                        value={USER_ROLES.LANDLORD}
                        checked={formData.role === USER_ROLES.LANDLORD}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex-1 text-center">
                        <BuildingOfficeIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                        <div className="font-medium text-gray-900">Landlord</div>
                        <div className="text-xs text-gray-500">Have property to rent</div>
                      </div>
                      {formData.role === USER_ROLES.LANDLORD && (
                        <div className="absolute top-2 right-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                    Region
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Region</option>
                    {GHANA_REGIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Conditional Fields for Landlords */}
                {formData.role === USER_ROLES.LANDLORD && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-medium text-blue-900 flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      Landlord Information
                    </h4>
                    
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name (Optional)
                      </label>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your Property Business Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="ghanaCardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        <CreditCardIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                        Ghana Card Number (Optional)
                      </label>
                      <input
                        id="ghanaCardNumber"
                        name="ghanaCardNumber"
                        type="text"
                        value={formData.ghanaCardNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.ghanaCardNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                        } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                        placeholder="GHA-123456789-0"
                      />
                      {errors.ghanaCardNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.ghanaCardNumber}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Helps build trust with potential renters</p>
                    </div>

                    <div>
                      <label htmlFor="momoNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        <DevicePhoneMobileIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                        Mobile Money Number (Optional)
                      </label>
                      <input
                        id="momoNumber"
                        name="momoNumber"
                        type="tel"
                        value={formData.momoNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.momoNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                        } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                        placeholder="+233 20 123 4567"
                      />
                      {errors.momoNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.momoNumber}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">For advance rent payments from tenants</p>
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    <LockClosedIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border ${
                        errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <LockClosedIcon className="h-4 w-4 inline mr-1 text-gray-500" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border ${
                        errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-200 transform ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Create Account
                    </div>
                  )}
                </button>

                {/* Sign In Link */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-green-600 hover:text-green-700 transition-colors">
                      Sign in here
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 rounded-lg p-2">
                  <HomeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Rent Easy GH</h3>
                  <p className="text-gray-400 text-sm">Ghana's Premier Rental Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Connecting landlords and renters across Ghana with secure, verified property listings 
                and trusted payment solutions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/listings" className="hover:text-white transition-colors">Browse Properties</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Rent Easy GH. All rights reserved. Made with ❤️ in Ghana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage;
