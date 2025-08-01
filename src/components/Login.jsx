import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, providerGoogle, db } from '../firebase/config';
import { showSuccess, showError } from './Toast';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);

    signInWithPopup(auth, providerGoogle)
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
      })
      .catch((error) => {
        console.error('Erro no login:', error);
        if (error.code === 'auth/popup-blocked') {
          showError(
            'Pop-up bloqueado! Clique no ícone 🚫 na barra de endereços e permita pop-ups para este site.'
          );
        } else {
          showError('Erro ao fazer login. Tente novamente.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🤑</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">FinanTech</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              💡 <strong>Dica:</strong> Se o pop-up for bloqueado, clique no
              ícone 🚫 na barra de endereços e permita pop-ups para este site.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Ao fazer login, você concorda com nossos</p>
            <p>Termos de Uso e Política de Privacidade</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-400">
          <div className="text-center text-sm text-gray-800">
            <h3 className="font-semibold mb-3">Recursos disponíveis:</h3>
            <ul className="space-y-1">
              <li> Controle de receitas e despesas</li>
              <li> Relatórios financeiros</li>
              <li> Filtros por categoria e período</li>
              <li> Dados seguros na nuvem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
