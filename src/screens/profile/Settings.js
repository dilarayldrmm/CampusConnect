import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Settings({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* APPEARANCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPEARANCE</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemTitle}>Theme</Text>
              <Text style={styles.menuItemSubtitle}>Light Mode</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          
          <View style={styles.toggleItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemTitle}>Push Notifications</Text>
              <Text style={styles.menuItemSubtitle}>Receive push notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
              thumbColor={'#FFF'}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemTitle}>Event Reminders</Text>
              <Text style={styles.menuItemSubtitle}>Get reminded before events start</Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
              thumbColor={'#FFF'}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemTitle}>Message Notifications</Text>
              <Text style={styles.menuItemSubtitle}>Get notified of new messages</Text>
            </View>
            <Switch
              value={messagesEnabled}
              onValueChange={setMessagesEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
              thumbColor={'#FFF'}
            />
          </View>
        </View>

        {/* ACCOUNT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemTitle}>Edit Profile</Text>
              <Text style={styles.menuItemSubtitle}>Update your profile information</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemTitle}>Change Password</Text>
              <Text style={styles.menuItemSubtitle}>Update your password</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* DANGER ZONE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>DANGER ZONE</Text>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  backButton: { padding: 4 },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 1, marginBottom: 16, paddingLeft: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemLeft: { flex: 1, paddingRight: 16 },
  menuItemTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  menuItemSubtitle: { fontSize: 13, color: '#6B7280' },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});