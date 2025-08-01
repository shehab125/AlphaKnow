const firebaseConfig = {
    apiKey: "AIzaSyBw7CDkjn-3S2-anCdA2DW9foy5HftaS24",
    authDomain: "alphaknow-2f0d3.firebaseapp.com",
    projectId: "alphaknow-2f0d3",
    storageBucket: "alphaknow-2f0d3.firebasestorage.app",
    messagingSenderId: "924596688523",
    appId: "1:924596688523:web:f0a72b5eafe39f857da68e",
    measurementId: "G-GK8NJRRM1T"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other modules
window.FIREBASE = {
  auth,
  db,
  storage,
  config: firebaseConfig
};

console.log('🔥 Firebase initialized successfully'); 