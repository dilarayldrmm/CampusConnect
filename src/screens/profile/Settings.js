import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

export default function Settings({ navigation }) {
  const { signOut } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Hesabınızdan çıkış yapmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive", onPress: () => signOut() }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FDFDFD' }]}>
      <LinearGradient colors={['#9A73B5', '#4A1D5D']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="arrow-left" size={24} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>GÖRÜNÜM</Text>
        
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} onPress={toggleTheme}>
          <View>
            <Text style={[styles.menuTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Tema</Text>
            <Text style={[styles.menuSub, { color: isDarkMode ? '#AAA' : '#666' }]}>{isDarkMode ? 'Karanlık Mod Aktif' : 'Aydınlık Mod Aktif'}</Text>
          </View>
          <Feather name={isDarkMode ? 'moon' : 'sun'} size={20} color="#4A1D5D" />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>BİLDİRİMLER</Text>
        {[
          { title: 'Push Bildirimleri', val: pushEnabled, set: setPushEnabled },
          { title: 'Etkinlik Hatırlatıcıları', val: remindersEnabled, set: setRemindersEnabled },
          { title: 'Mesaj Bildirimleri', val: messagesEnabled, set: setMessagesEnabled }
        ].map((item, i) => (
          <View key={i} style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]}>
            <Text style={[styles.menuTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.title}</Text>
            <Switch value={item.val} onValueChange={item.set} trackColor={{ true: '#4A1D5D' }} />
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#D1B8E0' : '#4A1D5D' }]}>HESAP</Text>
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#D1B8E0' }]} onPress={() => Alert.alert("Bilgi", "Profil düzenleme sayfası yakında eklenecek.")}>
          <Text style={[styles.menuTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Profili Düzenle</Text>
          <Feather name="chevron-right" size={20} color="#4A1D5D" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { marginTop: 20, backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: '#EF4444' }]} onPress={handleLogout}>
          <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Çıkış Yap</Text>
          <Feather name="log-out" size={20} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 40, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '900', marginTop: 20, marginBottom: 10, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 0, borderWidth: 1, marginBottom: 10 },
  menuTitle: { fontSize: 15, fontWeight: '700' },
  menuSub: { fontSize: 13 }
});