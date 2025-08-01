# Firebase Login Issue Solution Guide

## Problem
"I connected it to Firebase and added an account, but when I try to log in to the control panel, it says an error occurred"

## Quick Solutions

### 1. Check Firebase Configuration
Make sure `js/firebase-config.js` contains the correct settings:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBw7CDkjn-3S2-anCdA2DW9foy5HftaS24",
    authDomain: "alphaknow-2f0d3.firebaseapp.com",
    projectId: "alphaknow-2f0d3",
    storageBucket: "alphaknow-2f0d3.firebasestorage.app",
    messagingSenderId: "924596688523",
    appId: "1:924596688523:web:f0a72b5eafe39f857da68e",
    measurementId: "G-GK8NJRRM1T"
};
```

### 2. Create User in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project `alphaknow-2f0d3`
3. Go to **Authentication** → **Users**
4. Click **Add User**
5. Enter email and password
6. Click **Add**

### 3. Enable Authentication
1. In Firebase Console
2. Go to **Authentication** → **Sign-in method**
3. Make sure **Email/Password** is enabled

### 4. Check Firestore Rules
1. In Firebase Console
2. Go to **Firestore Database** → **Rules**
3. Make sure rules allow read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Use Debug Page
1. Go to `admin/debug.html`
2. Follow the instructions on the page
3. Record the results

### 6. Check Browser Console
1. Press **F12** to open developer tools
2. Go to **Console** tab
3. Try to log in
4. Look for error messages

## Common Errors and Solutions

| Error | Solution |
|-------|----------|
| `auth/user-not-found` | Create user in Firebase Console |
| `auth/wrong-password` | Check password |
| `auth/invalid-email` | Check email format |
| `auth/network-request-failed` | Check internet connection |
| `Firebase not loaded` | Check Firebase SDK loading |

## Diagnostic Steps

### 1. Check Firebase SDK
```javascript
// In browser console
console.log(typeof firebase); // Should print "object"
console.log(window.FIREBASE); // Should print Firebase config
```

### 2. Test Login
```javascript
// In browser console
firebase.auth().signInWithEmailAndPassword('your-email@example.com', 'your-password')
  .then((userCredential) => {
    console.log('Login successful:', userCredential.user);
  })
  .catch((error) => {
    console.error('Login failed:', error);
  });
```

## If Problem Persists

1. **Check Firebase Console Settings**
   - Ensure Authentication is enabled
   - Ensure Firestore Database is enabled
   - Check security rules

2. **Check Project Files**
   - Ensure `js/firebase-config.js` exists
   - Ensure `js/firebase-service.js` exists
   - Ensure Firebase SDK files are loaded

3. **Check Browser**
   - Try different browser
   - Clear cache
   - Check security settings

4. **Get Support**
   - Use debug page `admin/debug.html`
   - Record error messages
   - Attach console screenshot 