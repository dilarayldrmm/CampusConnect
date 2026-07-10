import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // 1. Context'i import et

export default function ChatDetail({ route, navigation }) {
  const { chatId, listingTitle, sellerName } = route.params;
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // 2. Modu çek
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const messageToSend = inputText;
    setInputText('');
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: messageToSend,
        senderId: user.uid,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageToSend,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user.uid;
    return (
      <View style={[styles.messageWrapper, isMyMessage ? styles.messageWrapperRight : styles.messageWrapperLeft]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.messageBubbleRight : [styles.messageBubbleLeft, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0'}]]}>
          <Text style={[styles.messageText, isMyMessage ? styles.messageTextRight : { color: isDarkMode ? '#FFF' : '#000' }]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{sellerName}</Text>
          <Text style={styles.headerSubtitle}>{listingTitle}</Text>
        </View>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <KeyboardAvoidingView style={styles.chatArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={styles.messageList}
        />
        <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderTopColor: isDarkMode ? '#333' : '#F0E6F5' }]}>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD', borderColor: isDarkMode ? '#333' : '#D1B8E0', color: isDarkMode ? '#FFF' : '#000' }]}
            placeholder="Mesajını yaz..."
            placeholderTextColor={isDarkMode ? '#888' : '#999'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!inputText.trim()}>
            <Feather name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerInfo: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: '#E5D0F0', marginTop: 2 },
  chatArea: { flex: 1 },
  messageList: { paddingHorizontal: 16, paddingVertical: 20 },
  messageWrapper: { marginBottom: 12, flexDirection: 'row' },
  messageWrapperRight: { justifyContent: 'flex-end' },
  messageWrapperLeft: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '80%', padding: 14, borderRadius: 16 }, 
  messageBubbleRight: { backgroundColor: '#4A1D5D', borderBottomRightRadius: 4 },
  messageBubbleLeft: { borderWidth: 1, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15 },
  messageTextRight: { color: '#FFF' },
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 12, fontSize: 15, marginRight: 10 },
  sendButton: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#4A1D5D', justifyContent: 'center', alignItems: 'center' }
});