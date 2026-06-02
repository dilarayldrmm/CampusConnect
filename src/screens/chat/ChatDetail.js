import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Tasarımdaki sahte (Dummy) mesaj geçmişi
const DUMMY_MESSAGES = [
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

  // Önceki sayfadan (ChatList) gelen veriyi alıyoruz. 
  // Şimdilik test için varsayılan bir isim atadık.
  const userName = route?.params?.name || 'Sarah Johnson';
  const isOnline = route?.params?.isOnline ?? true;

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
          
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="more-vertical" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* MESAJ LİSTESİ */}
        <FlatList
          data={DUMMY_MESSAGES}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Mesajların alttan başlaması ve yeni mesaj gelince alta kayması için
          inverted={false} 
        />

        {/* MESAJ YAZMA ALANI */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
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
          
          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micButton}>
              <Feather name="mic" size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
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
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#10B981', // Yeşil online rengi
    fontWeight: '500',
    marginTop: 2,
  },
  headerIcon: {
    padding: 8,
  },
  listContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  messageWrapperMe: {
    justifyContent: 'flex-end',
  },
  messageWrapperOther: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 16, // Saatin yanına hizalamak için
  },
  messageContentMe: {
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  messageContentOther: {
    alignItems: 'flex-start',
    maxWidth: '80%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  bubbleMe: {
    backgroundColor: '#4F46E5', // Bizim mesajlar mor
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#F3F4F6', // Karşı taraf gri
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextMe: {
    color: '#FFF',
  },
  messageTextOther: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFF',
  },
  attachButton: {
    padding: 10,
    marginRight: 8,
    marginBottom: 2,
  },
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
  textInput: {
    fontSize: 15,
    color: '#111827',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  micButton: {
    padding: 10,
    marginBottom: 2,
  },
});