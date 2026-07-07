import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 1. Auth Ekranları
import Login from './src/screens/auth/Login';
import Register from './src/screens/auth/Register'; // <-- Register eklendi

// 2. Ana Tab Ekranları
import Discover from './src/screens/discover/Discover';
import CommunityList from './src/screens/community/CommunityList';
import MarketHome from './src/screens/market/MarketHome';
import ChatList from './src/screens/chat/ChatList';
import Profile from './src/screens/profile/Profile';

// 3. Alt Sayfalar (Sub-pages)
import EventDetail from './src/screens/discover/EventDetail';
// 3. Alt Sayfalar (Sub-pages)
import CreateEvent from './src/screens/discover/CreateEvent';
import Settings from './src/screens/profile/Settings';
import ChatDetail from './src/screens/chat/ChatDetail';
import ListingDetail from './src/screens/market/ListingDetail';
import CommunityDetail from './src/screens/community/CommunityDetail';

// Context
import { AuthProvider, AuthContext } from './src/context/AuthContext';

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

// Yönlendirme Mantığını Tutan Fonksiyon (AuthContext burada çalışır)
function RootNavigator() {
  // Firebase'den gerçek kullanıcı durumunu alıyoruz
  const { user, loading } = useContext(AuthContext);

  // Uygulama ilk açıldığında Firebase'i beklerken dönen loading ekranı
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // KULLANICI GİRİŞ YAPMAMIŞSA
          <Stack.Group>
            <Stack.Screen name="Auth" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Group>
        ) : (
          // KULLANICI GİRİŞ YAPMIŞSA
          <>
            <Stack.Group>
              {/* DİKKAT: Uygulamanın ana ekranı olduğu için MainTabs EN ÜSTTE olmalı! */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
              
              {/* Diğer detay sayfaları onun altında sıralanabilir */}
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="EventDetail" component={EventDetail} />
              <Stack.Screen name="ChatDetail" component={ChatDetail} />
              <Stack.Screen name="ListingDetail" component={ListingDetail} />
              <Stack.Screen name="CommunityDetail" component={CommunityDetail} />
            </Stack.Group>
            
            {/* Modal Olarak Açılacak Sayfalar */}
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="CreateEvent" component={CreateEvent} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Uygulamanın En Kök (Root) Bileşeni
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}