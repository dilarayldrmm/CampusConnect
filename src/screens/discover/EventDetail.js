import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext'; // ThemeContext eklendi

export default function EventDetail({ route, navigation }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // Temayı çek
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'events', id), (docSnap) => {
      if (docSnap.exists()) setEvent({ id: docSnap.id, ...docSnap.data() });
      else navigation.goBack();
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const toggleJoinEvent = async () => {
    setJoining(true);
    const eventRef = doc(db, 'events', id);
    try {
      if (event.attendeesList?.includes(user.uid)) {
        await updateDoc(eventRef, { attendeesList: arrayRemove(user.uid), attendees: (event.attendees || 1) - 1 });
      } else {
        await updateDoc(eventRef, { attendeesList: arrayUnion(user.uid), attendees: (event.attendees || 0) + 1 });
      }
    } catch (e) {
      Alert.alert("Hata", "İşlem başarısız.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <View style={[styles.loading, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}><ActivityIndicator size="large" color="#4A1D5D" /></View>;

  const isAttending = event.attendeesList?.includes(user.uid);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
          <View style={styles.badge}><Text style={styles.badgeText}>{event.category}</Text></View>
          <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>{event.title}</Text>
          
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F0E6F5' }]}><Feather name="calendar" size={20} color="#9A73B5" /></View>
            <Text style={[styles.text, { color: isDarkMode ? '#CCC' : '#555' }]}>{event.date}</Text>
          </View>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F0E6F5' }]}><Feather name="map-pin" size={20} color="#9A73B5" /></View>
            <Text style={[styles.text, { color: isDarkMode ? '#CCC' : '#555' }]}>{event.location}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Hakkında</Text>
          <Text style={[styles.desc, { color: isDarkMode ? '#AAA' : '#555' }]}>{event.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderTopColor: isDarkMode ? '#333' : '#D1B8E0' }]}>
        <TouchableOpacity style={[styles.btn, isAttending && styles.leaveBtn]} onPress={toggleJoinEvent} disabled={joining}>
          {joining ? <ActivityIndicator color="#FFF" /> : (
            <Text style={[styles.btnText, isAttending && styles.leaveText]}>
              {isAttending ? 'Etkinlikten Ayrıl' : 'Etkinliğe Katıl'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 100 },
  imageContainer: { width: '100%', height: 350 },
  image: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24 },
  badge: { backgroundColor: '#4A1D5D', padding: 8, borderRadius: 0, alignSelf: 'flex-start', marginBottom: 15 },
  badgeText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  text: { fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  desc: { fontSize: 15, lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  btn: { backgroundColor: '#4A1D5D', height: 50, borderRadius: 0, justifyContent: 'center', alignItems: 'center' },
  leaveBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444' },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  leaveText: { color: '#EF4444' }
});