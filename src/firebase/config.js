import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB9yR8kocQgIWt6XGRfMmBGp5xi2KOMX3o',
  authDomain: 'projeto-gestao-max.firebaseapp.com',
  projectId: 'projeto-gestao-max',
  storageBucket: 'projeto-gestao-max.firebasestorage.app',
  messagingSenderId: '812768558939',
  appId: '1:812768558939:web:8ec487979dd9c76783a47e',
  measurementId: 'G-6ZD7RLFK5G',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const providerGoogle = new GoogleAuthProvider();
export default app;
