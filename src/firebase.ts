import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBv_oSfpPi7ZmxXyxb7q9ljFBxhRKAS3js",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "triniglassdb.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "triniglassdb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "triniglassdb.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "715332837407",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:715332837407:web:cac03fc532c44fa34b352a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-98Y1EMSKXL",
};

if (!firebaseConfig.projectId) {
  console.error("ERROR: VITE_FIREBASE_PROJECT_ID is undefined. Revisa tu .env o variables de entorno.");
}

console.log("Firebase config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);