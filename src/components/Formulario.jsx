import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useAuth } from '../contexts/AuthContext';
import { showSuccess, showError } from './Toast';

export default function Formulario({
  transacaoAtual,
  setTransacaoAtual,
  showModal,
  setShowModal,
}) {
  const { currentUser } = useAuth();
  const formInicial = {
    tipo: 'receita',
    descricao: '',
    valor: '',
    categoria: 'Outro',
    data: '',
    hora: '',
  };

  const [form, setForm] = useState(formInicial);

  useEffect(() => {
    if (transacaoAtual) {
      const timestamp = transacaoAtual.timestamp?.toDate();
      const dataFormatada = timestamp
        ? timestamp.toISOString().split('T')[0]
        : '';
      const horaFormatada = timestamp
        ? timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      setForm({
        tipo: transacaoAtual.tipo,
        descricao: transacaoAtual.descricao,
        valor: transacaoAtual.valor.toString(),
        data: dataFormatada,
        hora: horaFormatada,
        categoria: transacaoAtual.categoria,
      });
    } else {
      const agora = new Date();
      const dataHoje = agora.toISOString().split('T')[0];
      const horaAgora = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setForm({ ...formInicial, data: dataHoje, hora: horaAgora });
    }
  }, [transacaoAtual]);

  const criarTimestamp = (data, hora) => {
    const dataHora = new Date(`${data}T${hora}:00`);
    return dataHora;
  };

  const lidarComEnvio = async (e) => {
    e.preventDefault();

    if (!form.descricao.trim() || !form.valor) {
      showError('Preencha todos os campos obrigatórios!');
      return;
    }

    const valor = parseFloat(form.valor);
    if (isNaN(valor) || valor <= 0) {
      showError('Digite um valor válido!');
      return;
    }

    try {
      const dadosTransacao = {
        tipo: form.tipo,
        descricao: form.descricao.trim(),
        valor: valor,
        categoria: form.categoria,
        timestamp: form.data && form.hora
          ? criarTimestamp(form.data, form.hora)
          : serverTimestamp(),
        userId: currentUser.uid,
      };

      if (transacaoAtual) {
        await updateDoc(doc(db, 'transacoes', transacaoAtual.id), dadosTransacao);
        showSuccess('Transação atualizada com sucesso!');
      } else {
        await addDoc(collection(db, 'transacoes'), dadosTransacao);
        showSuccess('Transação adicionada com sucesso!');
      }

      setForm(formInicial);
      setTransacaoAtual(null);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      showError('Erro ao salvar a transação. Tente novamente.');
    }
  };

  const lidarComCancelamento = () => {
    setForm(formInicial);
    setTransacaoAtual(null);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span>{transacaoAtual ? '✏️' : '➕'}</span>
              {transacaoAtual ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <button
              onClick={lidarComCancelamento}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <form onSubmit={lidarComEnvio} className="space-y-6">
            {/* Tipo de Transação */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Transação
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo: 'receita' })}
                  className={`p-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                    form.tipo === 'receita'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">💰</span>
                    <span>Receita</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo: 'despesa' })}
                  className={`p-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                    form.tipo === 'despesa'
                      ? 'bg-red-500 text-white border-red-500 shadow-lg'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">💸</span>
                    <span>Despesa</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Salário, Almoço, Gasolina..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                required
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                  placeholder="0,00"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Alimentação">🍽️ Alimentação</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Lazer">🎮 Lazer</option>
                <option value="Outro">📋 Outro</option>
              </select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={form.hora}
                  onChange={(e) => setForm({ ...form, hora: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={lidarComCancelamento}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`flex-1 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  form.tipo === 'receita'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {transacaoAtual ? 'Atualizar' : 'Adicionar'} {form.tipo}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
