// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { profileApi } from '../profileApi';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pwd: string) => Promise<void>;
  signUp: (email: string, pwd: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Create or update user profile when signing in
        try {
          const profile = await profileApi.getProfile();
          if (!profile) {
            // If no profile exists, create one from Google data
            if (user.providerData[0]?.providerId === 'google.com') {
              await profileApi.createProfileFromGoogle(user);
            }
          }
          navigate('/dashboard');
        } catch (error) {
          console.error('Error handling user profile:', error);
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const signIn = async (email: string, pwd: string): Promise<void> => {
    const result = await signInWithEmailAndPassword(auth, email, pwd);
    if (result.user) {
      navigate('/dashboard');
    }
  };

  const signUp = async (email: string, pwd: string): Promise<void> => {
    const result = await createUserWithEmailAndPassword(auth, email, pwd);
    if (result.user) {
      navigate('/dashboard');
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Profile creation is handled in the onAuthStateChanged listener
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
