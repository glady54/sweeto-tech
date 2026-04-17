import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhzmKNjZ6z6EeeCyclLxvbKMc-TjKd7Qg",
  authDomain: "sweeto-tech.firebaseapp.com",
  projectId: "sweeto-tech",
  storageBucket: "sweeto-tech.firebasestorage.app",
  messagingSenderId: "936837153970",
  appId: "1:936837153970:web:fc427301fe6cb9c48175ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
