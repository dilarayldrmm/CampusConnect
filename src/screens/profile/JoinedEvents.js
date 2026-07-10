import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function JoinedEvents({ navigation }) {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'events'), where('attendeesList', 'array-contains', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJoinedEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (loading) return <ActivityIndicator style={{flex:1, backgroundColor: isDarkMode ? '#121212' : '#FDFDFD'}} color="#4A1D5D" />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <Text style={styles.title}>Ajandam</Text>
        <Text style={styles.subtitle}>{joinedEvents.length} Etkinliğe katılıyorsun</Text>
      </LinearGradient>

      <FlatList
        data={joinedEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]}
            onPress={() => navigation.navigate('EventDetail', { id: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={[styles.eventTitle, { color: isDarkMode ? '#FFF' : '#000' }]} numberOfLines={1}>{item.title}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color={isDarkMode ? '#AAA' : '#666'} />
                <Text style={[styles.metaText, { color: isDarkMode ? '#AAA' : '#555' }]}>{item.date}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={isDarkMode ? '#AAA' : '#666'} />
                <Text style={[styles.metaText, { color: isDarkMode ? '#AAA' : '#555' }]} numberOfLines={1}>{item.location}</Text>
              </View>
            </View>
            <Feather name="arrow-right" size={20} color="#D1B8E0" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-sharp" size={64} color={isDarkMode ? '#333' : '#D1B8E0'} />
            <Text style={[styles.emptyText, { color: isDarkMode ? '#888' : '#555' }]}>Henüz bir etkinliğe katılmadın.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, paddingTop: 40, marginBottom: 10 },
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
  info: { flex: 1, marginLeft: 15 },
  eventTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  metaText: { fontSize: 13, marginLeft: 6 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, fontSize: 15, fontWeight: '600' }
});