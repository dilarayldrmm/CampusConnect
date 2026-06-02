import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const DUMMY_CHATS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'Thanks! See you at the event 🎉',
    time: '2m ago',
    unreadCount: 2,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Mike Chen',
    lastMessage: 'Is the MacBook still available?',
    time: '5h ago',
    unreadCount: 1,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    lastMessage: "Perfect! I'll pick it up tomorrow",
    time: '8h ago',
    unreadCount: 0,
    isOnline: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Alex Kumar',
    lastMessage: "Great project! Let's collaborate",
    time: '1d ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Lisa Park',
    lastMessage: 'Can you share the notes?',
    time: '2d ago',
    unreadCount: 0,
    isOnline: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  },
];

export default function ChatList({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatDetail', { name: item.name, isOnline: item.isOnline })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineBadge} />}
      </View>

      <View style={styles.chatInfo}>
        <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
        <Text 
          style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      <View style={styles.chatMeta}>
        <Text style={[styles.timeText, item.unreadCount > 0 && styles.timeTextUnread]}>
          {item.time}
        </Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={DUMMY_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, marginTop: 10, marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 16, height: 46, marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  chatItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  avatarContainer: { position: 'relative', marginRight: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E5E7EB' },
  onlineBadge: {
    position: 'absolute', bottom: 2, right: 2, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FAFAFA',
  },
  chatInfo: { flex: 1, justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  lastMessage: { fontSize: 14, color: '#6B7280' },
  lastMessageUnread: { color: '#111827', fontWeight: '500' },
  chatMeta: { alignItems: 'flex-end', justifyContent: 'space-between', height: 44 },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  timeTextUnread: { color: '#4F46E5', fontWeight: '600' },
  unreadBadge: {
    backgroundColor: '#4F46E5', paddingHorizontal: 6, height: 20, minWidth: 20,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 6,
  },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
});