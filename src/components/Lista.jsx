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
  const [showFiltros, setShowFiltros] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 max-w-xl mx-auto px-4 py-6 space-y-6">
      <Header />

      {}
      <div className="bg-green-100 border border-green-300 p-4 rounded-xl shadow space-y-2 text-center">
        <div className="flex justify-around text-sm">
          <div className="text-green-600 font-medium">
            Receita: R$ {receitas.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-red-100 border border-red-300 p-4 rounded-xl shadow space-y-2 text-center">
        <div className="flex justify-around text-sm">
          <div className="text-red-600 font-medium">
            Despesa: R$ {despesas.toFixed(2)}
          </div>
        </div>
      </div>

      <div
        className={`p-4 rounded-xl shadow space-y-2 text-center border ${
          saldo > 0
            ? 'bg-emerald-100 border-emerald-300'
            : saldo < 0
            ? 'bg-red-100 border-red-300'
            : 'bg-gray-200 border-gray-300'
        }`}
      >
        <div className="flex justify-around text-sm">
          <div
            className={`font-semibold ${
              saldo > 0
                ? 'text-emerald-700'
                : saldo < 0
                ? 'text-red-700'
                : 'text-gray-600'
            }`}
          >
            Saldo: R$ {saldo.toFixed(2)}
          </div>
        </div>
      </div>
      {/* Botão de Filtro */}
      <div className="bg-white p-4 rounded-xl shadow">
        <button
          onClick={() => setShowFiltros(!showFiltros)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          🔍 Filtro
          <span className={`transform transition-transform ${showFiltros ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {/* Opções de Filtro */}
        {showFiltros && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={filtroPorTipo}
                onChange={(e) => setFiltroPorTipo(e.target.value)}
              >
                <option value="">Todos </option>
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>

              <select
                className="border rounded px-3 py-2 text-sm"
                value={filtroPorCategoria}
                onChange={(e) => setFiltroPorCategoria(e.target.value)}
              >
                <option value="">Todas as Categorias</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Outro">Outro</option>
              </select>

              <input
                type="month"
                className="border rounded px-3 py-2 text-sm"
                value={filtroPorMes}
                min="1900-01"
                max="2100-12"
                onChange={(e) => setFiltroPorMes(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setFiltroPorCategoria('');
                setFiltroPorMes('');
                setFiltroPorTipo('');
              }}
              className="bg-blue-500 text-white p-3 rounded-lg px-5 py-2 w-full text-sm hover:bg-blue-600 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {}
      <div className="space-y-4 pb-24">
        {transacoesFiltradas.map((t) => {
          const data = t.timestamp?.toDate ? t.timestamp.toDate() : null;
          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl shadow-md flex justify-between items-start ${
                t.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div>
                <p className="font-medium text-base">{t.descricao}</p>
                <p className="text-sm text-gray-700">
                  {t.categoria} • R$ {t.valor.toFixed(2)}{' '}
                  {data
                    ? `• ${data.toLocaleDateString(
                        'pt-BR'
                      )} ${data.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : ''}
                </p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => {
                    setTransacaoAtual(t);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:underline"
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  onClick={() => lidarComExclusao(t.id)}
                  className="text-red-600 hover:underline"
                  title="Excluir"
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}

        {transacoesFiltradas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">📊</p>
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm">
              {transacoes.length === 0
                ? 'Adicione sua primeira transação!'
                : 'Tente ajustar os filtros'}
            </p>
          </div>
        )}
      </div>

      {}
      <button
        onClick={() => {
          setTransacaoAtual(null);
          setShowModal(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition"
      >
        ➕ Nova Transação
      </button>

      {}
      <Formulario
        transacaoAtual={transacaoAtual}
        setTransacaoAtual={setTransacaoAtual}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
}
