import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // 1. ThemeContext import edildi
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CommunityDetail({ route, navigation }) {
  const { communityId, name } = route.params;
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const postsRef = collection(db, 'communities', communityId, 'posts');
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetched.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setPosts(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [communityId]);

  const handleSendPost = async () => {
    if (!inputText.trim()) return;
    try {
      await addDoc(collection(db, 'communities', communityId, 'posts'), {
        content: inputText,
        author: user.email || 'Anonim',
        createdAt: serverTimestamp(),
      });
      setInputText('');
    } catch (e) {
      Alert.alert("Hata", "Mesaj gönderilemedi.");
    }
  };

  if (loading) return <View style={[styles.center, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}><ActivityIndicator size="large" color="#4A1D5D" /></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.postCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0E6F5' }]}>
            <Text style={[styles.author, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>{item.author}</Text>
            <Text style={[styles.content, { color: isDarkMode ? '#FFF' : '#333' }]}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: isDarkMode ? '#888' : '#999' }]}>Henüz paylaşım yok.</Text>}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderTopColor: isDarkMode ? '#333' : '#F0E6F5' }]}>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? '#121212' : '#F9F9F9', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]}
            placeholder="Bir şeyler yaz..."
            placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendPost}>
            <Feather name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  postCard: { padding: 16, marginBottom: 12, borderWidth: 1 },
  author: { fontWeight: '800', marginBottom: 8, fontSize: 12 },
  content: { fontSize: 15 },
  empty: { textAlign: 'center', marginTop: 50 },
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1 },
  input: { flex: 1, padding: 12, borderRadius: 0, borderWidth: 1, marginRight: 10 },
  sendButton: { backgroundColor: '#4A1D5D', width: 50, justifyContent: 'center', alignItems: 'center' }
});