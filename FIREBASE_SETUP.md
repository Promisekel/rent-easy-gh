# Rent Easy GH - Firebase Setup Guide

## 🔥 Firebase Configuration

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `rent-easy-gh`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Optionally enable **Google** sign-in for future use

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select your preferred location (choose closest to Ghana)

### 4. Set up Storage

1. Go to **Storage**
2. Click **Get started**
3. Start in test mode
4. Choose same location as Firestore

### 5. Get Firebase Configuration

1. Go to **Project settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web** app icon (`</>`)
4. Register app with nickname: `rent-easy-gh-web`
5. Copy the configuration object

### 6. Update Environment Variables

Copy your Firebase config to `.env.local`:

```env
# Replace with your actual Firebase config values
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 📊 Firestore Database Structure

### Collections we'll create:

```
/users/{userId}
/listings/{listingId}
/payments/{paymentId}
/reports/{reportId}
/abuseReports/{reportId}
/featuredListings/{listingId}
/verificationRequests/{requestId}
```

### Security Rules (to be added later):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access to approved listings
    match /listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.landlordId;
    }
    
    // Admin-only access to reports
    match /reports/{reportId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🚀 Next Steps

1. Add your Firebase config to `.env.local`
2. Run `npm start` to test the authentication
3. Create a test user account
4. Verify that the dashboard loads correctly

## 📝 Additional Services to Set Up Later

- **Paystack Account** for payments
- **Google Maps API** for location services
- **Firebase Cloud Functions** for backend logic
- **Firebase Hosting** for deployment

---

*Note: Keep your Firebase configuration secure and never commit `.env.local` to version control.*
