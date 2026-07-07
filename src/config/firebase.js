import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Senin Firebase konsolundan aldığımız yapılandırma anahtarları
const firebaseConfig = {
  apiKey: "AIzaSyBg5muNvqyv8HubiJtiSm_OZxrsQqKPPXE",
  authDomain: "campusconnect-dece4.firebaseapp.com",
  projectId: "campusconnect-dece4",
  storageBucket: "campusconnect-dece4.firebasestorage.app",
  messagingSenderId: "578631272974",
  appId: "1:578631272974:web:d862c06420690f09bd0a5f"
  // MeasurementId'yi Expo'da sorun yaratmaması için şimdilik kaldırdık
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini dışa aktar (Diğer sayfalarda kullanacağız)
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };