// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };