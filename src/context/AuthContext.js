import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Profil güncelleme fonksiyonunu buraya ekledik
  const updateUserData = async (displayName, photoURL) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: photoURL,
        });
        // State'i manuel olarak tetikleyerek uygulamanın her yerinde yenilenmesini sağlıyoruz
        setUser({ ...auth.currentUser, displayName, photoURL });
      } catch (error) {
        console.error("Profil güncellenemedi:", error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};