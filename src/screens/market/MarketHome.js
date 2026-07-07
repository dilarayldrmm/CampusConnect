import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; 

const CATEGORIES = ['All', 'Books', 'Electronics', 'Clothing', 'Furniture', 'Other'];
const PRICE_RANGES = ['All', '$0-25', '$26-50', '$50-100', '$100+'];

const DUMMY_LISTINGS = [
  {
    id: '1',
    title: 'Calculus Textbook',
    price: '$35',
    condition: 'Like New',
    seller: 'Sarah J.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'MacBook Pro 2020',
    price: '$850',
    condition: 'Good',
    seller: 'Mike C.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Winter Jacket',
    price: '$45',
    condition: 'Like New',
    seller: 'Emma W.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Study Desk',
    price: '$60',
    condition: 'Good',
    seller: 'Alex K.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'iPhone 13',
    price: '$520',
    condition: 'Like New',
    seller: 'David B.',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Milk and Honey',
    price: '$15',
    condition: 'Good',
    seller: 'Lisa P.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
  },
];

export default function MarketHome({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrice, setActivePrice] = useState('All');

  const renderListingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.conditionBadge, item.condition === 'Like New' ? styles.badgeLikeNew : styles.badgeGood]}>
          <Text style={styles.conditionText}>{item.condition}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        
        <View style={styles.sellerContainer}>
          <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
          <Text style={styles.sellerText}>{item.seller}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity style={styles.sellButton}>
          <Feather name="plus" size={16} color="#FFF" />
          <Text style={styles.sellButtonText}>Sell</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingRight: 20 }}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryPill,
                activeCategory === cat && styles.categoryPillActive
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priceScroll} contentContainerStyle={{ paddingRight: 20 }}>
          {PRICE_RANGES.map((price, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pricePill,
                activePrice === price && styles.pricePillActive
              ]}
              onPress={() => setActivePrice(price)}
            >
              <Text style={[
                styles.priceText,
                activePrice === price && styles.priceTextActive
              ]}>{price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={DUMMY_LISTINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderListingItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 10, marginBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827' },
  sellButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5',
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
  },
  sellButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, height: 46, marginBottom: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  filtersWrapper: { marginBottom: 16 },
  filterScroll: { paddingLeft: 20, marginBottom: 12 },
  categoryPill: {
    paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20,
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8,
  },
  categoryPillActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  categoryText: { color: '#4B5563', fontWeight: '500', fontSize: 13 },
  categoryTextActive: { color: '#FFF' },
  priceScroll: { paddingLeft: 20 },
  pricePill: { paddingVertical: 6, paddingHorizontal: 14, marginRight: 8 },
  pricePillActive: { borderBottomWidth: 2, borderBottomColor: '#111827' },
  priceText: { color: '#6B7280', fontWeight: '500', fontSize: 13 },
  priceTextActive: { color: '#111827', fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  cardContainer: {
    width: cardWidth, backgroundColor: '#FFF', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, overflow: 'hidden',
  },
  imageContainer: { width: '100%', height: 120, backgroundColor: '#F3F4F6' },
  cardImage: { width: '100%', height: '100%' },
  conditionBadge: { position: 'absolute', top: 8, right: 8, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  badgeLikeNew: { backgroundColor: 'rgba(16, 185, 129, 0.9)' },
  badgeGood: { backgroundColor: 'rgba(245, 158, 11, 0.9)' },
  conditionText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  cardContent: { padding: 12 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#4F46E5', marginBottom: 8 },
  sellerContainer: { flexDirection: 'row', alignItems: 'center' },
  sellerText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
});