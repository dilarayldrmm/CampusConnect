import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Firebase Bağlantıları
import { db } from '../../config/firebase';
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

export default function ChatDetail({ route, navigation }) {
  const { chatId, listingTitle, sellerName } = route.params;
  const { user } = useContext(AuthContext); // Giriş yapan kişi (Sen)

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // 1. MESAJLARI GERÇEK ZAMANLI DİNLE
  useEffect(() => {
    // Sohbet odasının içindeki "messages" alt koleksiyonuna bağlanıyoruz
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    
    // Mesajları tarihe göre (en yeni en üstte/altta olacak şekilde) sırala
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  // 2. YENİ MESAJ GÖNDERME FONKSİYONU
  const sendMessage = async () => {
    if (!inputText.trim()) return; // Boş mesaj gönderilmesin

    const messageToSend = inputText;
    setInputText(''); // Gönder'e basınca yazma alanını anında temizle

    try {
      // a) Mesajı "messages" alt koleksiyonuna ekle
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: messageToSend,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });

      // b) Gelen Kutusunda son mesajı göstermek için ana sohbet dökümanını güncelle
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: messageToSend,
        updatedAt: serverTimestamp()
      });

    } catch (error) {
      console.log("Mesaj gönderme hatası:", error);
    }
  };

  // 3. MESAJ BALONCUKLARI TASARIMI
  const renderMessage = ({ item }) => {
    // Mesajı sen mi attın, karşı taraf mı?
    const isMyMessage = item.senderId === user.uid;

    return (
      <View style={[styles.messageWrapper, isMyMessage ? styles.messageWrapperRight : styles.messageWrapperLeft]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.messageBubbleRight : styles.messageBubbleLeft]}>
          <Text style={[styles.messageText, isMyMessage ? styles.messageTextRight : styles.messageTextLeft]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ÜST BAR (HEADER) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{sellerName}</Text>
          <Text style={styles.headerSubtitle}>{listingTitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* KLAVYE AÇILINCA EKRANI YUKARI KAYDIRAN YAPI */}
      <KeyboardAvoidingView 
        style={styles.chatArea} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* MESAJ LİSTESİ */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted // Listeyi ters çevirir (WhatsApp gibi en yeni mesaj altta başlar)
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* MESAJ YAZMA ALANI */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  backButton: { padding: 4 },
  headerInfo: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  chatArea: { flex: 1 },
  messageList: { paddingHorizontal: 16, paddingVertical: 20 },
  messageWrapper: { marginBottom: 12, flexDirection: 'row' },
  messageWrapperRight: { justifyContent: 'flex-end' },
  messageWrapperLeft: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  messageBubbleRight: { backgroundColor: '#10B981', borderBottomRightRadius: 4 },
  messageBubbleLeft: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextRight: { color: '#FFF' },
  messageTextLeft: { color: '#111827' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, paddingTop: 12, fontSize: 15, color: '#111827', maxHeight: 100, marginRight: 12 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  sendButtonDisabled: { backgroundColor: '#A7F3D0' },
});