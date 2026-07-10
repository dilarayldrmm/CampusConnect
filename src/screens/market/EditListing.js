import React, { useState, useEffect, useContext } from 'react'; // useContext eklendi
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et

const CATEGORIES = ['Books', 'Electronics', 'Clothing', 'Notes', 'Other'];

export default function EditListing({ route, navigation }) {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [activeCategory, setActiveCategory] = useState('Books');
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getListing = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'listings', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price.toString());
          setActiveCategory(data.category);
          setImageUri(data.image);
        }
      } catch (error) {
        Alert.alert("Hata", "Veri yüklenemedi.");
      }
    };
    getListing();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'listings', id), {
        title,
        description,
        price: Number(price),
        category: activeCategory
      });
      Alert.alert("Başarılı", "İlan güncellendi.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Hata", "Güncelleme yapılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>İlanı Düzenle</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: imageUri }} style={styles.img} />
        
        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>İlan Başlığı</Text>
          <TextInput style={[styles.input, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} placeholderTextColor={isDarkMode ? '#888' : '#AAA'} value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Fiyat (TL)</Text>
          <TextInput style={[styles.input, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} keyboardType="numeric" placeholderTextColor={isDarkMode ? '#888' : '#AAA'} value={price} onChangeText={setPrice} />
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
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>Açıklama</Text>
          <TextInput style={[styles.input, { height: 100, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} multiline placeholderTextColor={isDarkMode ? '#888' : '#AAA'} value={description} onChangeText={setDescription} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Güncelle</Text>}
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
  input: { borderWidth: 1, padding: 12, fontSize: 15 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { padding: 10, borderWidth: 1 },
  pillActive: { backgroundColor: '#4A1D5D', borderColor: '#4A1D5D' },
  pillText: { fontSize: 13 },
  pillTextActive: { color: '#FFF' },
  submitBtn: { backgroundColor: '#4A1D5D', padding: 16, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  img: { width: '100%', height: 200, marginBottom: 20 }
});