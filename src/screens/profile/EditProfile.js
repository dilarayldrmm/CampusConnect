import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

export default function EditProfile({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, updateUserData } = useContext(AuthContext); // updateUserData'yı çektik
  
  const [name, setName] = useState(user?.displayName || user?.email?.split('@')[0] || '');
  const [image, setImage] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Hata", "İsim alanı boş bırakılamaz.");
      return;
    }
    
    setLoading(true);
    try {
      // AuthContext içindeki güncellenmiş fonksiyonu kullanıyoruz
      await updateUserData(name, image);
      Alert.alert("Başarılı", "Profil bilgilerin güncellendi.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Hata", "Profil güncellenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        <Image 
          source={{ uri: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }} 
          style={styles.avatar} 
        />
        <View style={styles.cameraIcon}><Feather name="camera" size={20} color="#FFF" /></View>
      </TouchableOpacity>

      <TextInput 
        style={[styles.input, { 
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', 
          color: isDarkMode ? '#FFF' : '#000',
          borderColor: isDarkMode ? '#333' : '#D1B8E0'
        }]} 
        value={name} 
        onChangeText={setName} 
        placeholder="Adın" 
        placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Kaydet</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  avatarContainer: { alignSelf: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#4A1D5D' },
  cameraIcon: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#4A1D5D', padding: 8, borderRadius: 20 },
  input: { padding: 15, borderWidth: 1, marginBottom: 20, borderRadius: 10, fontSize: 16 },
  saveBtn: { backgroundColor: '#4A1D5D', padding: 15, alignItems: 'center', borderRadius: 10 },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});