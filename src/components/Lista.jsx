import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useAuth } from '../contexts/AuthContext';
import Formulario from './Formulario';
import Header from './Header';
import { showSuccess, showError } from './Toast';

export default function Lista() {
  const { currentUser } = useAuth();
  const [transacoes, setTransacoes] = useState([]);
  const [filtroPorTipo, setFiltroPorTipo] = useState('');
  const [filtroPorCategoria, setFiltroPorCategoria] = useState('');
  const [filtroPorMes, setFiltroPorMes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [transacaoAtual, setTransacaoAtual] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'transacoes'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setTransacoes(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsub();
  }, [currentUser]);

  const lidarComExclusao = async (id) => {
    if (confirm('Deseja realmente excluir esta transação?')) {
      try {
        await deleteDoc(doc(db, 'transacoes', id));
        showSuccess('Transação excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        showError('Erro ao excluir a transação. Tente novamente.');
      }
    }
  };

  const transacoesFiltradas = transacoes.filter((t) => {
    const data = t.timestamp?.toDate
      ? t.timestamp.toDate()
      : t.timestamp instanceof Date
      ? t.timestamp
      : null;
    const mes = data
      ? `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
      : '';

    return (
      (!filtroPorTipo || t.tipo === filtroPorTipo) &&
      (!filtroPorCategoria || t.categoria === filtroPorCategoria) &&
      (!filtroPorMes || mes === filtroPorMes)
    );
  });

  const receitas = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);

  const despesas = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = receitas - despesas;

  const limparFiltros = () => {
    setFiltroPorCategoria('');
    setFiltroPorMes('');
    setFiltroPorTipo('');
  };

  const hasActiveFilters = filtroPorTipo || filtroPorCategoria || filtroPorMes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        {/* Dashboard Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {/* Receita Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Receitas</p>
                <p className="text-2xl lg:text-3xl font-bold">R$ {receitas.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          {/* Despesa Card */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Despesas</p>
                <p className="text-2xl lg:text-3xl font-bold">R$ {despesas.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">📉</span>
              </div>
            </div>
          </div>

          {/* Saldo Card */}
          <div className={`p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 ${
            saldo > 0
              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
              : saldo < 0
              ? 'bg-gradient-to-r from-orange-500 to-orange-600'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  saldo > 0 ? 'text-blue-100' : saldo < 0 ? 'text-orange-100' : 'text-gray-100'
                }`}>Saldo Total</p>
                <p className="text-2xl lg:text-3xl font-bold">R$ {saldo.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <span className="text-2xl">{saldo >= 0 ? '💰' : '⚠️'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
              hasActiveFilters 
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="text-lg">🔍</span>
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                Ativo
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={limparFiltros}
              className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Transactions List */}
        <div className="space-y-4 pb-24">
          {transacoesFiltradas.map((t) => {
            const data = t.timestamp?.toDate ? t.timestamp.toDate() : null;
            return (
              <div
                key={t.id}
                className={`p-4 lg:p-6 rounded-2xl shadow-lg border-l-4 transform hover:scale-[1.02] transition-all duration-300 ${
                  t.tipo === 'receita' 
                    ? 'bg-white border-l-emerald-500 hover:shadow-emerald-100' 
                    : 'bg-white border-l-red-500 hover:shadow-red-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        t.tipo === 'receita' ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        <span className="text-sm">
                          {t.tipo === 'receita' ? '💰' : '💸'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{t.descricao}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded-full">{t.categoria}</span>
                          <span className={`font-semibold ${
                            t.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            R$ {t.valor.toFixed(2)}
                          </span>
                          {data && (
                            <span className="text-gray-500">
                              {data.toLocaleDateString('pt-BR')} às{' '}
                              {data.toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:flex-col lg:flex-row">
                    <button
                      onClick={() => {
                        setTransacaoAtual(t);
                        setShowModal(true);
                      }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <span>✏️</span>
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => lidarComExclusao(t.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <span>🗑️</span>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {transacoesFiltradas.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-gray-600">
                {transacoes.length === 0
                  ? 'Adicione sua primeira transação para começar!'
                  : 'Tente ajustar os filtros para encontrar o que procura'}
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setTransacaoAtual(null);
            setShowModal(true);
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 py-4 font-semibold shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 z-50"
        >
          <span className="text-xl">➕</span>
          <span className="hidden sm:inline">Nova Transação</span>
        </button>

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>🔍</span>
                    Filtros
                  </h2>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Tipo Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Transação
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={filtroPorTipo}
                      onChange={(e) => setFiltroPorTipo(e.target.value)}
                    >
                      <option value="">Todos os tipos</option>
                      <option value="receita">💰 Receita</option>
                      <option value="despesa">💸 Despesa</option>
                    </select>
                  </div>

                  {/* Categoria Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={filtroPorCategoria}
                      onChange={(e) => setFiltroPorCategoria(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      <option value="Alimentação">🍽️ Alimentação</option>
                      <option value="Transporte">🚗 Transporte</option>
                      <option value="Lazer">🎮 Lazer</option>
                      <option value="Outro">📋 Outro</option>
                    </select>
                  </div>

                  {/* Month Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mês
                    </label>
                    <input
                      type="month"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={filtroPorMes}
                      min="1900-01"
                      max="2100-12"
                      onChange={(e) => setFiltroPorMes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={limparFiltros}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Form Modal */}
        <Formulario
          transacaoAtual={transacaoAtual}
          setTransacaoAtual={setTransacaoAtual}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </div>
  );
}
