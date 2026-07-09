import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Firebase ve Context
import { db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

export default function EventDetail({ route, navigation }) {
  const { id } = route.params; // Discover sayfasından gönderilen etkinlik ID'si
  const { user } = useContext(AuthContext); // Giriş yapmış aktif kullanıcı
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false); // Butonun yükleme durumu

  // 1. ETKİNLİK DETAYLARINI FİREBASE'DEN GERÇEK ZAMANLI ÇEKME
  useEffect(() => {
    // Sadece bu ID'ye sahip olan dökümana (belgeye) bağlanıyoruz
    const eventRef = doc(db, 'events', id);
    
    const unsubscribe = onSnapshot(eventRef, (docSnap) => {
      if (docSnap.exists()) {
        setEvent({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert("Hata", "Etkinlik bulunamadı veya silinmiş.");
        navigation.goBack();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Kullanıcı zaten bu etkinliğe katılmış mı kontrolü
  const isAttending = event?.attendeesList?.includes(user.uid);

  // 2. ETKİNLİĞE KATIL / AYRIL FONKSİYONU
  const toggleJoinEvent = async () => {
    setJoining(true);
    const eventRef = doc(db, 'events', id);
    
    try {
      if (isAttending) {
        // Zaten katıldıysa: Listeden ID'sini çıkar, sayıyı 1 azalt
        await updateDoc(eventRef, {
          attendeesList: arrayRemove(user.uid),
          attendees: (event.attendees || 1) - 1
        });
      } else {
        // Katılmadıysa: Listeye ID'sini ekle, sayıyı 1 artır
        await updateDoc(eventRef, {
          attendeesList: arrayUnion(user.uid),
          attendees: (event.attendees || 0) + 1
        });
      }
    } catch (error) {
      Alert.alert("Hata", "İşlem gerçekleştirilemedi.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Üst Kapak Fotoğrafı */}
        <ImageBackground source={{ uri: event.image }} style={styles.coverImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <SafeAreaView>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#FFF" />
              </TouchableOpacity>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Etkinlik Detay İçeriği */}
        <View style={styles.contentContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.hostContainer}>
            <View style={styles.hostAvatar}>
              <Feather name="user" size={16} color="#4F46E5" />
            </View>
            <Text style={styles.hostText}>
              Hosted by <Text style={styles.hostName}>{event.creatorEmail?.split('@')[0] || 'Campus Student'}</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="calendar" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Date</Text>
              <Text style={styles.infoSub}>{event.date || 'To be announced'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="map-pin" size={20} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.infoSub}>{event.location}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="people-outline" size={22} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Attendees</Text>
              <Text style={styles.infoSub}>
                {event.attendees || 0} {event.capacity ? `/ ${event.capacity} spots filled` : 'going'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Alt Kısım Sabit Katıl Butonu */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.joinButton, isAttending && styles.leaveButton]} 
          onPress={toggleJoinEvent}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color={isAttending ? '#EF4444' : '#FFF'} />
          ) : (
            <>
              <Text style={[styles.joinButtonText, isAttending && styles.leaveButtonText]}>
                {isAttending ? 'Leave Event' : 'Join Event'}
              </Text>
              {!isAttending && <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coverImage: { width: '100%', height: 320 },
  gradient: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  contentContainer: { padding: 24, marginTop: -30, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginBottom: 16 },
  categoryText: { color: '#4F46E5', fontSize: 13, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 16 },
  hostContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  hostAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  hostText: { fontSize: 14, color: '#6B7280' },
  hostName: { fontWeight: '700', color: '#111827' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoTitle: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  infoSub: { fontSize: 15, fontWeight: '600', color: '#111827' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 10, marginBottom: 12 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  joinButton: { backgroundColor: '#4F46E5', flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  leaveButton: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  joinButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  leaveButtonText: { color: '#EF4444' },
});