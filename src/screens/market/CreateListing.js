import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // ThemeContext eklendi

const CATEGORIES = ['Books', 'Electronics', 'Clothing', 'Notes', 'Other'];

export default function CreateListing({ navigation }) {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // Temayı çek
  
  const IMGBB_API_KEY = '564d056021da4d2f75e45d1ed22a508a';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [activeCategory, setActiveCategory] = useState('Books');
  const [imageUri, setImageUri] = useState(null); 
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  const handleCreateListing = async () => {
    if (!title.trim() || !description.trim() || !price.trim() || !imageBase64) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun ve fotoğraf seçin.');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageBase64);
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
      const imgbbData = await imgbbResponse.json();
      
      await addDoc(collection(db, 'listings'), {
        title, description, category: activeCategory, price: Number(price),
        image: imgbbData.data.url, creatorId: user.uid, creatorEmail: user.email, createdAt: serverTimestamp(), 
      });

      setIsLoading(false);
      Alert.alert("Başarılı!", "İlanın markete eklendi.", [{ text: "Tamam", onPress: () => navigation.goBack() }]);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Hata', 'İlan oluşturulamadı.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="x" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni İlan</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={[styles.imagePicker, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F0E6F5', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} onPress={pickImage}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.selectedImage} /> : (
            <View style={styles.placeholder}><Feather name="camera" size={32} color={isDarkMode ? '#AAA' : '#9A73B5'} /><Text style={[styles.placeholderText, { color: isDarkMode ? '#AAA' : '#4A1D5D' }]}>Fotoğraf Ekle</Text></View>
          )}
        </TouchableOpacity>

        <View style={styles.group}>
          <Text style={[styles.label, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>İlan Başlığı</Text>
          <TextInput style={[styles.input, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} placeholder="Örn: MacBook Air M1" placeholderTextColor={isDarkMode ? '#888' : '#AAA'} value={title} onChangeText={setTitle} />
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
          <TextInput style={[styles.input, { height: 100, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]} multiline value={description} placeholderTextColor={isDarkMode ? '#888' : '#AAA'} onChangeText={setDescription} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleCreateListing} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>İlanı Yayınla</Text>}
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
  imagePicker: { height: 200, borderRadius: 0, borderWidth: 1, marginBottom: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  selectedImage: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { marginTop: 10, fontWeight: '600' },
  group: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { borderRadius: 0, borderWidth: 1, padding: 12, fontSize: 15 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { padding: 10, borderRadius: 0, borderWidth: 1 },
  pillActive: { backgroundColor: '#4A1D5D', borderColor: '#4A1D5D' },
  pillText: { fontSize: 13 },
  pillTextActive: { color: '#FFF' },
  submitBtn: { backgroundColor: '#4A1D5D', padding: 16, borderRadius: 0, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});