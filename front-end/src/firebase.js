// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6qXlm2vnBTfg5UvmhCDbGPB_OXjYU0N0",
  authDomain: "multimath-589a5.firebaseapp.com",
  projectId: "multimath-589a5",
  storageBucket: "multimath-589a5.appspot.com",
  messagingSenderId: "941627777257",
  appId: "1:941627777257:web:54e36e1eab5d6c4bd95078",
  measurementId: "G-Y8ZVVGNVQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);  // Initialize Firebase Analytics
const auth = getAuth(app);            // Initialize Firebase Auth

export { auth };
