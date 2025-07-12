import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  getDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

class FavoritesService {
  constructor() {
    this.collectionName = 'favorites';
  }

  // Add a listing to user's favorites
  async addFavorite(userId, listingId) {
    try {
      // Check if already favorited
      const existing = await this.getFavoriteRecord(userId, listingId);
      if (existing) {
        throw new Error('Listing is already in favorites');
      }

      const favoriteData = {
        userId,
        listingId,
        addedAt: new Date(),
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, this.collectionName), favoriteData);
      return { id: docRef.id, ...favoriteData };
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  // Remove a listing from user's favorites
  async removeFavorite(userId, listingId) {
    try {
      const favoriteRecord = await this.getFavoriteRecord(userId, listingId);
      if (!favoriteRecord) {
        throw new Error('Favorite not found');
      }

      await deleteDoc(doc(db, this.collectionName, favoriteRecord.id));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  // Get a specific favorite record
  async getFavoriteRecord(userId, listingId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('listingId', '==', listingId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting favorite record:', error);
      throw error;
    }
  }

  // Check if a listing is favorited by user
  async isFavorite(userId, listingId) {
    try {
      const record = await this.getFavoriteRecord(userId, listingId);
      return !!record;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Get all favorites for a user with listing details
  async getUserFavorites(userId) {
    try {
      // Get user's favorites
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('addedAt', 'desc')
      );
      
      const favoritesSnapshot = await getDocs(q);
      
      if (favoritesSnapshot.empty) {
        return [];
      }

      // Get listing details for each favorite
      const favorites = [];
      const { listingService } = await import('./listingService');
      
      for (const favoriteDoc of favoritesSnapshot.docs) {
        const favoriteData = favoriteDoc.data();
        
        try {
          // Get the listing details
          const listing = await listingService.getListingById(favoriteData.listingId);
          
          if (listing) {
            favorites.push({
              ...listing,
              favoriteId: favoriteDoc.id,
              addedAt: favoriteData.addedAt
            });
          }
        } catch (listingError) {
          console.warn(`Listing ${favoriteData.listingId} not found, skipping from favorites`);
          // Optionally clean up orphaned favorite
          // await deleteDoc(doc(db, this.collectionName, favoriteDoc.id));
        }
      }

      return favorites;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      throw error;
    }
  }

  // Get favorites count for a user
  async getFavoritesCount(userId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  }

  // Get all users who favorited a specific listing
  async getListingFavorites(listingId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('listingId', '==', listingId),
        orderBy('addedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting listing favorites:', error);
      throw error;
    }
  }

  // Toggle favorite status (add if not favorited, remove if favorited)
  async toggleFavorite(userId, listingId) {
    try {
      const isFavorited = await this.isFavorite(userId, listingId);
      
      if (isFavorited) {
        await this.removeFavorite(userId, listingId);
        return { favorited: false, message: 'Removed from favorites' };
      } else {
        await this.addFavorite(userId, listingId);
        return { favorited: true, message: 'Added to favorites' };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // Real-time listener for user's favorites
  subscribeToUserFavorites(userId, callback) {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('addedAt', 'desc')
    );

    return onSnapshot(q, 
      async (snapshot) => {
        try {
          const favorites = [];
          const { listingService } = await import('./listingService');
          
          for (const doc of snapshot.docs) {
            const favoriteData = doc.data();
            
            try {
              const listing = await listingService.getListingById(favoriteData.listingId);
              if (listing) {
                favorites.push({
                  ...listing,
                  favoriteId: doc.id,
                  addedAt: favoriteData.addedAt
                });
              }
            } catch (listingError) {
              console.warn(`Listing ${favoriteData.listingId} not found`);
            }
          }
          
          callback(favorites);
        } catch (error) {
          console.error('Error in favorites subscription:', error);
          callback([]);
        }
      },
      (error) => {
        console.error('Favorites subscription error:', error);
        callback([]);
      }
    );
  }

  // Batch operations
  async addMultipleFavorites(userId, listingIds) {
    try {
      const results = [];
      
      for (const listingId of listingIds) {
        try {
          const result = await this.addFavorite(userId, listingId);
          results.push({ success: true, listingId, result });
        } catch (error) {
          results.push({ success: false, listingId, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error adding multiple favorites:', error);
      throw error;
    }
  }

  async removeMultipleFavorites(userId, listingIds) {
    try {
      const results = [];
      
      for (const listingId of listingIds) {
        try {
          await this.removeFavorite(userId, listingId);
          results.push({ success: true, listingId });
        } catch (error) {
          results.push({ success: false, listingId, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error removing multiple favorites:', error);
      throw error;
    }
  }

  // Clear all favorites for a user
  async clearUserFavorites(userId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      return querySnapshot.size; // Return count of deleted favorites
    } catch (error) {
      console.error('Error clearing user favorites:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const favoritesService = new FavoritesService();
export default favoritesService;
