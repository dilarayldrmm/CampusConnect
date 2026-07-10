import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // ThemeContext eklendi
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyListings({ navigation }) {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // Tema durumu çekildi
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'listings'), where('creatorId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) return <ActivityIndicator style={{flex:1, backgroundColor: isDarkMode ? '#121212' : '#FDFDFD'}} color="#4A1D5D" />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#461c58']} style={styles.header}>
        <Text style={styles.title}>İlanlarım</Text>
        <Text style={styles.subtitle}>{myListings.length} Aktif İlan</Text>
      </LinearGradient>

      <FlatList
        data={myListings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]}
            onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}><Feather name="image" size={24} color="#999" /></View>
            )}
            <View style={styles.info}>
              <Text style={[styles.listingTitle, { color: isDarkMode ? '#FFF' : '#000' }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.price, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>{item.price} TL</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#D1B8E0" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color={isDarkMode ? '#333' : '#D1B8E0'} />
            <Text style={[styles.emptyText, { color: isDarkMode ? '#888' : '#555' }]}>Henüz bir ilan eklemedin.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, paddingTop: 50, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#E5D0F0', marginTop: 4, fontWeight: '500' },
  list: { padding: 20 },
  card: { 
    flexDirection: 'row', 
    borderRadius: 0, 
    marginBottom: 12, 
    padding: 12, 
    borderWidth: 1, 
    alignItems: 'center' 
  },
  image: { width: 70, height: 70, borderRadius: 0 },
  imagePlaceholder: { width: 70, height: 70, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 15 },
  listingTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 15, fontWeight: '600' }
});