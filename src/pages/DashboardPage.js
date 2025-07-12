import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { listingService } from '../services/listingService';
import { favoritesService } from '../services/favoritesService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ListingCard from '../components/listings/ListingCard';
import DashboardStats from '../components/dashboard/DashboardStats';
import LandlordListingCard from '../components/dashboard/LandlordListingCard';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  HomeIcon,
  HeartIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalViews: 0,
    featuredListings: 0,
    pendingListings: 0
  });
  const [error, setError] = useState(null);

  // Mock data for fallback
  const mockLandlordListings = [
    {
      id: 'mock1',
      title: '2-Bedroom Apartment in Dansoman',
      price: 2500,
      propertyType: 'Two Bedroom',
      location: { city: 'Accra', district: 'Dansoman' },
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
      status: 'active',
      featured: false,
      views: 45,
      createdAt: new Date('2024-01-10'),
      landlordId: user?.uid
    },
    {
      id: 'mock2',
      title: 'Single Room in Tema',
      price: 800,
      propertyType: 'Single Room',
      location: { city: 'Tema', district: 'Community 25' },
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
      status: 'active',
      featured: true,
      views: 89,
      createdAt: new Date('2024-01-05'),
      landlordId: user?.uid
    }
  ];

  const mockRenterFavorites = [
    {
      id: 'fav1',
      title: 'Beautiful 3-Bedroom House',
      price: 4000,
      propertyType: 'House',
      location: { city: 'Accra', district: 'East Legon' },
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'],
      landlordInfo: { name: 'Mr. Kwame' },
      addedAt: new Date('2024-01-15')
    }
  ];

  const isLandlord = userProfile?.role === 'landlord';
  const isRenter = userProfile?.role === 'renter';

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, userProfile]);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      if (isLandlord) {
        await loadLandlordData();
      } else if (isRenter) {
        await loadRenterData();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      // Use mock data as fallback
      if (isLandlord) {
        setListings(mockLandlordListings);
        setStats({
          totalListings: mockLandlordListings.length,
          totalViews: mockLandlordListings.reduce((sum, listing) => sum + listing.views, 0),
          featuredListings: mockLandlordListings.filter(l => l.featured).length,
          pendingListings: 0
        });
      } else {
        setFavorites(mockRenterFavorites);
      }
      toast.error('Using sample data - Firebase connection needed for live data');
    } finally {
      setLoading(false);
    }
  }, [user, isLandlord, isRenter]);

  const loadLandlordData = async () => {
    try {
      const landlordListings = await listingService.getLandlordListings(user.uid);
      setListings(landlordListings);
      
      // Calculate stats
      const totalViews = landlordListings.reduce((sum, listing) => sum + (listing.views || 0), 0);
      const featuredCount = landlordListings.filter(listing => listing.featured).length;
      const pendingCount = landlordListings.filter(listing => listing.status === 'pending').length;
      
      setStats({
        totalListings: landlordListings.length,
        totalViews,
        featuredListings: featuredCount,
        pendingListings: pendingCount
      });
    } catch (error) {
      throw error;
    }
  };

  const loadRenterData = async () => {
    try {
      const userFavorites = await favoritesService.getUserFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      await listingService.deleteListing(listingId);
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success('Listing deleted successfully');
      
      // Refresh stats
      await loadLandlordData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const handleToggleFeature = async (listingId, currentFeatured) => {
    try {
      await listingService.updateListing(listingId, { featured: !currentFeatured });
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, featured: !currentFeatured }
          : listing
      ));
      toast.success(currentFeatured ? 'Listing removed from featured' : 'Listing featured successfully');
      
      // Refresh stats
      await loadLandlordData();
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const handleRemoveFavorite = async (listingId) => {
    try {
      await favoritesService.removeFavorite(user.uid, listingId);
      setFavorites(prev => prev.filter(fav => fav.id !== listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleEditListing = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleViewListing = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to access your dashboard.</p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.firstName || user.displayName || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                {isLandlord ? 'Manage your property listings' : 'View your saved properties'}
              </p>
            </div>
            {isLandlord && (
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => navigate('/add-listing')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add New Listing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              📱 Using sample data. Connect to Firebase for live dashboard data.
            </p>
          </div>
        )}

        {/* Landlord Dashboard */}
        {isLandlord && (
          <>
            {/* Stats */}
            <DashboardStats stats={stats} />

            {/* Listings Management */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <HomeIcon className="h-6 w-6 mr-2" />
                  Your Listings ({listings.length})
                </h2>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-12">
                  <HomeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first property listing.</p>
                  <button
                    onClick={() => navigate('/add-listing')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Your First Listing
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {listings.map((listing) => (
                    <LandlordListingCard
                      key={listing.id}
                      listing={listing}
                      onEdit={handleEditListing}
                      onDelete={handleDeleteListing}
                      onView={handleViewListing}
                      onToggleFeature={handleToggleFeature}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Renter Dashboard */}
        {isRenter && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <HeartIcon className="h-6 w-6 mr-2" />
                Saved Properties ({favorites.length})
              </h2>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                <p className="text-gray-600 mb-6">Browse listings and save your favorites for easy access.</p>
                <button
                  onClick={() => navigate('/listings')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="relative">
                    <ListingCard
                      listing={favorite}
                      isFavorite={true}
                      onToggleFavorite={() => handleRemoveFavorite(favorite.id)}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                      <button
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove from favorites"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Unknown Role */}
        {!isLandlord && !isRenter && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Please complete your profile to access dashboard features.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Complete Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
