// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth'; // Import necessary methods for auth
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this package is installed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKHWXBJ26ut-kectGIyCKcPy90tdDNbYM", // used for authenticating requests from the app
  authDomain: "thedonkeydiary.firebaseapp.com", // used for hosting authentication UI and handling auth-related requests
  projectId: "thedonkeydiary", // unique identifier for firebase application
  storageBucket: "thedonkeydiary.appspot.com", // used for storing images and documents
  messagingSenderId: "360396801033", // handles sending notifications
  appId: "1:360396801033:web:7d85020462e389f77be4d8" // unique identifier for firebase app instance
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth and configure persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Failed to set persistence: ', error);
  });

// Export the Firestore and Auth instances
export { db, auth };
