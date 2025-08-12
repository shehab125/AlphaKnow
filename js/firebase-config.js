// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBw7CDkjn-3S2-anCdA2DW9foy5HftaS24",
    authDomain: "alphaknow-2f0d3.firebaseapp.com",
    projectId: "alphaknow-2f0d3",
    storageBucket: "alphaknow-2f0d3.firebasestorage.app",
    messagingSenderId: "924596688523",
    appId: "1:924596688523:web:f0a72b5eafe39f857da68e",
    measurementId: "G-GK8NJRRM1T"
};

// Initialize Firebase with error handling
let firebaseApp, auth, db, storage;

try {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK not loaded');
    }

    console.log('🔥 Firebase SDK detected, version:', firebase.SDK_VERSION);

    // Initialize Firebase
    firebaseApp = firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    // Initialize Firebase services
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    
    console.log('✅ Firebase services initialized');

    // Enable offline persistence for Firestore (optional)
    db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
            console.log('✅ Firestore offline persistence enabled');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ The current browser does not support persistence.');
            } else {
                console.warn('⚠️ Firestore persistence error:', err);
            }
        });

    // Export for use in other modules
    window.FIREBASE = {
        auth,
        db,
        storage,
        config: firebaseConfig,
        app: firebaseApp
    };

    console.log('🔥 Firebase initialized successfully');
    
    // Test basic connectivity without write operations
    console.log('🔄 Testing basic Firestore connectivity...');
    db.collection('test').doc('ping').get()
        .then(() => {
            console.log('✅ Firestore read connectivity OK');
        })
        .catch((error) => {
            console.warn('⚠️ Firestore read test failed:', error.message);
            if (error.code === 'permission-denied') {
                console.warn('🔒 Firestore read permission denied - check security rules');
            }
        });
    
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    
    // Create fallback objects to prevent errors
    window.FIREBASE = {
        auth: null,
        db: null,
        storage: null,
        config: firebaseConfig,
        app: null,
        error: error.message
    };
} 