// Import core initialization function
import { initializeApp } from "firebase/app";

// Import specific service SDKs you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // For image/media files

// WARNING: Do NOT hardcode secrets here for production deployment.
// Instead, load them securely from environment variables (VITE_ prefix for Vite/React).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional
};

// 1. Initialize Firebase App
// Check if all necessary config values are present before initializing
if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing. Ensure VITE_FIREBASE_API_KEY is set in environment variables (e.g., .env or Vercel settings).");
}

const app = initializeApp(firebaseConfig);

// 2. Initialize and Export Services
export const auth = getAuth(app); // For user login/logout
export const db = getFirestore(app); // For storing project data
export const storage = getStorage(app); // For storing images/media
