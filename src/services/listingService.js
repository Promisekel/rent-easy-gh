import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../utils/firebase';

// Listing Management Service
export const listingService = {
  // Create a new listing
  async createListing(listingData, images = []) {
    try {
      // Upload images first
      const imageUrls = await this.uploadImages(images);
      
      const listing = {
        ...listingData,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        views: 0,
        favorites: 0
      };

      const docRef = await addDoc(collection(db, 'listings'), listing);
      return { id: docRef.id, ...listing };
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Upload images to Firebase Storage
  async uploadImages(images) {
    try {
      const uploadPromises = images.map(async (image, index) => {
        const imageRef = ref(storage, `listings/${Date.now()}_${index}_${image.name}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Get listings with filters
  async getListings(filters = {}) {
    try {
      let q = collection(db, 'listings');
      
      const constraints = [];
      
      if (filters.region) {
        constraints.push(where('location.region', '==', filters.region));
      }
      
      if (filters.city) {
        constraints.push(where('location.city', '==', filters.city));
      }
      
      if (filters.propertyType) {
        constraints.push(where('propertyType', '==', filters.propertyType));
      }
      
      if (filters.minPrice) {
        constraints.push(where('price', '>=', Number(filters.minPrice)));
      }
      
      if (filters.maxPrice) {
        constraints.push(where('price', '<=', Number(filters.maxPrice)));
      }
      
      if (filters.bedrooms) {
        constraints.push(where('bedrooms', '==', Number(filters.bedrooms)));
      }
      
      constraints.push(where('status', '==', 'active'));
      constraints.push(orderBy('createdAt', 'desc'));
      
      if (filters.limit) {
        constraints.push(limit(Number(filters.limit)));
      }
      
      q = query(q, ...constraints);
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting listings:', error);
      throw error;
    }
  },

  // Get listings by landlord
  async getLandlordListings(landlordId) {
    try {
      const q = query(
        collection(db, 'listings'),
        where('landlordId', '==', landlordId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting landlord listings:', error);
      throw error;
    }
  },

  // Get single listing
  async getListing(listingId) {
    try {
      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Listing not found');
      }
    } catch (error) {
      console.error('Error getting listing:', error);
      throw error;
    }
  },

  // Update listing
  async updateListing(listingId, updates) {
    try {
      const docRef = doc(db, 'listings', listingId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { id: listingId, ...updates };
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Delete listing
  async deleteListing(listingId) {
    try {
      // Get listing first to delete images
      const listing = await this.getListing(listingId);
      
      // Delete images from storage
      if (listing.images && listing.images.length > 0) {
        await this.deleteImages(listing.images);
      }
      
      // Delete listing document
      await deleteDoc(doc(db, 'listings', listingId));
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  // Delete images from storage
  async deleteImages(imageUrls) {
    try {
      const deletePromises = imageUrls.map(async (url) => {
        const imageRef = ref(storage, url);
        return await deleteObject(imageRef);
      });
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting images:', error);
      // Don't throw error as this is cleanup
    }
  },

  // Increment view count
  async incrementViews(listingId) {
    try {
      const docRef = doc(db, 'listings', listingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Don't throw error as this is just analytics
    }
  },

  // Search listings
  async searchListings(searchTerm, filters = {}) {
    try {
      // This is a basic search - for production, consider using Algolia or similar
      const allListings = await this.getListings(filters);
      
      if (!searchTerm) return allListings;
      
      const searchLower = searchTerm.toLowerCase();
      return allListings.filter(listing => 
        listing.title?.toLowerCase().includes(searchLower) ||
        listing.description?.toLowerCase().includes(searchLower) ||
        listing.location?.city?.toLowerCase().includes(searchLower) ||
        listing.location?.district?.toLowerCase().includes(searchLower) ||
        listing.location?.region?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching listings:', error);
      throw error;
    }
  }
};

// Validation helpers
export const listingValidation = {
  validateListingData(data) {
    const errors = {};

    if (!data.title?.trim()) {
      errors.title = 'Property title is required';
    }

    if (!data.description?.trim()) {
      errors.description = 'Property description is required';
    }

    if (!data.propertyType) {
      errors.propertyType = 'Property type is required';
    }

    if (!data.price || data.price <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!data.location?.region) {
      errors.region = 'Region is required';
    }

    if (!data.location?.city) {
      errors.city = 'City is required';
    }

    if (!data.bedrooms || data.bedrooms < 0) {
      errors.bedrooms = 'Number of bedrooms is required';
    }

    if (!data.bathrooms || data.bathrooms < 0) {
      errors.bathrooms = 'Number of bathrooms is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateImages(images) {
    const maxImages = 10;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    const errors = [];

    if (images.length === 0) {
      errors.push('At least one image is required');
    }

    if (images.length > maxImages) {
      errors.push(`Maximum ${maxImages} images allowed`);
    }

    images.forEach((image, index) => {
      if (!allowedTypes.includes(image.type)) {
        errors.push(`Image ${index + 1}: Only JPEG, PNG, and WebP files are allowed`);
      }

      if (image.size > maxSize) {
        errors.push(`Image ${index + 1}: File size must be less than 5MB`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default listingService;
