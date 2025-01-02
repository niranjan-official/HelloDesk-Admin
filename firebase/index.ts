// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKS4UpZqgWFHY2uzVmSWUfow5Ev-9feq8",
  authDomain: "hellodesk-56a44.firebaseapp.com",
  projectId: "hellodesk-56a44",
  databaseURL: "https://hellodesk-56a44-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "hellodesk-56a44.firebasestorage.app",
  messagingSenderId: "1641655571",
  appId: "1:1641655571:web:6cd6e0bbc5f0026ad3fee6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const db = getFirestore(app);