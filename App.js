import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';

// Context ve Providerlar
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

// Ekranlar
import Login from './src/screens/auth/Login';
import Register from './src/screens/auth/Register';
import Discover from './src/screens/discover/Discover';
import CommunityList from './src/screens/community/CommunityList';
import MarketHome from './src/screens/market/MarketHome';
import ChatList from './src/screens/chat/ChatList';
import Profile from './src/screens/profile/Profile';
import EventDetail from './src/screens/discover/EventDetail';
import CreateEvent from './src/screens/discover/CreateEvent';
import Settings from './src/screens/profile/Settings';
import ChatDetail from './src/screens/chat/ChatDetail';
import ListingDetail from './src/screens/market/ListingDetail';
import CommunityDetail from './src/screens/community/CommunityDetail';
import CreateListing from './src/screens/market/CreateListing';
import MyListings from './src/screens/profile/MyListings';
import JoinedEvents from './src/screens/profile/JoinedEvents';
import EditListing from './src/screens/market/EditListing';
import EditProfile from './src/screens/profile/EditProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4A1D5D',
        tabBarInactiveTintColor: '#D1B8E0',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#333' : '#F0E6F5',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'DiscoverTab') iconName = 'compass';
          else if (route.name === 'CommunityTab') iconName = 'users';
          else if (route.name === 'MarketTab') iconName = 'shopping-bag';
          else if (route.name === 'MessagesTab') return <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={size} color={color} />;
          else if (route.name === 'ProfileTab') iconName = 'user';
          
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DiscoverTab" component={Discover} options={{ title: 'Keşfet' }} />
      <Tab.Screen name="CommunityTab" component={CommunityList} options={{ title: 'Topluluk' }} />
      <Tab.Screen name="MarketTab" component={MarketHome} options={{ title: 'Market' }} />
      <Tab.Screen name="MessagesTab" component={ChatList} options={{ title: 'Mesajlar' }} />
      <Tab.Screen name="ProfileTab" component={Profile} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// Navigasyon mantığını ayrı bir bileşene ayırdık
function NavigationContent() {
  const { user, loading } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#121212' : '#FFF' }}>
        <ActivityIndicator size="large" color="#4A1D5D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Group>
            <Stack.Screen name="Auth" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Group>
        ) : (
          <>
            <Stack.Group>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="EventDetail" component={EventDetail} />
              <Stack.Screen name="ChatDetail" component={ChatDetail} />
              <Stack.Screen name="ListingDetail" component={ListingDetail} />
              <Stack.Screen name="CreateListing" component={CreateListing} />
              <Stack.Screen name="CommunityDetail" component={CommunityDetail} />
              <Stack.Screen name="MyListings" component={MyListings} />
              <Stack.Screen name="JoinedEvents" component={JoinedEvents} />
              <Stack.Screen name="EditListing" component={EditListing} />
              <Stack.Screen name="EditProfile" component={EditProfile} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="CreateEvent" component={CreateEvent} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContent />
      </ThemeProvider>
    </AuthProvider>
  );
}