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
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Tasarımı doldurmak için geçici veriler (Dummy Data)
const JOINED_COMMUNITIES = [
  { id: '1', name: 'Computer Science Club', members: '1.234', category: 'Academic', icon: '💻', bgColor: '#3B82F6' },
  { id: '2', name: 'Photography Society', members: '567', category: 'Art', icon: '📸', bgColor: '#8B5CF6' },
  { id: '3', name: 'Basketball Team', members: '89', category: 'Sports', icon: '🏀', bgColor: '#F97316' },
];

const EXPLORE_COMMUNITIES = [
  { id: '4', name: 'Debate Club', members: '345', category: 'Academic', icon: '🎤', bgColor: '#EF4444' },
  { id: '5', name: 'Anime & Manga', members: '892', category: 'Art', icon: '🃏', bgColor: '#EC4899' },
  { id: '6', name: 'Entrepreneurship Hub', members: '456', category: 'Business', icon: '💼', bgColor: '#10B981' },
  { id: '7', name: 'Yoga & Wellness', members: '234', category: 'Sports', icon: '🧘‍♀️', bgColor: '#F59E0B' },
  { id: '8', name: 'Gaming League', members: '1.567', category: 'Social', icon: '🎮', bgColor: '#6366F1' },
  { id: '9', name: 'Environmental Action', members: '678', category: 'Social', icon: '🌍', bgColor: '#22C55E' },
];

const CATEGORIES = ['All', 'Academic', 'Sports', 'Art', 'Business'];

export default function CommunityList() {
  const [activeTab, setActiveTab] = useState('Joined'); // 'Joined' veya 'Explore'
  const [activeCategory, setActiveCategory] = useState('All');

  // Liste elemanını render eden fonksiyon
  const renderCommunityItem = ({ item }) => (
    <View style={styles.communityCard}>
      <View style={styles.cardLeft}>
        {/* İkon Kutusu */}
        <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
        {/* Metinler */}
        <View style={styles.textContainer}>
          <Text style={styles.communityName}>{item.name}</Text>
          <Text style={styles.memberCount}>{item.members} members</Text>
        </View>
      </View>
      
      {/* Sağ Taraf: 'Joined' sekmesinde kategori, 'Explore' sekmesinde Join butonu */}
      {activeTab === 'Joined' ? (
        <Text style={styles.categoryTextRight}>{item.category}</Text>
      ) : (
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* BAŞLIK */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communities</Text>
      </View>

      {/* ARAMA ÇUBUĞU */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* ÜST SEKMELER (Joined / Explore) */}
      <View style={styles.topTabsContainer}>
        <TouchableOpacity 
          style={[styles.topTab, activeTab === 'Joined' && styles.topTabActive]}
          onPress={() => setActiveTab('Joined')}
        >
          <Text style={[styles.topTabText, activeTab === 'Joined' && styles.topTabTextActive]}>Joined</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.topTab, activeTab === 'Explore' && styles.topTabActive]}
          onPress={() => setActiveTab('Explore')}
        >
          <Text style={[styles.topTabText, activeTab === 'Explore' && styles.topTabTextActive]}>Explore</Text>
        </TouchableOpacity>
      </View>

      {/* KATEGORİ FİLTRELERİ (Sadece Explore sekmesinde görünür) */}
      {activeTab === 'Explore' && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
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
        </View>
      )}

      {/* LİSTE */}
      <FlatList
        data={activeTab === 'Joined' ? JOINED_COMMUNITIES : EXPLORE_COMMUNITIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  topTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  topTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  topTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5', // Aktif sekme mor alt çizgi
  },
  topTabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  topTabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  categoryPillActive: {
    backgroundColor: '#4F46E5',
  },
  categoryText: {
    color: '#4B5563',
    fontWeight: '500',
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryTextRight: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  joinButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  joinButtonText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 13,
  },
});