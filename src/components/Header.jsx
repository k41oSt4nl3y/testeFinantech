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
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 lg:p-6 rounded-2xl shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <span className="text-2xl lg:text-3xl">🤑</span>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Kaio Finanças</h1>
            <p className="text-blue-100 text-sm lg:text-base">
              Olá, {currentUser?.displayName?.split(' ')[0] || 'Usuário'}! 👋
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {currentUser?.photoURL && (
            <div className="relative">
              <img
                src={currentUser.photoURL}
                alt="Foto do usuário"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 lg:px-5 lg:py-3 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
