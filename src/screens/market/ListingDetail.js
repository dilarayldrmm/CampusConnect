import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// DİKKAT: setDoc ve getDoc eklendi!
import { db } from '../../config/firebase';
import { doc, onSnapshot, deleteDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

export default function ListingDetail({ route, navigation }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext); 

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false); // Chat bekleme durumu

  useEffect(() => {
    const docRef = doc(db, 'listings', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() });
      } else {
        if (!isDeleting) {
          Alert.alert("Bilgi", "Bu ilan artık mevcut değil.");
          navigation.goBack();
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, isDeleting]);

  // SİLME FONKSİYONU
  const handleDeleteListing = () => {
    Alert.alert("İlanı Sil", "Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { 
        text: "Sil", style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteDoc(doc(db, 'listings', id));
            Alert.alert("Başarılı", "İlanınız marketten kaldırıldı.");
            navigation.goBack();
          } catch (error) {
            setIsDeleting(false);
            Alert.alert("Hata", "İlan silinirken bir sorun oluştu.");
          }
        }
      }
    ]);
  };

  // SOHBET (CHAT) BAŞLATMA FONKSİYONU
  const handleContactSeller = async () => {
    setIsStartingChat(true);
    
    // Benzersiz ID: Hangi İlan + Kim Alıyor
    const chatId = `${id}_${user.uid}`;
    const chatRef = doc(db, 'chats', chatId);

    try {
      const chatSnap = await getDoc(chatRef);

      // Eğer bu ilan için bu kişiyle daha önce sohbet odası açılmadıysa, SIFIRDAN OLUŞTUR
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          listingId: id,
          listingTitle: listing.title,
          users: [user.uid, listing.creatorId], // [0: Alıcı, 1: Satıcı]
          buyerId: user.uid,
          sellerId: listing.creatorId,
          sellerName: listing.creatorEmail?.split('@')[0] || 'Seller',
          buyerName: user.email?.split('@')[0] || 'Buyer',
          lastMessage: "Sohbet başlatıldı...",
          updatedAt: serverTimestamp(),
        });
      }

      setIsStartingChat(false);
      
      // Odayı oluşturduk (veya zaten vardı bulduk), şimdi Chat sayfasına fırlat
      navigation.navigate('ChatDetail', {
        chatId: chatId,
        listingTitle: listing.title,
        sellerName: listing.creatorEmail?.split('@')[0] || 'Seller'
      });

    } catch (error) {
      setIsStartingChat(false);
      Alert.alert("Hata", "Sohbet başlatılamadı: " + error.message);
    }
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#10B981" /></View>;
  }

  const isOwner = user.uid === listing?.creatorId;
  if (!listing) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.image }} style={styles.image} />
          <SafeAreaView style={styles.headerSafeArea}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#111827" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}><Text style={styles.categoryText}>{listing.category}</Text></View>
            <Text style={styles.price}>{listing.price} TL</Text>
          </View>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.dateText}>Posted recently</Text>

          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}><Feather name="user" size={20} color="#10B981" /></View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{listing.creatorEmail?.split('@')[0] || 'Campus Student'}</Text>
              <Text style={styles.sellerSubtitle}>Verified Student</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </ScrollView>

      {/* ALT BAR - BUTONLAR */}
      <View style={styles.bottomBar}>
        {!isOwner ? (
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSeller} disabled={isStartingChat}>
            {isStartingChat ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="chatbubble-ellipses-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.contactButtonText}>Message Seller</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.contactButton, { backgroundColor: '#EF4444' }]} onPress={handleDeleteListing} disabled={isDeleting}>
            {isDeleting ? <ActivityIndicator color="#FFF" /> : <><Feather name="trash-2" size={20} color="#FFF" style={{ marginRight: 8 }} /><Text style={styles.contactButtonText}>Delete Listing</Text></>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  imageContainer: { width: '100%', height: 350, backgroundColor: '#F3F4F6', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerSafeArea: { position: 'absolute', top: 0, left: 0, right: 0 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  content: { padding: 24 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  categoryBadge: { backgroundColor: '#ECFDF5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  categoryText: { color: '#10B981', fontSize: 13, fontWeight: '700' },
  price: { fontSize: 28, fontWeight: '800', color: '#10B981' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  dateText: { fontSize: 13, color: '#9CA3AF', marginBottom: 24 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16 },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  sellerSubtitle: { fontSize: 13, color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  contactButton: { flexDirection: 'row', backgroundColor: '#10B981', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  contactButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});