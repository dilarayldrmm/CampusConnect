import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CommunityList({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'communities'), (snapshot) => {
      setCommunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <View style={[styles.center, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}><ActivityIndicator size="large" color="#4A1D5D" /></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <Text style={styles.headerTitle}>Topluluklar</Text>
      </LinearGradient>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0E6F5' }]}
            onPress={() => navigation.navigate('CommunityDetail', { communityId: item.id, name: item.name })}
          >
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#F0E6F5' }]}><Feather name="users" size={20} color="#4A1D5D" /></View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.name}</Text>
              <Text style={[styles.desc, { color: isDarkMode ? '#AAA' : '#666' }]}>{item.memberCount || 0} Üye</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#D1B8E0" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 0, 
    marginBottom: 12, 
    borderWidth: 1 
  },
  iconBox: { width: 50, height: 50, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  name: { fontSize: 15, fontWeight: '700' },
  desc: { fontSize: 13, marginTop: 2 },
  info: { flex: 1 }
});