import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { showSuccess, showError } from './Toast';

export default function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair?')) {
      try {
        await logout();
        showSuccess('Logout realizado com sucesso!');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        showError('Erro ao sair. Tente novamente.');
      }
    }
  };

  return (
    <div className="bg-blue-500 p-4 rounded-xl shadow mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <span className="text-2xl">🤑</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Kaio Finanças</h1>
            <p className="text-blue-100 text-sm">
              Olá, {currentUser?.displayName?.split(' ')[0] || 'Usuário'}!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Foto do usuário"
              className="w-10 h-10 rounded-full border-2 border-black"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
