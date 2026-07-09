import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Firebase Bağlantıları
import { db } from '../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Clothing', 'Notes', 'Other'];

export default function MarketHome({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Firebase'den gelecek gerçek ilanlar listesi
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FİREBASE GERÇEK ZAMANLI İLAN OKUMA
  useEffect(() => {
    // Firestore'daki 'listings' koleksiyonuna bağlanıyoruz
    const q = query(collection(db, 'listings'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedListings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // En yeni eklenen ilanı en üstte göstermek için sıralama
      fetchedListings.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setListings(fetchedListings);
      setIsLoading(false);
    }, (error) => {
      console.log("Market Veri Çekme Hatası: ", error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // İLAN FİLTRELEME MANTIĞI
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const titleSafe = item.title || '';
      const matchSearch = titleSafe.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, listings]);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Market</Text>
        {/* Yeni İlan Ekleme Butonu (Şimdilik işlevini sonra bağlayacağız) */}
        {/* Yeni İlan Ekleme Butonu */}
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateListing')}>
          <Feather name="plus" size={16} color="#FFF" />
          <Text style={styles.createButtonText}>Sell</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search text books, electronics..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* KATEGORİ SEÇİM ŞERİDİ */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* İLANLAR GRİD LİSTESİ */}
      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : filteredListings.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContent}>
          <View style={styles.gridRow}>
            {filteredListings.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>{item.price} TL</Text>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.productCategory}>{item.category}</Text>
                  
                  <View style={styles.productFooter}>
                    <Feather name="user" size={12} color="#9CA3AF" />
                    <Text style={styles.ownerText} numberOfLines={1}>
                      {item.creatorEmail?.split('@')[0] || 'Student'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* BOŞ DURUM */
        <View style={styles.emptyStateContainer}>
          <Feather name="shopping-bag" size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No items found</Text>
          <Text style={styles.emptyStateDesc}>Be the first one to sell something!</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#111827' },
  createButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  createButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, height: 46, marginBottom: 16 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  categoriesContainer: { marginBottom: 16 },
  categoryPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', marginRight: 8 },
  categoryPillActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  categoryText: { color: '#4B5563', fontWeight: '500', fontSize: 14 },
  categoryTextActive: { color: '#FFF', fontWeight: '600' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gridContent: { paddingHorizontal: 14, paddingBottom: 40 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { backgroundColor: '#FFF', width: '48%', borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  productImage: { width: '100%', height: 130, backgroundColor: '#F3F4F6' },
  priceBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  priceText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  productInfo: { padding: 12 },
  productTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  productCategory: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 8 },
  productFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
  ownerText: { fontSize: 11, color: '#6B7280', flex: 1 },
  emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyStateTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 12, marginBottom: 4 },
  emptyStateDesc: { fontSize: 14, color: '#6B7280' },
});