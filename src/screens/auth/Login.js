import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Daha ince ve profesyonel ikonlar için

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Birebir tasarımdaki beyazdan mora geçiş
    <LinearGradient colors={['#FDFDFD', '#9A73B5']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
       

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.innerContainer}>
            
            {/* İkon ve Başlık Alanı */}
            <View style={styles.headerSection}>
              {/* Ortadaki degrade ikon kutusu */}
              <LinearGradient
                colors={['#D1B8E0', '#E5D0F0']}
                style={styles.iconBox}
              >
                <Feather name="users" size={42} color="#111" />
              </LinearGradient>
              
              <Text style={styles.mainTitle}>CAMPUS CONNECT APP</Text>
              <Text style={styles.subTitle}>Welcome back! Sign in to continue</Text>
            </View>

            {/* Form Alanı */}
            <View style={styles.formSection}>
              
              {/* E-Mail */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-Mail</Text>
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={20} color="#333" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="student@university.edu"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#333" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••••••"
                    placeholderTextColor="#666"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#333" style={styles.iconRight} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* GİRİŞ YAP Butonu */}
              <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>GİRİŞ YAP</Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topLeftText: {
    position: 'absolute',
    top: 60, // Cihazın çentiğine göre ayarlanabilir
    left: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 1,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    paddingHorizontal: 32, // Kenarlardan geniş boşluk
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // Hafif gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 14,
    color: '#555',
    fontWeight: '400',
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(215, 215, 215, 0.65)', // Tasarımdaki yarı saydam gri/beyaz
    borderRadius: 25, // Hap (pill) görünümü
    height: 55,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  forgotBtn: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginLeft: 4,
  },
  forgotText: {
    fontSize: 14,
    color: '#5A2A70', // Koyu mor
    fontWeight: '700',
  },
  loginBtn: {
    backgroundColor: '#4A1D5D', // Tasarımdaki tok, koyu mor renk
    borderRadius: 25, // Hap görünümü
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});