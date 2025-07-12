# Firebase Project Setup Complete! 🔥

## ✅ Configuration Added
Your Firebase configuration has been successfully added to the project:
- **Project ID:** rent-easy-gh
- **Auth Domain:** rent-easy-gh.firebaseapp.com
- **Storage Bucket:** rent-easy-gh.firebasestorage.app

## 🔧 Next Steps in Firebase Console

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/project/rent-easy-gh)
2. Navigate to **Authentication** > **Sign-in method**
3. Enable **Email/Password** authentication
4. Optionally enable **Google** sign-in for future use

### 2. Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add proper rules below)
4. Select a location (preferably close to Ghana/West Africa)

### 3. Set up Storage
1. Go to **Storage**
2. Click **Get started**
3. Start in test mode
4. Choose the same location as Firestore

### 4. Basic Security Rules for Firestore

Copy this to your Firestore Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow all users to read basic user info for landlord verification
      allow read: if request.auth != null && resource.data.role == 'landlord';
    }
    
    // Public read access to approved listings
    match /listings/{listingId} {
      allow read: if resource.data.status == 'approved' || resource.data.status == 'featured';
      allow create: if request.auth != null && request.auth.uid == request.resource.data.landlordId;
      allow update: if request.auth != null && request.auth.uid == resource.data.landlordId;
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.landlordId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Admin-only access to reports
    match /reports/{reportId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
    
    // Admin-only access to abuse reports
    match /abuseReports/{reportId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
    
    // Featured listings management
    match /featuredListings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Payment records
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Storage Security Rules

Copy this to your Storage Rules tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listing images
    match /listings/{listingId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Verification documents (Ghana Card, etc.)
    match /verification/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🧪 Test Your Setup

1. **Open the app:** http://localhost:3000
2. **Click "Get Started"** to test signup
3. **Create a test account** as both Renter and Landlord
4. **Check Firebase Console** to see users being created

## ⚠️ Important Notes

- **Test Mode:** Your database starts in test mode (30 days)
- **Security:** The rules above provide basic security for development
- **Production:** You'll need to refine these rules before going live
- **Billing:** Enable Blaze plan for production features

## 🎯 Ready for Development!

Your Firebase backend is now configured and ready! You can:
- ✅ Test user authentication
- ✅ Store user data in Firestore
- ✅ Upload images to Storage
- ✅ Start building listing features

---

*Next: Ready to build the Add Listing form for landlords?* 🏠
