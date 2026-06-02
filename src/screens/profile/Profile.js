import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Tasarıma uygun profil verileri
const USER_PROFILE = {
  name: 'Elazığ Student',
  department: 'Software Engineering - Year 3',
  followers: '24',
  following: '18',
  events: '12',
  bio: 'CS student passionate about AI and mobile development. Love attending campus events and meeting new people!',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
};

const PROFILE_TABS = ['Created Events', 'Joined Events', 'My Listings'];

const CREATED_EVENTS = [
  {
    id: '1',
    title: 'Spring Music Festival',
    attendees: '234',
    date: 'Jun 15',
    icon: 'musical-notes'
  },
  {
    id: '2',
    title: 'AI Workshop',
    attendees: '87',
    date: 'Jun 10',
    icon: 'hardware-chip'
  }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Created Events');

  return (
    <View style={styles.container}>
      {/* Üst Kısım Arka Plan Gradienti */}
      <LinearGradient
        colors={['#E0DBF0', '#F9FAFB']}
        style={styles.headerBackground}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* SAĞ ÜST İKONLAR (Bildirim & Ayarlar) */}
          <View style={styles.topRightIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="bell" size={20} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="settings" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* PROFİL BİLGİLERİ (Avatar, İsim, Bölüm) */}
          <View style={styles.profileInfoSection}>
            <Image source={{ uri: USER_PROFILE.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{USER_PROFILE.name}</Text>
            <Text style={styles.userDepartment}>{USER_PROFILE.department}</Text>
          </View>

          {/* İSTATİSTİK KARTLARI */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{USER_PROFILE.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{USER_PROFILE.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{USER_PROFILE.events}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>

          {/* BİYOGRAFİ (Bio) */}
          <View style={styles.bioSection}>
            <Text style={styles.bioTitle}>Bio</Text>
            <Text style={styles.bioText}>{USER_PROFILE.bio}</Text>
          </View>

          {/* ALT SEKMELER (Created / Joined / Listings) */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PROFILE_TABS.map((tab, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ETKİNLİK LİSTESİ */}
          <View style={styles.listContainer}>
            {CREATED_EVENTS.map(event => (
              <TouchableOpacity key={event.id} style={styles.eventItem}>
                <View style={styles.eventIconBox}>
                  <Ionicons name={event.icon} size={24} color="#4F46E5" />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventMeta}>
                    <Text style={styles.eventMetaText}>{event.attendees} attendees</Text>
                    <View style={styles.dot} />
                    <Text style={styles.eventMetaText}>{event.date}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250, // Üstteki mor geçişin boyutu
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topRightIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  userDepartment: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4F46E5', // Mor rakamlar
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bioSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#111827',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  eventIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF', // Çok açık mor arka plan
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
});