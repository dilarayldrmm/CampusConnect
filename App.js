import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 1. Auth Ekranları (Şimdilik sadece Login var)
import Login from './src/screens/auth/Login';

// 2. Ana Tab Ekranları
import Discover from './src/screens/discover/Discover';
import CommunityList from './src/screens/community/CommunityList';
import MarketHome from './src/screens/market/MarketHome';
import ChatList from './src/screens/chat/ChatList';
import Profile from './src/screens/profile/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Alt Sekme (Bottom Tab) Navigasyonu
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="DiscoverTab" component={Discover} options={{ title: 'Keşfet' }} />
      <Tab.Screen name="CommunityTab" component={CommunityList} options={{ title: 'Topluluk' }} />
      <Tab.Screen name="MarketTab" component={MarketHome} options={{ title: 'Market' }} />
      <Tab.Screen name="MessagesTab" component={ChatList} options={{ title: 'Mesajlar' }} />
      <Tab.Screen name="ProfileTab" component={Profile} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// Kök (Root) Navigasyon
export default function App() {
  // TODO: İleride Firebase Context'ten (AuthContext) gelecek.
  // Geliştirme yaparken bu değeri true/false yaparak ekranları test edebilirsin.
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Giriş yapılmamışsa Auth akışını göster
          <Stack.Screen name="Auth" component={Login} />
        ) : (
          // Giriş yapılmışsa Ana Tab akışını göster
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
