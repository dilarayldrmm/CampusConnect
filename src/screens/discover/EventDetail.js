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

// Şimdilik sayfayı dolduracak sahte (Dummy) veriler
const EVENT_MOCK = {
  title: 'Spring Music Festival',
  category: 'Social',
  date: '15 June 2026, 18:00',
  location: 'Campus Main Square',
  description: 'Join us for the biggest music event of the year! We will have live bands, food trucks, and a great atmosphere to celebrate the end of the semester. Do not forget to bring your student ID.',
  capacity: 500,
  attendeesCount: 234,
  image: 'https://images.unsplash.com/photo-1540039155732-d674d40d4e3f?q=80&w=800&auto=format&fit=crop',
  organizer: {
    name: 'Music Society',
    avatar: 'https://images.unsplash.com/photo-1516280440502-6c56db322c37?q=80&w=200&auto=format&fit=crop'
  },
  attendees: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
  ]
};

export default function EventDetail({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HERO GÖRSELİ */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: EVENT_MOCK.image }} style={styles.heroImage} />
          {/* Geri Butonu */}
          <SafeAreaView style={styles.backButtonSafeArea}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* İÇERİK ALANI */}
        <View style={styles.contentContainer}>
          
          {/* Kategori ve Başlık */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{EVENT_MOCK.category}</Text>
          </View>
          <Text style={styles.title}>{EVENT_MOCK.title}</Text>

          {/* Tarih ve Konum */}
          <View style={styles.metaRow}>
            <View style={styles.metaIcon}>
              <Feather name="calendar" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.metaTitle}>Date & Time</Text>
              <Text style={styles.metaSubtitle}>{EVENT_MOCK.date}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaIcon}>
              <Feather name="map-pin" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.metaTitle}>Location</Text>
              <Text style={styles.metaSubtitle}>{EVENT_MOCK.location}</Text>
            </View>
          </View>

          {/* Organizatör */}
          <View style={styles.organizerRow}>
            <Image source={{ uri: EVENT_MOCK.organizer.avatar }} style={styles.organizerAvatar} />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerName}>{EVENT_MOCK.organizer.name}</Text>
              <Text style={styles.organizerRole}>Organizer</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Hakkında */}
          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>{EVENT_MOCK.description}</Text>

          {/* Katılımcılar (Yüzler üst üste binmiş efekt) */}
          <Text style={styles.sectionTitle}>Attendees ({EVENT_MOCK.attendeesCount})</Text>
          <View style={styles.attendeesContainer}>
            {EVENT_MOCK.attendees.map((avatar, index) => (
              <Image 
                key={index} 
                source={{ uri: avatar }} 
                style={[styles.attendeeAvatar, { left: -(index * 12) }]} 
              />
            ))}
            <View style={[styles.attendeeMoreCount, { left: -(EVENT_MOCK.attendees.length * 12) }]}>
              <Text style={styles.attendeeMoreText}>+230</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* SABİT ALT BAR (Join Button) */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>Free</Text>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Event</Text>
          <Feather name="arrow-right" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 100, // Alt barın altından içerik kayabilsin diye
  },
  heroContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButtonSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, // Resmi hafifçe örtmek için
    padding: 24,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  metaSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginVertical: 24,
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  organizerRole: {
    fontSize: 13,
    color: '#6B7280',
  },
  followButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  followButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 32,
  },
  attendeesContainer: {
    flexDirection: 'row',
    paddingLeft: 12, // Resimlerin sola kaymasını dengelemek için
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  attendeeMoreCount: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeeMoreText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: 32, // iOS safe area için ekstra boşluk
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});