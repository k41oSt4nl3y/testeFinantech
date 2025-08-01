import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configurações do Firebase - Use variáveis de ambiente ou substitua pelos valores reais
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Verificar se as configurações foram definidas
const requiredConfigs = Object.entries(firebaseConfig);
const missingConfigs = requiredConfigs.filter(([key, value]) => 
  value.includes('your-') || value === '123456789'
);

if (missingConfigs.length > 0) {
  console.warn('⚠️  Firebase não configurado completamente. Configure as seguintes variáveis:');
  missingConfigs.forEach(([key]) => {
    console.warn(`   - ${key}`);
  });
  console.warn('📖 Veja o README.md para instruções detalhadas');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const providerGoogle = new GoogleAuthProvider();

export default app;