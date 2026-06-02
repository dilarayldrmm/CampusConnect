import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const CATEGORIES = ['Concert', 'Seminar', 'Sports', 'Social', 'Academic'];

export default function CreateEvent({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState('Social');
  const [capacity, setCapacity] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Feather name="x" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Event</Text>
        <View style={{ width: 24 }} /> {/* Boşluk dengeleyici */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* PROGRESS BAR */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.stepText}>Step 1 of 3</Text>
            <Text style={styles.percentText}>33%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '33%' }]} />
          </View>
        </View>

        {/* FORM */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Spring Music Festival"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your event..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryPill,
                  activeCategory === cat && styles.categoryPillActive
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Max Capacity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 100"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={capacity}
            onChangeText={setCapacity}
          />
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>This is an online event</Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
            thumbColor={'#FFF'}
          />
        </View>

        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  closeButton: { padding: 4 },
  content: { padding: 20, paddingBottom: 40 },
  progressSection: { marginBottom: 32 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  percentText: { fontSize: 14, color: '#4F46E5', fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: '#EEF2FF', borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  formGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  categoryPillActive: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  categoryText: { color: '#4B5563', fontWeight: '500', fontSize: 14 },
  categoryTextActive: { color: '#4F46E5', fontWeight: '600' },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingVertical: 8 },
  switchLabel: { fontSize: 15, fontWeight: '500', color: '#111827' },
  nextButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});