import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et

const CATEGORIES = ['All', 'Concert', 'Seminar', 'Sports', 'Social', 'Academic'];

export default function Discover({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetched.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setEventsList(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsList.filter(event => {
      const matchCat = activeCategory === 'All' || event.category === activeCategory;
      const matchSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, eventsList]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <Text style={styles.headerTitle}>Etkinlikler</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateEvent')}>
          <Feather name="plus" size={14} color="#FFF" />
          <Text style={styles.createBtnText}>Yeni</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]}>
        <Feather name="search" size={18} color="#9A73B5" style={{ marginLeft: 10 }} />
        <TextInput 
          style={[styles.searchInput, { color: isDarkMode ? '#FFF' : '#000' }]} 
          placeholder="Ara..." 
          placeholderTextColor="#9A73B5" 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Kategori</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.pill, activeCategory === cat && styles.pillActive, { backgroundColor: activeCategory === cat ? '#4A1D5D' : (isDarkMode ? '#1E1E1E' : '#FFF') }]} 
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={activeCategory === cat ? styles.pillTextActive : [styles.pillText, { color: isDarkMode ? '#DDD' : '#4A1D5D' }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          {isLoading ? (
            <ActivityIndicator color="#4A1D5D" />
          ) : filteredEvents.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={[styles.listItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0E6F5' }]} 
              onPress={() => navigation.navigate('EventDetail', { id: event.id })}
            >
              <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#F0E6F5' }]}><Feather name="calendar" size={20} color={isDarkMode ? '#D1B8E0' : '#4A1D5D'} /></View>
              <View style={styles.listInfo}>
                <Text style={[styles.listTitle, { color: isDarkMode ? '#FFF' : '#000' }]} numberOfLines={1}>{event.title}</Text>
                <Text style={styles.listDate}>{event.date} • {event.category}</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#D1B8E0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  createButton: { flexDirection: 'row', backgroundColor: '#4A1D5D', padding: 10, borderWidth: 1, borderColor: '#FFF' },
  createBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 5, fontSize: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 20, borderWidth: 1, height: 45 },
  searchInput: { flex: 1, padding: 10 },
  filterSection: { paddingHorizontal: 20, marginBottom: 15 },
  filterLabel: { fontSize: 12, fontWeight: '800', marginBottom: 5 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#D1B8E0', marginRight: 10 },
  pillActive: { backgroundColor: '#4A1D5D', borderColor: '#4A1D5D' },
  pillText: { fontSize: 13 },
  pillTextActive: { color: '#FFF', fontSize: 13 },
  section: { paddingHorizontal: 20 },
  listItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 15, marginBottom: 10 },
  iconBox: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  listInfo: { flex: 1 },
  listTitle: { fontWeight: '700', fontSize: 15, marginBottom: 4 },
  listDate: { color: '#666', fontSize: 12 },
  scroll: { paddingBottom: 100 }
});