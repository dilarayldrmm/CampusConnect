import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et

const CATEGORIES = ['Concert', 'Seminar', 'Sports', 'Social', 'Academic'];

export default function CreateEvent({ navigation }) {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState('Social');
  const [capacity, setCapacity] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateEvent = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen başlık ve açıklama girin.');
      return;
    }
    setIsLoading(true);
    try {
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      await addDoc(collection(db, 'events'), {
        title, description, category: activeCategory, capacity: Number(capacity),
        isOnline, location: isOnline ? 'Online' : 'Campus Main Hall',
        attendees: 1, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
        date: todayStr, creatorId: user.uid, creatorEmail: user.email, createdAt: serverTimestamp(),
      });
      setIsLoading(false);
      Alert.alert("Başarılı!", "Etkinlik oluşturuldu.", [{ text: "Tamam", onPress: () => navigation.goBack() }]);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Etkinlik</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Etkinlik Başlığı</Text>
          <TextInput style={[styles.input, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} placeholder="Örn: Müzik Festivali" placeholderTextColor={isDarkMode ? '#888' : '#AAA'} value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Açıklama</Text>
          <TextInput style={[styles.input, { height: 100, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} multiline value={description} onChangeText={setDescription} placeholderTextColor={isDarkMode ? '#888' : '#AAA'} />
        </View>

        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Kategori</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} style={[styles.pill, activeCategory === cat && styles.pillActive, { backgroundColor: activeCategory === cat ? '#4A1D5D' : (isDarkMode ? '#1E1E1E' : '#FFF'), borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} onPress={() => setActiveCategory(cat)}>
                <Text style={activeCategory === cat ? styles.pillTextActive : [styles.pillText, { color: isDarkMode ? '#DDD' : '#4A1D5D' }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Kapasite</Text>
          <TextInput style={[styles.input, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} keyboardType="number-pad" value={capacity} onChangeText={setCapacity} placeholderTextColor={isDarkMode ? '#888' : '#AAA'} />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.label, { marginBottom: 0, color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Online Etkinlik mi?</Text>
          <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ true: '#4A1D5D' }} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCreateEvent} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Etkinliği Oluştur</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  content: { padding: 20 },
  group: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 0, padding: 12, fontSize: 15 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { padding: 10, borderRadius: 0, borderWidth: 1 },
  pillActive: { backgroundColor: '#4A1D5D', borderColor: '#4A1D5D' },
  pillText: { fontSize: 13 },
  pillTextActive: { color: '#FFF' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  submitBtn: { backgroundColor: '#4A1D5D', padding: 16, borderRadius: 0, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});