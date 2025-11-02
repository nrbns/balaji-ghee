# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "Balaji Ghee Store"
4. Accept terms and continue
5. **Disable Google Analytics** (optional) or enable if you want
6. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, click **Authentication** in left sidebar
2. Click **Get Started**
3. Enable these providers:
   - **Phone** (for Phone OTP)
   - **Google** (for Google Sign-in)

### Phone Authentication Setup
- Click "Phone" provider
- Click "Enable"
- Add test phone numbers if needed (optional)

### Google Authentication Setup
- Click "Google" provider
- Click "Enable"
- Enter support email
- Save

## Step 3: Create Firestore Database

1. In Firebase Console, click **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** or **Test mode** (Test mode for development)
4. Select a region (prefer one close to India for latency)
5. Click **Enable**

## Step 4: Configure Web App

1. In Firebase Console, click the **Web icon** `</>`
2. Enter app nickname: "Balaji Ghee Web App"
3. Check "Also set up Firebase Hosting" (optional for now)
4. Click **Register app**
5. **Copy the Firebase configuration** - you'll need this!

Your config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Add to Your Project

Copy the config above and create `.env` file with these values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 6: Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Orders - users can read their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.role == 'admin' || 
         request.auth.token.role == 'employee');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'employee');
    }
    
    // Shipments - same as orders
    match /shipments/{shipmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'employee');
    }
    
    // Chats - only participants
    match /chats/{roomId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid ||
         resource.data.employeeId == request.auth.uid ||
         request.auth.token.role == 'admin');
    }
    
    // Leads - admin only
    match /leads/{leadId} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
  }
}
```

3. Click **Publish**

## Step 7: Get Google OAuth Client ID (for Google Sign-in)

1. In Firebase Console → **Authentication** → **Sign-in method** → **Google**
2. Click **Web SDK configuration**
3. Copy the **Web client ID** (you may not need this if using Firebase SDK)

## Step 8: Configure reCAPTCHA (for Phone Auth)

1. In Firebase Console → **Authentication** → **Sign-in method** → **Phone**
2. The reCAPTCHA domain will be set automatically
3. For development, you can use test numbers

## Next Steps

Once Firebase is set up, I'll create the integration code:

1. `src/lib/firebase.ts` - Firebase config
2. `src/lib/auth.ts` - Auth utilities
3. Update login page with Phone OTP
4. Add Google Sign-in button
5. Set up Firestore collections

**Once you've completed these steps, let me know and I'll continue with the code!**

