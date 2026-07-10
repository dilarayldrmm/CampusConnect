import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { db } from '../../config/firebase';
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

export default function ListingDetail({ route, navigation }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'MarketTab' });
    }
  };

  useEffect(() => {
    const docRef = doc(db, 'listings', id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() });
      } else {
        handleGoBack();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const handleContactSeller = async () => {
    setIsStartingChat(true);
    const chatId = `${id}_${user.uid}`;
    const chatRef = doc(db, 'chats', chatId);
    try {
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          listingId: id, listingTitle: listing.title, users: [user.uid, listing.creatorId],
          buyerId: user.uid, sellerId: listing.creatorId,
          sellerName: listing.creatorEmail?.split('@')[0] || 'Seller',
          buyerName: user.email?.split('@')[0] || 'Buyer',
          lastMessage: "Sohbet başlatıldı...", updatedAt: serverTimestamp(),
        });
      }
      setIsStartingChat(false);
      navigation.navigate('ChatDetail', { chatId, listingTitle: listing.title, sellerName: listing.creatorEmail?.split('@')[0] });
    } catch (error) {
      setIsStartingChat(false);
      Alert.alert("Hata", "Sohbet başlatılamadı.");
    }
  };

  const handleDelete = async () => {
    Alert.alert("İlanı Sil", "Bu ilanı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteDoc(doc(db, 'listings', id));
            Alert.alert("Başarılı", "İlan silindi.");
            handleGoBack();
          } catch (e) {
            Alert.alert("Hata", "İlan silinemedi.");
          } finally {
            setIsDeleting(false);
          }
        }
      }
    ]);
  };

  if (loading) return <View style={[styles.loading, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}><ActivityIndicator size="large" color="#4A1D5D" /></View>;
  
  const isOwner = user?.uid === listing?.creatorId;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <StatusBar barStyle="light-content" />
      
      {/* ScrollView içeriği */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.image }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{listing.category}</Text></View>
            <Text style={[styles.price, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>{listing.price} TL</Text>
          </View>
          <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>{listing.title}</Text>

          <View style={[styles.sellerCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F0E6F5' }]}>
            <View style={styles.avatar}><Feather name="user" size={20} color="#FFF" /></View>
            <View><Text style={[styles.sellerName, { color: isDarkMode ? '#FFF' : '#000' }]}>{listing.creatorEmail?.split('@')[0]}</Text><Text style={styles.sellerSub}>Satıcı</Text></View>
          </View>

          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Açıklama</Text>
          <Text style={[styles.desc, { color: isDarkMode ? '#AAA' : '#555' }]}>{listing.description}</Text>
        </View>
      </ScrollView>

      {/* Butonlar burada, ScrollView'un dışında, en altta sabit */}
      <View style={[styles.bottomBar, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD', borderTopColor: isDarkMode ? '#333' : '#D1B8E0' }]}>
        {isOwner ? (
          <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
            <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#4A1D5D', marginRight: 10 }]} onPress={() => navigation.navigate('EditListing', { id: listing.id })}>
              <Text style={styles.btnText}>Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#EF4444' }]} onPress={handleDelete} disabled={isDeleting}>
              {isDeleting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Sil</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity style={styles.btn} onPress={handleContactSeller} disabled={isStartingChat}>
              {isStartingChat ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Mesaj Gönder</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 }, // Butonların üzerini örtmemesi için boşluk
  imageContainer: { width: '100%', height: 400 },
  image: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badge: { backgroundColor: '#4A1D5D', padding: 8 },
  badgeText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  price: { fontSize: 26, fontWeight: '900' },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
  sellerCard: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 20 },
  avatar: { width: 40, height: 40, backgroundColor: '#4A1D5D', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  sellerName: { fontWeight: '700' },
  sellerSub: { fontSize: 12, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  desc: { fontSize: 15, lineHeight: 22 },
  bottomBar: { height: 90, borderTopWidth: 1, justifyContent: 'center' }, // Sabit yükseklik
  btn: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});