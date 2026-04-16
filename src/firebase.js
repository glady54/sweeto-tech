import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEb7jPWB6gwXbKKnAtrqNkJvbLltUbmdE",
  authDomain: "sweeto-hub.firebaseapp.com",
  projectId: "sweeto-hub",
  storageBucket: "sweeto-hub.firebasestorage.app",
  messagingSenderId: "161210595288",
  appId: "1:161210595288:web:2f76045389370aa83fe4ad",
  measurementId: "G-G8S34T9XJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
