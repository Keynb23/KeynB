// src/lib/firebase.js (or similar)

// Import core initialization function
import { initializeApp } from "firebase/app";

// Import specific service SDKs you need
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";   // For image/media files
// import { getAnalytics } from "firebase/analytics"; // Analytics is optional

// Your web app's Firebase configuration (unchanged)
const firebaseConfig = {
  apiKey: "AIzaSyCwB5e8dH_t7DUCms-31IZlYlVLm1Yu6yE",
  authDomain: "tech-portfolio-c6d24.firebaseapp.com",
  projectId: "tech-portfolio-c6d24",
  storageBucket: "tech-portfolio-c6d24.firebasestorage.app",
  messagingSenderId: "106033908897",
  appId: "1:106033908897:web:c368102465402ce3ccb4e0",
  measurementId: "G-1WCLGMGXNF"
};

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize and Export Services
export const auth = getAuth(app);         // For user login/logout
export const db = getFirestore(app);     // For storing project data
export const storage = getStorage(app);   // For storing images/media

// If you want analytics:
// const analytics = getAnalytics(app);

