import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Firebase ve Context
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  // Global depomuzdan aktif kullanıcı bilgilerini çekiyoruz
  const { user } = useContext(AuthContext);

  // FİREBASE ÇIKIŞ FONKSİYONU
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
              // Çıkış başarılı olunca AuthContext 'user'ı null yapacak
              // ve App.js bizi otomatik olarak Login ekranına fırlatacak!
            } catch (error) {
              Alert.alert("Hata", "Çıkış yapılamadı.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }} 
          style={styles.avatar} 
        />
        {/* Firebase'den gelen kullanıcının e-posta adresini ekrana basıyoruz */}
        <Text style={styles.userName}>Campus Student</Text>
        <Text style={styles.userEmail}>{user?.email || 'No Email'}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Communities</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>28</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Feather name="bookmark" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.menuItemText}>Saved Events</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Feather name="shopping-bag" size={20} color="#10B981" />
            </View>
            <Text style={styles.menuItemText}>My Listings</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* ÇIKIŞ YAP BUTONU */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827' },
  profileSection: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  userName: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, width: '100%', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  divider: { width: 1, height: '100%', backgroundColor: '#F3F4F6' },
  menuSection: { paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 12, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuItemText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 12, borderRadius: 16, marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: '#FEF2F2' },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#EF4444' },
});