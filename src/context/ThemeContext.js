import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Cihazın kendi koyu/açık mod ayarını başlangıç değeri olarak alıyoruz
  const deviceTheme = useColorScheme(); 
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  // Kullanıcı cihaz ayarını değiştirirse uygulamayı da güncelle
  useEffect(() => {
    setIsDarkMode(deviceTheme === 'dark');
  }, [deviceTheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};