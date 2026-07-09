import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Yalnızca Firestore bağlantısı kaldı (Storage'ı attık)
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

const CATEGORIES = ['Books', 'Electronics', 'Clothing', 'Notes', 'Other'];

export default function CreateListing({ navigation }) {
  const { user } = useContext(AuthContext);

  // Buraya ImgBB'den kopyaladığın API Key'i yapıştır:
  const IMGBB_API_KEY = '564d056021da4d2f75e45d1ed22a508a';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [activeCategory, setActiveCategory] = useState('Books');
  
  const [imageUri, setImageUri] = useState(null); 
  const [imageBase64, setImageBase64] = useState(null); // Resmi internete yollamak için şifrelenmiş hali
  const [isLoading, setIsLoading] = useState(false);

  // 1. GALERİDEN FOTOĞRAF SEÇ
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true, // ImgBB'nin resmi anlayabilmesi için Base64 formatında alıyoruz
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  // 2. IMGBB'YE YÜKLE VE FIRESTORE'A KAYDET
  const handleCreateListing = async () => {
    if (!title.trim() || !description.trim() || !price.trim() || !imageBase64) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun ve bir fotoğraf seçin.');
      return;
    }

    if (IMGBB_API_KEY === 'BURAYA_KENDI_API_KEYINI_YAPISTIR') {
      Alert.alert('Eksik API Key', 'Lütfen kodun içindeki IMGBB_API_KEY alanını doldurun.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Aşama: Fotoğrafı ImgBB'ye gönder
      const formData = new FormData();
      formData.append('image', imageBase64);

      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbData = await imgbbResponse.json();
      
      if (!imgbbData.success) {
        throw new Error("Fotoğraf yüklenemedi. API Key'i kontrol edin.");
      }

      const downloadURL = imgbbData.data.url; // ImgBB'nin bize verdiği o temiz URL!

      // 2. Aşama: İlanı Firebase'e kaydet (Artık elimizde gerçek bir URL var)
      await addDoc(collection(db, 'listings'), {
        title: title,
        description: description,
        category: activeCategory,
        price: Number(price),
        image: downloadURL, 
        creatorId: user.uid, 
        creatorEmail: user.email, 
        createdAt: serverTimestamp(), 
      });

      setIsLoading(false);
      Alert.alert("Başarılı!", "İlanınız fotoğraflı olarak markete eklendi.", [
        { text: "Tamam", onPress: () => navigation.goBack() }
      ]);

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
        <Text style={styles.headerTitle}>Sell an Item</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="camera" size={32} color="#9CA3AF" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput style={styles.input} placeholder="e.g., MacBook Air M1" placeholderTextColor="#9CA3AF" value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price (TL) *</Text>
          <TextInput style={styles.input} placeholder="e.g., 15000" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={price} onChangeText={setPrice} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity key={index} style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]} onPress={() => setActiveCategory(cat)}>
                <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the condition of your item..." placeholderTextColor="#9CA3AF" multiline numberOfLines={4} value={description} onChangeText={setDescription} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleCreateListing} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Post Listing</Text>}
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
  imagePickerContainer: { width: '100%', height: 200, backgroundColor: '#F3F4F6', borderRadius: 16, marginBottom: 24, overflow: 'hidden' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  selectedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  formGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#111827', backgroundColor: '#F9FAFB' },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
  categoryPillActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  categoryText: { color: '#4B5563', fontWeight: '500', fontSize: 14 },
  categoryTextActive: { color: '#10B981', fontWeight: '600' },
  submitButton: { backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});