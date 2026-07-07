import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Firebase Bağlantıları
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // FİREBASE KAYIT FONKSİYONU
  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Zayıf Şifre', 'Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    try {
      // Firebase'de yeni kullanıcı oluştur
      await createUserWithEmailAndPassword(auth, email, password);
      // Başarılı olursa hiçbir yönlendirmeye gerek yok, App.js'deki AuthContext bunu algılayıp bizi içeri alacak!
    } catch (error) {
      setIsLoading(false);
      // Firebase'den dönen hataları yakala
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Hata', 'Bu e-posta adresi zaten kullanımda.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Hata', 'Geçersiz bir e-posta adresi girdiniz.');
      } else {
        Alert.alert('Kayıt Başarısız', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join your campus community today.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="student@university.edu"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 10, left: 24, zIndex: 10, padding: 8 },
  header: { marginBottom: 32, marginTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  form: { marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  registerButton: {
    backgroundColor: '#4F46E5', borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', marginTop: 12,
  },
  registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  footerText: { fontSize: 14, color: '#6B7280' },
  loginLink: { fontSize: 14, color: '#4F46E5', fontWeight: '700' },
});