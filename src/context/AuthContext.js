import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Uygulamanın her yerinden erişebileceğimiz global bir Auth "deposu" oluşturuyoruz
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Başlangıçta kullanıcı yok (giriş yapmamış)
  const [loading, setLoading] = useState(true); // Firebase'den yanıt gelene kadar bekleme durumu

  useEffect(() => {
    // onAuthStateChanged: Firebase'in kullanıcı oturum durumunu canlı olarak dinleyen harika bir fonksiyonu
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Kullanıcı kontrolü bittiğinde yükleme ekranını kapat
    });

    // Bileşen ekrandan kalktığında dinlemeyi durdur (Performans için)
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};