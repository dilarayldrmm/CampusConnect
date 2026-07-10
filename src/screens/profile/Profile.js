import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

export default function Profile({ navigation }) {
  const { user } = useContext(AuthContext); // Artık güncel displayName ve photoURL'e sahip
  const { isDarkMode } = useContext(ThemeContext);

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Evet, Çıkış Yap", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert("Hata", "Çıkış yapılamadı.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Dinamik Profil Fotoğrafı */}
        <Image 
          source={{ uri: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }} 
          style={styles.avatar} 
        />
        {/* Dinamik Kullanıcı Adı */}
        <Text style={styles.userName}>{user?.displayName || user?.email?.split('@')[0] || 'Campus Student'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'No Email'}</Text>
      </LinearGradient>

      <View style={styles.statsWrapper}>
        <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]}>
          <View style={styles.statBox}><Text style={[styles.statNumber, { color: isDarkMode ? '#FFF' : '#000' }]}>12</Text><Text style={styles.statLabel}>Events</Text></View>
          <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#D1B8E0' }]} />
          <View style={styles.statBox}><Text style={[styles.statNumber, { color: isDarkMode ? '#FFF' : '#000' }]}>4</Text><Text style={styles.statLabel}>Communities</Text></View>
          <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#D1B8E0' }]} />
          <View style={styles.statBox}><Text style={[styles.statNumber, { color: isDarkMode ? '#FFF' : '#000' }]}>28</Text><Text style={styles.statLabel}>Friends</Text></View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity 
          style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} 
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? '#333' : '#FFF3E0' }]}><Feather name="edit-2" size={20} color="#F59E0B" /></View>
            <Text style={[styles.menuItemText, { color: isDarkMode ? '#FFF' : '#000' }]}>Profilini Düzenle</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} onPress={() => navigation.navigate('JoinedEvents')}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? '#333' : '#F3E5F5' }]}><Feather name="bookmark" size={20} color="#4A1D5D" /></View>
            <Text style={[styles.menuItemText, { color: isDarkMode ? '#FFF' : '#000' }]}>Joined Events</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} onPress={() => navigation.navigate('MyListings')}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: isDarkMode ? '#333' : '#E0F2F1' }]}><Feather name="shopping-bag" size={20} color="#059669" /></View>
            <Text style={[styles.menuItemText, { color: isDarkMode ? '#FFF' : '#000' }]}>My Listings</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#442222' : '#FECACA' }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 60, alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFF', marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  userEmail: { fontSize: 14, color: '#E5D0F0', marginBottom: 10 },
  statsWrapper: { marginTop: -40, paddingHorizontal: 20 },
  statsContainer: { flexDirection: 'row', borderRadius: 0, padding: 20, borderWidth: 1, elevation: 5 },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  divider: { width: 1, marginHorizontal: 10 },
  menuSection: { padding: 20, marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 0, marginBottom: 12, borderWidth: 1 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: { width: 40, height: 40, borderRadius: 0, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuItemText: { fontSize: 16, fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 0, marginTop: 20, borderWidth: 1 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#EF4444', marginLeft: 15 }
});