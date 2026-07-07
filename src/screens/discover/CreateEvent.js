import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Firebase ve Context bağlantıları
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

const CATEGORIES = ['Concert', 'Seminar', 'Sports', 'Social', 'Academic'];

export default function CreateEvent({ navigation }) {
  // Aktif kullanıcıyı al (Etkinliği kimin oluşturduğunu kaydetmek için)
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState('Social');
  const [capacity, setCapacity] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // FİREBASE'E ETKİNLİK KAYDETME FONKSİYONU
  const handleCreateEvent = async () => {
    // 1. Boş alan kontrolü
    if (!title.trim() || !description.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen etkinlik başlığını ve açıklamasını doldurun.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Firebase Firestore 'events' (etkinlikler) koleksiyonuna yeni veri ekle
      await addDoc(collection(db, 'events'), {
        title: title,
        description: description,
        category: activeCategory,
        capacity: capacity ? Number(capacity) : 0,
        isOnline: isOnline,
        location: isOnline ? 'Online' : 'Campus Main Hall',
        attendees: 1, // Oluşturan kişi ilk katılımcı
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
        
        // Kritik Bilgiler
        creatorId: user.uid, // Etkinliği oluşturanın gizli ID'si
        creatorEmail: user.email, 
        createdAt: serverTimestamp(), // Firebase sunucu saati
      });

      setIsLoading(false);

      // 3. Başarı mesajı ve Modalı kapatma
      Alert.alert(
        "Harika!",
        "Etkinliğin başarıyla veritabanına kaydedildi!",
        [
          { text: "Tamam", onPress: () => navigation.goBack() }
        ]
      );

    } catch (error) {
      setIsLoading(false);
      Alert.alert('Hata Oluştu', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Feather name="x" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Event</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepText}>Step 1 of 1</Text>
            <Text style={styles.percentText}>100%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Spring Music Festival"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your event..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
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
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Max Capacity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 100"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={capacity}
            onChangeText={setCapacity}
          />
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>This is an online event</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
            thumbColor={'#FFF'}
          />
        </View>

        {/* Buton yükleme durumuna göre değişiyor */}
        <TouchableOpacity style={styles.nextButton} onPress={handleCreateEvent} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.nextButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  closeButton: { padding: 4 },
  content: { padding: 20, paddingBottom: 40 },
  progressSection: { marginBottom: 32 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  percentText: { fontSize: 14, color: '#4F46E5', fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: '#EEF2FF', borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  formGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#111827', backgroundColor: '#F9FAFB' },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
  categoryPillActive: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  categoryText: { color: '#4B5563', fontWeight: '500', fontSize: 14 },
  categoryTextActive: { color: '#4F46E5', fontWeight: '600' },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingVertical: 8 },
  switchLabel: { fontSize: 15, fontWeight: '500', color: '#111827' },
  nextButton: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});