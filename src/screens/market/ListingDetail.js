import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Şimdilik sayfayı dolduracak sahte (Dummy) ürün verisi
const LISTING_MOCK = {
  id: '1',
  title: 'Calculus Textbook - 8th Edition',
  price: '$35',
  condition: 'Like New',
  category: 'Books',
  description: 'Used for only one semester. Pages are completely clean, no highlights or notes inside. Perfect condition. Meet up at the campus library is preferred.',
  postedAt: '2 days ago',
  images: [
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
  ],
  seller: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 4.8,
    joined: 'Joined 2024'
  }
};

export default function ListingDetail({ navigation, route }) {
  // Gelen bir id varsa kullanılabilir, şimdilik MOCK datayı kullanıyoruz
  const itemId = route?.params?.id;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ÜRÜN GÖRSELİ */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: LISTING_MOCK.images[0] }} style={styles.productImage} />
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="heart" size={24} color="#111827" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* İÇERİK ALANI */}
        <View style={styles.contentContainer}>
          
          <View style={styles.titleRow}>
            <Text style={styles.title}>{LISTING_MOCK.title}</Text>
            <Text style={styles.price}>{LISTING_MOCK.price}</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{LISTING_MOCK.condition}</Text>
            </View>
            <Text style={styles.timeText}>Posted {LISTING_MOCK.postedAt}</Text>
          </View>

          {/* SATICI PROFİLİ */}
          <TouchableOpacity style={styles.sellerCard} activeOpacity={0.8}>
            <Image source={{ uri: LISTING_MOCK.seller.avatar }} style={styles.sellerAvatar} />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{LISTING_MOCK.seller.name}</Text>
              <View style={styles.sellerMeta}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{LISTING_MOCK.seller.rating}</Text>
                <View style={styles.dot} />
                <Text style={styles.joinedText}>{LISTING_MOCK.seller.joined}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* AÇIKLAMA */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{LISTING_MOCK.description}</Text>

          {/* DETAYLAR */}
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{LISTING_MOCK.category}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Condition</Text>
              <Text style={styles.detailValue}>{LISTING_MOCK.condition}</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ALT BAR - MESAJ GÖNDER */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => navigation.navigate('ChatDetail', { name: LISTING_MOCK.seller.name })}
        >
          <Feather name="message-circle" size={20} color="#FFF" />
          <Text style={styles.messageButtonText}>Message Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingBottom: 100 },
  imageContainer: { width: '100%', height: 350, position: 'relative', backgroundColor: '#F3F4F6' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerButtons: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  contentContainer: { padding: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', flex: 1, marginRight: 16 },
  price: { fontSize: 24, fontWeight: '800', color: '#4F46E5' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  conditionBadge: { backgroundColor: '#ECFDF5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 12 },
  conditionText: { color: '#10B981', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  timeText: { fontSize: 13, color: '#6B7280' },
  sellerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6'
  },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  sellerMeta: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#111827', marginLeft: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', marginHorizontal: 8 },
  joinedText: { fontSize: 13, color: '#6B7280' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 24 },
  detailsBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#111827' },
  detailDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 32,
  },
  messageButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#4F46E5', paddingVertical: 16, borderRadius: 16, gap: 8,
  },
  messageButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});