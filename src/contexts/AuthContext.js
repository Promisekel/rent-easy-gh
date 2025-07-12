import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { authService, userService } from '../services/authService';
import { USER_ROLES } from '../utils/constants';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const result = await authService.signUp(email, password, userData);
      setUserData(result.userData);
      toast.success('Account created successfully! Please verify your email.');
      return result.user;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const user = await authService.signIn(email, password);
      toast.success('Welcome back!');
      return user;
    } catch (error) {
      console.error('Signin error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await authService.signOut();
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      await authService.resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Send email verification
  const sendEmailVerification = async () => {
    try {
      if (currentUser) {
        await authService.sendEmailVerification(currentUser);
        toast.success('Verification email sent!');
      }
    } catch (error) {
      console.error('Send email verification error:', error);
      toast.error('Failed to send verification email');
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedData = await userService.updateUserProfile(currentUser.uid, updates);
      setUserData(prev => ({ ...prev, ...updatedData }));
      
      toast.success('Profile updated successfully!');
      return updatedData;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const data = await userService.getUserData(uid);
      if (data) {
        setUserData(data);
        
        // Mark email as verified if it's verified in auth but not in Firestore
        if (currentUser?.emailVerified && !data.isEmailVerified) {
          await userService.markEmailAsVerified(uid);
          setUserData(prev => ({ ...prev, isEmailVerified: true }));
        }
      }
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userService.hasRole(userData, role);
  };

  // Check if user is admin
  const isAdmin = () => userService.isAdmin(userData);

  // Check if user is landlord
  const isLandlord = () => userService.isLandlord(userData);

  // Check if user is renter
  const isRenter = () => userService.isRenter(userData);

  // Check if user is verified
  const isVerified = () => {
    return userData?.isVerified && userData?.isEmailVerified;
  };

  // Check if user is premium
  const isPremium = () => {
    return userData?.isPremium;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    // User state
    currentUser,
    userData,
    loading,
    
    // Authentication methods
    signup,
    signin,
    logout,
    resetPassword,
    sendEmailVerification,
    
    // User management
    updateUserProfile,
    fetchUserData,
    
    // Role checking
    hasRole,
    isAdmin,
    isLandlord,
    isRenter,
    isVerified,
    isPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
