import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Varsayılan mesajlarımızı artık dışarıda sabit değil, içeride başlangıç state'i olarak kullanacağız.
const INITIAL_MESSAGES = [
  { id: '1', text: 'Hey! Are you going to the Spring Music Festival?', time: '10:30 AM', isMe: false },
  { id: '2', text: 'Yes, already joined. Can\'t wait!', time: '10:33 AM', isMe: true },
  { id: '3', text: 'Awesome! Let\'s meet up there.', time: '10:33 AM', isMe: false },
  { id: '4', text: 'Sounds great! What time works for you?', time: '10:34 AM', isMe: true },
  { id: '5', text: 'How about 6:30 PM at the entrance?', time: '10:36 AM', isMe: false },
  { id: '6', text: 'Perfect! See you then.', time: '10:38 AM', isMe: true },
  { id: '7', text: 'Thanks! See you at the event 🎉', time: '10:39 AM', isMe: false },
];

export default function ChatDetail({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  // Mesajları tutacağımız Local State (Mesaj gönderdikçe burası güncellenecek)
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  
  // Yeni mesaj geldiğinde listeyi en alta kaydırmak için referans
  const flatListRef = useRef();

  const userName = (route && route.params && route.params.name) ? route.params.name : 'Sarah Johnson';
  const isOnline = (route && route.params && route.params.isOnline !== undefined) ? route.params.isOnline : true;

  // MESAJ GÖNDERME FONKSİYONU
  const handleSend = () => {
    if (inputText.trim().length === 0) return; // Boş mesaj atılmasını engelle

    // Şu anki saati 10:45 AM formatında al
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: Date.now().toString(), // Benzersiz ID
      text: inputText.trim(),
      time: currentTime,
      isMe: true, // Biz gönderdiğimiz için sağa yaslanacak
    };

    // Yeni mesajı mevcut listeye ekle
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText(''); // Input'u temizle
  };

  // GELİŞTİRME AŞAMASINDAKİ BUTONLAR İÇİN UYARI FONKSİYONU
  const handleFeatureNotReady = (featureName) => {
    Alert.alert(
      "Geliştirme Aşamasında", 
      `${featureName} özelliği Firebase entegrasyonu aşamasında aktif edilecektir.`,
      [{ text: "Anladım", style: "cancel" }]
    );
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageWrapper, item.isMe ? styles.messageWrapperMe : styles.messageWrapperOther]}>
      {!item.isMe && (
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' }} 
          style={styles.messageAvatar} 
        />
      )}
      <View style={item.isMe ? styles.messageContentMe : styles.messageContentOther}>
        <View style={[styles.messageBubble, item.isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.messageText, item.isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{userName}</Text>
            {isOnline && <Text style={styles.onlineStatus}>Active now</Text>}
          </View>
          
          {/* SAĞ ÜSTTEKİ 3 NOKTA BUTONU */}
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => handleFeatureNotReady('Sohbet Seçenekleri')}
          >
            <Feather name="more-vertical" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* MESAJ LİSTESİ */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Liste boyutu değiştiğinde (yeni mesaj eklendiğinde) otomatik en alta kaydır
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* MESAJ YAZMA ALANI */}
        <View style={styles.inputContainer}>
          
          {/* DOSYA EKLEME (+) BUTONU */}
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => handleFeatureNotReady('Medya ve Dosya Ekleme')}
          >
            <Feather name="plus" size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          
          {/* EĞER YAZI VARSA GÖNDER BUTONU ÇIKSIN, YOKSA MİKROFON ÇIKSIN */}
          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.micButton}
              onPress={() => handleFeatureNotReady('Sesli Mesaj')}
            >
              <Feather name="mic" size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFF',
  },
  backButton: { padding: 8 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  onlineStatus: { fontSize: 12, color: '#10B981', fontWeight: '500', marginTop: 2 },
  headerIcon: { padding: 8 },
  listContent: { padding: 20, paddingBottom: 10 },
  messageWrapper: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' },
  messageWrapperMe: { justifyContent: 'flex-end' },
  messageWrapperOther: { justifyContent: 'flex-start' },
  messageAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8, marginBottom: 16 },
  messageContentMe: { alignItems: 'flex-end', maxWidth: '80%' },
  messageContentOther: { alignItems: 'flex-start', maxWidth: '80%' },
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, marginBottom: 4 },
  bubbleMe: { backgroundColor: '#4F46E5', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextMe: { color: '#FFF' },
  messageTextOther: { color: '#111827' },
  messageTime: { fontSize: 11, color: '#9CA3AF', marginHorizontal: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFF',
  },
  attachButton: { padding: 10, marginRight: 8, marginBottom: 2 },
  textInputWrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginRight: 12,
    minHeight: 44,
    maxHeight: 100,
    justifyContent: 'center',
  },
  textInput: { fontSize: 15, color: '#111827' },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  micButton: { padding: 10, marginBottom: 2 },
});