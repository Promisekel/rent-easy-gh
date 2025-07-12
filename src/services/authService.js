import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { USER_ROLES } from '../utils/constants';

// Authentication Services
export const authService = {
  // Sign up new user
  async signUp(email, password, userData) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role || USER_ROLES.RENTER,
        isVerified: false,
        isPremium: false,
        isEmailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileImage: null,
        bio: null,
        location: userData.location || null,
        // Landlord specific fields
        ghanaCardNumber: userData.ghanaCardNumber || null,
        momoNumber: userData.momoNumber || null,
        businessName: userData.businessName || null,
        // Stats
        totalListings: 0,
        totalViews: 0,
        rating: 0,
        reviewCount: 0
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      // Send email verification
      await sendEmailVerification(user);

      return { user, userData: userDoc };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // Send email verification
  async sendEmailVerification(user) {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Send email verification error:', error);
      throw error;
    }
  }
};

// User Services
export const userService = {
  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      const userRef = doc(db, 'users', uid);
      const updatedData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(userRef, updatedData);
      return updatedData;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },

  // Mark email as verified
  async markEmailAsVerified(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        isEmailVerified: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Mark email verified error:', error);
      throw error;
    }
  },

  // Get users by role
  async getUsersByRole(role) {
    try {
      const q = query(collection(db, 'users'), where('role', '==', role));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  },

  // Check if user has specific role
  hasRole(userData, role) {
    return userData?.role === role;
  },

  // Check if user is admin
  isAdmin(userData) {
    return this.hasRole(userData, USER_ROLES.ADMIN);
  },

  // Check if user is landlord
  isLandlord(userData) {
    return this.hasRole(userData, USER_ROLES.LANDLORD);
  },

  // Check if user is renter
  isRenter(userData) {
    return this.hasRole(userData, USER_ROLES.RENTER);
  },

  // Update user stats (for landlords)
  async updateUserStats(uid, stats) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...stats,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Update user stats error:', error);
      throw error;
    }
  }
};

// Validation helpers
export const validation = {
  // Validate Ghana phone number
  isValidGhanaPhone(phone) {
    const phoneRegex = /^(\+233|0)[2-9]\d{8}$/;
    return phoneRegex.test(phone);
  },

  // Validate Ghana Card number format
  isValidGhanaCard(cardNumber) {
    const cardRegex = /^GHA-\d{9}-\d$/;
    return cardRegex.test(cardNumber);
  },

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password strength validation
  isStrongPassword(password) {
    return password.length >= 6;
  }
};
