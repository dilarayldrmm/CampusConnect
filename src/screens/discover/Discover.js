import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Tasarımı doldurmak için geçici (Dummy) Veriler
const CATEGORIES = ['All', 'Concert', 'Seminar', 'Sports', 'Social', 'Academic'];
const DATE_FILTERS = ['All', 'Today', 'This Week', 'This Month'];

const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Spring Music Festival',
    date: 'Jun 15',
    attendees: 234,
    image: 'https://images.unsplash.com/photo-1540039155732-d674d40d4e3f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Tech Innovation Summit',
    date: 'Jun 18',
    attendees: 189,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
  }
];

const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Campus Basketball Finals',
    date: 'Jun 8, 2026',
    location: 'Sports Arena',
    attendees: 342,
    category: 'Sports',
    tags: ['Finals', 'Live'],
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'AI in Healthcare Seminar',
    date: 'Jun 10, 2026',
    location: 'Science Building',
    attendees: 120,
    category: 'Academic',
    tags: ['Tech', 'Future'],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9db514824?q=80&w=800&auto=format&fit=crop',
  }
];

export default function Discover({ navigation}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDate, setActiveDate] = useState('All');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER: Başlık ve Create Butonu */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
         <TouchableOpacity 
  style={styles.createButton} 
  onPress={() => navigation.navigate('CreateEvent')}
>
  <Feather name="plus" size={16} color="#FFF" />
  <Text style={styles.createButtonText}>Create</Text>
</TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* CATEGORY FILTERS */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
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

          {/* DATE FILTERS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
            {DATE_FILTERS.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.datePill,
                  activeDate === date && styles.datePillActive
                ]}
                onPress={() => setActiveDate(date)}
              >
                <Text style={[
                  styles.dateText,
                  activeDate === date && styles.dateTextActive
                ]}>{date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FEATURED EVENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FEATURED_EVENTS.map(event => (
              <TouchableOpacity 
  key={event.id} 
  activeOpacity={0.9}
  onPress={() => navigation.navigate('EventDetail', { id: event.id })}
>
                <ImageBackground
                  source={{ uri: event.image }}
                  style={styles.featuredCard}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredTitle}>{event.title}</Text>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredMetaText}>{event.date}</Text>
                      <View style={styles.attendeeContainer}>
                        <Ionicons name="people" size={14} color="#FFF" />
                        <Text style={styles.featuredMetaText}>{event.attendees}</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* UPCOMING EVENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {UPCOMING_EVENTS.map(event => (
            <TouchableOpacity 
  key={event.id} 
  style={styles.upcomingCard} 
  activeOpacity={0.9}
  onPress={() => navigation.navigate('EventDetail', { id: event.id })}
>
              <Image source={{ uri: event.image }} style={styles.upcomingImage} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{event.category}</Text>
              </View>
              
              <View style={styles.upcomingContent}>
                <Text style={styles.upcomingTitle}>{event.title}</Text>
                
                <View style={styles.upcomingMetaRow}>
                  <Feather name="calendar" size={14} color="#6B7280" />
                  <Text style={styles.upcomingMetaText}>{event.date}</Text>
                  <Feather name="map-pin" size={14} color="#6B7280" style={{marginLeft: 12}} />
                  <Text style={styles.upcomingMetaText}>{event.location}</Text>
                </View>

                <View style={styles.upcomingFooter}>
                  <View style={styles.tagsContainer}>
                    {event.tags.map((tag, i) => (
                      <Text key={i} style={styles.tagText}>{tag}</Text>
                    ))}
                  </View>
                  <View style={styles.attendeeContainerUpcoming}>
                    <Ionicons name="people-outline" size={16} color="#6B7280" />
                    <Text style={styles.attendeeTextUpcoming}>{event.attendees}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Tasarımdaki çok açık gri/beyaz arka plan
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5', // Tasarımdaki mor
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
    marginHorizontal: 4,
  },
  categoryPillActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryText: {
    color: '#4B5563',
    fontWeight: '500',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  dateRow: {
    paddingHorizontal: 16,
  },
  datePill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  datePillActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
  },
  dateText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 13,
  },
  dateTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  featuredCard: {
    width: 280,
    height: 160,
    marginLeft: 20,
    marginRight: 4, // Sonraki kart ile ara
    justifyContent: 'flex-end',
  },
  featuredOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)', // Yazıların okunması için koyulaştırma
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredMetaText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '500',
  },
  attendeeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upcomingCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  upcomingImage: {
    width: '100%',
    height: 140,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4F46E5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  upcomingContent: {
    padding: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  upcomingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingMetaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  upcomingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  attendeeContainerUpcoming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeeTextUpcoming: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});