import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, providerGoogle, db } from '../firebase/config';
import { showSuccess, showError } from '../components/Toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const loginWithGoogle = () => {
    return signInWithPopup(auth, providerGoogle)
      .then(async (result) => {
        const user = result.user;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          showSuccess(`Bem-vindo, ${user.displayName?.split(' ')[0]}!`);
        } else {
          showSuccess(`Olá novamente, ${user.displayName?.split(' ')[0]}!`);
        }

        return result;
      })
      .catch((error) => {
        console.error('Erro no login:', error);
        if (error.code === 'auth/popup-blocked') {
          showError('Pop-up bloqueado! Por favor, permita pop-ups para este site e tente novamente.');
        } else {
          showError('Erro ao fazer login. Tente novamente.');
        }
        throw error;
      });
  };

 
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}