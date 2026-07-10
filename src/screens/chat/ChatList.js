import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context import edildi
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChatList({ navigation }) {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(chat => chat.users && chat.users.includes(user.uid));
      setChats(fetchedChats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) return <View style={[styles.center, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}><ActivityIndicator size="large" color="#4A1D5D" /></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <Text style={styles.title}>Mesajlar</Text>
      </LinearGradient>

      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0E6F5' }]}>
        <Feather name="search" size={20} color="#9A73B5" />
        <TextInput
          style={[styles.searchInput, { color: isDarkMode ? '#FFF' : '#000' }]}
          placeholder="Ara..."
          placeholderTextColor={isDarkMode ? '#888' : '#9A73B5'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const otherName = item.buyerId === user.uid ? item.sellerName : item.buyerName;
          return (
            <TouchableOpacity 
              style={[styles.chatItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0E6F5' }]} 
              onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, sellerName: otherName, listingTitle: item.listingTitle })}
            >
              <View style={[styles.avatarPlaceholder, { backgroundColor: isDarkMode ? '#333' : '#F0E6F5' }]}>
                <Text style={styles.avatarText}>{otherName?.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text style={[styles.userName, { color: isDarkMode ? '#FFF' : '#000' }]}>{otherName}</Text>
                <Text style={[styles.lastMessage, { color: isDarkMode ? '#AAA' : '#666' }]} numberOfLines={1}>{item.lastMessage || "Sohbeti başlat..."}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#D1B8E0" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: isDarkMode ? '#888' : '#999' }]}>Henüz bir sohbetin yok.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 16, height: 50, marginBottom: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15, marginLeft: 10 },
  list: { padding: 20 },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#4A1D5D', fontSize: 18, fontWeight: 'bold' },
  chatInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  lastMessage: { fontSize: 13 },
  emptyText: { textAlign: 'center', marginTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});