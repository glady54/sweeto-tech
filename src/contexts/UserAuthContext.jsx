import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import LoadingScreen from '../components/LoadingScreen';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const MINIMUM_LOADING_MS = 2000; // 2 seconds

    // Listen to Firebase authentication state for Customers
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'sweeto@sweeto.com') {
          // Admin viewing storefront treatment (optional logic)
      }
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      
      const elapsed = Date.now() - startTime;
      const remainingTime = MINIMUM_LOADING_MS - elapsed;

      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Customer Login Error:", error);
      let errorMessage = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') errorMessage = 'Account not found. Please register.';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
      else if (error.code === 'auth/invalid-credential') errorMessage = 'Invalid email or password.';
      else if (error.code === 'auth/too-many-requests') errorMessage = 'Too many attempts. Try again later.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // Update local state to reflect displayName immediately
      setUser({ ...userCredential.user, displayName: name });
      return { success: true };
    } catch (error) {
      console.error("Customer Registration Error:", error);
      let errorMessage = 'Could not create account';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'This email is already registered.';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password must be at least 6 characters.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <UserAuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </UserAuthContext.Provider>
  );
};
