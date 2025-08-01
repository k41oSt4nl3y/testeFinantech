import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, TrendingUp, Shield, Smartphone } from 'lucide-react';

function Login() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        alert('Erro no login: ' + result.error);
      }
    } catch (error) {
      alert('Erro no login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col lg:flex-row">
      {/* Lado esquerdo - Informações */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <div className="mb-8">
            <DollarSign className="h-12 w-12 mb-4" />
            <h1 className="text-4xl font-bold mb-4">Gestão de Finanças</h1>
            <p className="text-xl opacity-90">
              Controle suas receitas e despesas de forma simples e segura
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <TrendingUp className="h-6 w-6 mt-1 text-green-300" />
              <div>
                <h3 className="font-semibold">Acompanhe seu progresso</h3>
                <p className="text-sm opacity-80">Visualize seus gastos e ganhos em tempo real</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 mt-1 text-blue-300" />
              <div>
                <h3 className="font-semibold">Dados seguros</h3>
                <p className="text-sm opacity-80">Suas informações protegidas pelo Firebase</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Smartphone className="h-6 w-6 mt-1 text-purple-300" />
              <div>
                <h3 className="font-semibold">Use em qualquer lugar</h3>
                <p className="text-sm opacity-80">Aplicativo responsivo que funciona em todos os dispositivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Login */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
            <p className="text-gray-600">Faça login para começar a gerenciar suas finanças</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-4 text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continuar com Google</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Ao fazer login, você concorda com nossos</p>
            <p>Termos de Uso e Política de Privacidade</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;