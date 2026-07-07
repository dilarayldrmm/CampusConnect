import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  TextInput
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sahte (Dummy) Topluluk ve Gönderi Verileri
const COMMUNITY_MOCK = {
  name: 'Computer Science Club',
  members: '1.234',
  category: 'Academic',
  description: 'A community for CS students to share knowledge, organize study groups, and discuss the latest tech trends.',
  coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  isJoined: true
};

const POSTS_MOCK = [
  {
    id: '1',
    author: { name: 'Alex Kumar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
    content: 'Does anyone have the past exam papers for Data Structures? Would really appreciate it!',
    time: '2h ago',
    likes: 12,
    comments: 4,
    isLiked: false
  },
  {
    id: '2',
    author: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
    content: 'We are organizing a hackathon prep session this weekend at the campus library. Let me know if you want to join our team.',
    time: '5h ago',
    likes: 34,
    comments: 8,
    isLiked: true
  }
];

export default function CommunityDetail({ navigation }) {
  const [newPostText, setNewPostText] = useState('');

  // Sayfanın üst kısmını (Kapak, Açıklama, Post Yazma Alanı) barındıran bileşen
  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Kapak Görseli ve Üst Bar */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: COMMUNITY_MOCK.coverImage }} style={styles.coverImage} />
        <SafeAreaView style={styles.safeTopButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="more-horizontal" size={24} color="#111827" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Topluluk Bilgileri */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.communityName}>{COMMUNITY_MOCK.name}</Text>
          <TouchableOpacity style={[styles.joinButton, COMMUNITY_MOCK.isJoined && styles.joinedButton]}>
            <Text style={[styles.joinButtonText, COMMUNITY_MOCK.isJoined && styles.joinedButtonText]}>
              {COMMUNITY_MOCK.isJoined ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{COMMUNITY_MOCK.category}</Text>
          </View>
          <Text style={styles.membersText}>{COMMUNITY_MOCK.members} members</Text>
        </View>

        <Text style={styles.description}>{COMMUNITY_MOCK.description}</Text>
      </View>

      {/* Yeni Post Paylaşma Alanı */}
      <View style={styles.createPostContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop' }} 
          style={styles.myAvatar} 
        />
        <View style={styles.postInputWrapper}>
          <TextInput
            style={styles.postInput}
            placeholder="Share something with the community..."
            placeholderTextColor="#9CA3AF"
            value={newPostText}
            onChangeText={setNewPostText}
          />
          <TouchableOpacity style={styles.attachButton}>
            <Feather name="image" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Her bir Post'u çizen bileşen
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.author.avatar }} style={styles.postAvatar} />
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postAuthorName}>{item.author.name}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name={item.isLiked ? "heart" : "heart-outline"} size={22} color={item.isLiked ? "#EF4444" : "#6B7280"} />
          <Text style={[styles.actionText, item.isLiked && { color: '#EF4444' }]}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={20} color="#6B7280" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={POSTS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' }, // Gri arka plan, postlar beyaz kart olacak
  headerSection: { backgroundColor: '#FFF', paddingBottom: 16, marginBottom: 8 },
  coverContainer: { width: '100%', height: 200, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  safeTopButtons: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10,
  },
  iconButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  infoContainer: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  communityName: { fontSize: 22, fontWeight: '700', color: '#111827', flex: 1, marginRight: 12 },
  joinButton: { backgroundColor: '#4F46E5', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  joinedButton: { backgroundColor: '#EEF2FF' },
  joinButtonText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  joinedButtonText: { color: '#4F46E5' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  categoryBadge: { backgroundColor: '#EEF2FF', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginRight: 12 },
  categoryText: { color: '#4F46E5', fontWeight: '600', fontSize: 11, textTransform: 'uppercase' },
  membersText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  description: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  createPostContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  myAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  postInputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, height: 44,
  },
  postInput: { flex: 1, fontSize: 14, color: '#111827' },
  attachButton: { marginLeft: 8, padding: 4 },
  listContent: { paddingBottom: 40 },
  postCard: { backgroundColor: '#FFF', padding: 20, marginBottom: 8 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  postHeaderInfo: { flex: 1 },
  postAuthorName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  postTime: { fontSize: 12, color: '#6B7280' },
  postContent: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 16 },
  postActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  actionText: { fontSize: 14, fontWeight: '500', color: '#6B7280', marginLeft: 6 },
});