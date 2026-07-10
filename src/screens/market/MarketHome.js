import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et

const CATEGORIES = ['All', 'Books', 'Electronics', 'Clothing', 'Notes', 'Other'];

export default function MarketHome({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'listings'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetched.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setListings(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, listings]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <Text style={styles.headerTitle}>Campus Market</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateListing')}>
          <Feather name="plus" size={14} color="#FFF" />
          <Text style={styles.createButtonText}>İlan Ekle</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]}>
        <Feather name="search" size={16} color="#9A73B5" style={{ marginLeft: 10 }} />
        <TextInput
          style={[styles.searchInput, { color: isDarkMode ? '#FFF' : '#000' }]}
          placeholder="Ara..."
          placeholderTextColor="#9A73B5"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{paddingHorizontal: 20}}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.pill, activeCategory === cat && styles.pillActive, { backgroundColor: activeCategory === cat ? '#4A1D5D' : (isDarkMode ? '#1E1E1E' : '#FFF'), borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} 
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={activeCategory === cat ? styles.pillTextActive : [styles.pillText, { color: isDarkMode ? '#DDD' : '#4A1D5D' }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color="#4A1D5D" />
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0E6F5' }]} 
              onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.img} />
              <View style={styles.info}>
                <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.price, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>{item.price} TL</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  createButton: { flexDirection: 'row', backgroundColor: '#4A1D5D', paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#FFF' },
  createButtonText: { color: '#FFF', fontWeight: '800', marginLeft: 5, fontSize: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 20, marginBottom: 10, borderWidth: 1, height: 40 },
  searchInput: { flex: 1, padding: 8, fontSize: 13 },
  catScroll: { flexGrow: 0, marginBottom: 15 },
  pill: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, marginRight: 8 },
  pillActive: { backgroundColor: '#4A1D5D', borderColor: '#4A1D5D' },
  pillText: { fontSize: 12 },
  pillTextActive: { color: '#FFF', fontSize: 12 },
  card: { width: '47%', borderWidth: 1, marginBottom: 15 },
  img: { width: '100%', height: 110 },
  info: { padding: 8 },
  title: { fontWeight: '700', fontSize: 12 },
  price: { fontWeight: '800', marginTop: 3, fontSize: 12 }
});