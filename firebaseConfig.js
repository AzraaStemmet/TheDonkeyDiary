//  is a setup script to integrate Firebase into the application
// essential to initialize and configure our Firebase app
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKHWXBJ26ut-kectGIyCKcPy90tdDNbYM", // used for authenticating requests from the app
  authDomain: "thedonkeydiary.firebaseapp.com", // used for hosting authentication UI and handling auth-related requests
  projectId: "thedonkeydiary", // unique identifier for firebase application
  storageBucket: "thedonkeydiary.appspot.com", // used for storing images and documents
  messagingSenderId: "360396801033", // handles sending notifications
  appId: "1:360396801033:web:7d85020462e389f77be4d8" // unique identifier for firebase app instance
};

// Initialize Firebase, used to interact with various firebase services
const app = initializeApp(firebaseConfig);