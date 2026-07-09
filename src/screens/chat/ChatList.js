import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

export default function ChatList({ navigation }) {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    // Sadece benim dahil olduğum sohbetleri getir
    const q = query(
      collection(db, 'chats'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(chat => chat.users && chat.users.includes(user.uid));
      
      setChats(fetchedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const renderChatItem = ({ item }) => {
    // Sohbeti eden iki kişiden karşıdakinin adını bul
    const isBuyer = item.buyerId === user.uid;
    const otherName = isBuyer ? item.sellerName : item.buyerName;

    return (
      <TouchableOpacity 
        style={styles.chatItem} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ChatDetail', { 
          chatId: item.id, 
          sellerName: otherName,
          listingTitle: item.listingTitle 
        })}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{otherName?.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.chatInfo}>
          <Text style={styles.userName}>{otherName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "Sohbeti başlat..."}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz bir sohbetin yok.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, marginTop: 10, marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, height: 46, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  avatarContainer: { marginRight: 14 },
  avatarPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  chatInfo: { flex: 1, justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#6B7280' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#9CA3AF' }
});