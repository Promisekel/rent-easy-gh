import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { listingService, listingValidation } from '../services/listingService';
import { USER_ROLES, GHANA_REGIONS, GHANA_CITIES } from '../utils/constants';
import { 
  PROPERTY_TYPES, 
  AMENITIES,
  PROPERTY_FEATURES,
  PAYMENT_TERMS,
  FURNISHED_STATUS,
  VALIDATION_RULES
} from '../utils/propertyConstants';
import { 
  PhotoIcon, 
  XMarkIcon, 
  PlusIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AddListingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    price: '',
    paymentTerm: 'Monthly',
    furnished: '',
    bedrooms: '',
    bathrooms: '',
    location: {
      region: '',
      city: '',
      district: '',
      streetAddress: '',
      landmark: '',
      gpsCoordinates: ''
    },
    amenities: [],
    features: [],
    utilities: {
      electricity: false,
      water: false,
      internet: false,
      cable: false,
      gas: false
    },
    policies: {
      petsAllowed: false,
      smokingAllowed: false,
      partiesAllowed: false
    },
    contact: {
      preferredMethod: 'phone',
      whatsapp: '',
      alternatePhone: ''
    },
    availability: {
      availableFrom: '',
      minimumStay: '',
      maximumStay: ''
    }
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle amenities and features selection
  const handleMultiSelect = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate images
    const validation = listingValidation.validateImages(files);
    if (!validation.isValid) {
      toast.error(validation.errors.join('\n'));
      return;
    }

    // Check total image limit
    if (images.length + files.length > VALIDATION_RULES.IMAGES.MAX_COUNT) {
      toast.error(`Maximum ${VALIDATION_RULES.IMAGES.MAX_COUNT} images allowed`);
      return;
    }

    // Add to images array
    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    e.target.value = '';
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) {
          newErrors.title = 'Property title is required';
        } else if (formData.title.length < VALIDATION_RULES.TITLE.MIN_LENGTH) {
          newErrors.title = `Title must be at least ${VALIDATION_RULES.TITLE.MIN_LENGTH} characters`;
        }

        if (!formData.description.trim()) {
          newErrors.description = 'Property description is required';
        } else if (formData.description.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
          newErrors.description = `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`;
        }

        if (!formData.propertyType) {
          newErrors.propertyType = 'Property type is required';
        }

        if (!formData.price || formData.price <= 0) {
          newErrors.price = 'Valid price is required';
        } else if (formData.price < VALIDATION_RULES.PRICE.MIN) {
          newErrors.price = `Price must be at least GH₵ ${VALIDATION_RULES.PRICE.MIN}`;
        }

        if (!formData.bedrooms || formData.bedrooms < 0) {
          newErrors.bedrooms = 'Number of bedrooms is required';
        }

        if (!formData.bathrooms || formData.bathrooms < 0) {
          newErrors.bathrooms = 'Number of bathrooms is required';
        }
        break;

      case 2: // Location
        if (!formData.location.region) {
          newErrors.region = 'Region is required';
        }
        if (!formData.location.city) {
          newErrors.city = 'City is required';
        }
        if (!formData.location.streetAddress.trim()) {
          newErrors.streetAddress = 'Street address is required';
        }
        break;

      case 3: // Images
        if (images.length === 0) {
          newErrors.images = 'At least one image is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setLoading(true);
    const toastId = toast.loading('Creating your listing...');

    try {
      const listingData = {
        ...formData,
        landlordId: currentUser.uid,
        landlordInfo: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          phone: currentUser.phone
        },
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms)
      };

      const newListing = await listingService.createListing(listingData, images);
      
      toast.success('Property listed successfully!', { id: toastId });
      navigate(`/listing/${newListing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
      </div>

      {/* Property Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Property Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          placeholder="e.g., Modern 2-Bedroom Apartment in East Legon"
          maxLength={VALIDATION_RULES.TITLE.MAX_LENGTH}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/{VALIDATION_RULES.TITLE.MAX_LENGTH} characters
        </p>
      </div>

      {/* Property Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Property Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          placeholder="Describe your property, including its features, nearby amenities, and what makes it special..."
          maxLength={VALIDATION_RULES.DESCRIPTION.MAX_LENGTH}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/{VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters
        </p>
      </div>

      {/* Property Type and Furnished Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type *
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.propertyType ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          >
            <option value="">Select Property Type</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>}
        </div>

        <div>
          <label htmlFor="furnished" className="block text-sm font-medium text-gray-700">
            Furnished Status
          </label>
          <select
            id="furnished"
            name="furnished"
            value={formData.furnished}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select Status</option>
            {FURNISHED_STATUS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price and Payment Term */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Rental Price (GH₵) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min={VALIDATION_RULES.PRICE.MIN}
            max={VALIDATION_RULES.PRICE.MAX}
            className={`mt-1 block w-full px-3 py-2 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="1500"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="paymentTerm" className="block text-sm font-medium text-gray-700">
            Payment Term
          </label>
          <select
            id="paymentTerm"
            name="paymentTerm"
            value={formData.paymentTerm}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            {PAYMENT_TERMS.map(term => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bedrooms and Bathrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
            Bedrooms *
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            min="0"
            max="20"
            className={`mt-1 block w-full px-3 py-2 border ${errors.bedrooms ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="2"
          />
          {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
        </div>

        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
            Bathrooms *
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            min="0"
            max="10"
            step="0.5"
            className={`mt-1 block w-full px-3 py-2 border ${errors.bathrooms ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            placeholder="1.5"
          />
          {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
        </div>
      </div>
    </div>
  );

  // Step 2: Location
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <MapPinIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
      </div>

      {/* Region and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location.region" className="block text-sm font-medium text-gray-700">
            Region *
          </label>
          <select
            id="location.region"
            name="location.region"
            value={formData.location.region}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.region ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          >
            <option value="">Select Region</option>
            {GHANA_REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
        </div>

        <div>
          <label htmlFor="location.city" className="block text-sm font-medium text-gray-700">
            City *
          </label>
          <select
            id="location.city"
            name="location.city"
            value={formData.location.city}
            onChange={handleInputChange}
            disabled={!formData.location.region}
            className={`mt-1 block w-full px-3 py-2 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${!formData.location.region ? 'bg-gray-100' : ''}`}
          >
            <option value="">Select City</option>
            {formData.location.region && GHANA_CITIES[formData.location.region]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
        </div>
      </div>

      {/* District */}
      <div>
        <label htmlFor="location.district" className="block text-sm font-medium text-gray-700">
          District/Area
        </label>
        <input
          type="text"
          id="location.district"
          name="location.district"
          value={formData.location.district}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., East Legon, Dansoman, etc."
        />
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="location.streetAddress" className="block text-sm font-medium text-gray-700">
          Street Address *
        </label>
        <input
          type="text"
          id="location.streetAddress"
          name="location.streetAddress"
          value={formData.location.streetAddress}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.streetAddress ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
          placeholder="e.g., House #123, Oxford Street"
        />
        {errors.streetAddress && <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>}
      </div>

      {/* Landmark and GPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location.landmark" className="block text-sm font-medium text-gray-700">
            Nearby Landmark
          </label>
          <input
            type="text"
            id="location.landmark"
            name="location.landmark"
            value={formData.location.landmark}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Near A&C Mall, Behind Shell Station"
          />
        </div>

        <div>
          <label htmlFor="location.gpsCoordinates" className="block text-sm font-medium text-gray-700">
            GPS Coordinates (Optional)
          </label>
          <input
            type="text"
            id="location.gpsCoordinates"
            name="location.gpsCoordinates"
            value={formData.location.gpsCoordinates}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 5.6037, -0.1870"
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Images
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <PhotoIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Property Images</h3>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images * (Maximum 10 images, 5MB each)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                <span>Upload images</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB each</p>
          </div>
        </div>
        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({imagePreviews.length}/{VALIDATION_RULES.IMAGES.MAX_COUNT})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={preview.id} className="relative group">
                <img
                  src={preview.url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Step 4: Additional Details
  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <HomeIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleMultiSelect('amenities', amenity)}
                className="text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Features */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Property Features</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PROPERTY_FEATURES.map(feature => (
            <label key={feature} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleMultiSelect('features', feature)}
                className="text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Utilities Included */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Utilities Included</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(formData.utilities).map(utility => (
            <label key={utility} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={`utilities.${utility}`}
                checked={formData.utilities[utility]}
                onChange={handleInputChange}
                className="text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">{utility}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Policies */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Property Policies</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(formData.policies).map(policy => (
            <label key={policy} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={`policies.${policy}`}
                checked={formData.policies[policy]}
                onChange={handleInputChange}
                className="text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                {policy === 'petsAllowed' ? 'Pets Allowed' :
                 policy === 'smokingAllowed' ? 'Smoking Allowed' :
                 'Parties Allowed'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact.whatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="contact.whatsapp"
              name="contact.whatsapp"
              value={formData.contact.whatsapp}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="+233 20 123 4567"
            />
          </div>

          <div>
            <label htmlFor="contact.alternatePhone" className="block text-sm font-medium text-gray-700">
              Alternate Phone
            </label>
            <input
              type="tel"
              id="contact.alternatePhone"
              name="contact.alternatePhone"
              value={formData.contact.alternatePhone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="+233 24 567 8901"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Availability</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="availability.availableFrom" className="block text-sm font-medium text-gray-700">
              Available From
            </label>
            <input
              type="date"
              id="availability.availableFrom"
              name="availability.availableFrom"
              value={formData.availability.availableFrom}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="availability.minimumStay" className="block text-sm font-medium text-gray-700">
              Minimum Stay (months)
            </label>
            <input
              type="number"
              id="availability.minimumStay"
              name="availability.minimumStay"
              value={formData.availability.minimumStay}
              onChange={handleInputChange}
              min="1"
              max="36"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="6"
            />
          </div>

          <div>
            <label htmlFor="availability.maximumStay" className="block text-sm font-medium text-gray-700">
              Maximum Stay (months)
            </label>
            <input
              type="number"
              id="availability.maximumStay"
              name="availability.maximumStay"
              value={formData.availability.maximumStay}
              onChange={handleInputChange}
              min="1"
              max="120"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="24"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="mt-2 text-gray-600">
            Create a detailed listing to attract quality tenants
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Render current step */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 border rounded-md text-sm font-medium ${
                  currentStep === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-sm font-medium text-white ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-ghana-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Listing...
                    </>
                  ) : (
                    'Publish Listing'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;
