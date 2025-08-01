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
      setForm(formInicial);
    }
  }, [transacaoAtual]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.descricao.trim()) {
      alert('Por favor, preencha a descrição da transação.');
      return;
    }

    if (
      !form.valor ||
      isNaN(parseFloat(form.valor)) ||
      parseFloat(form.valor) < 0
    ) {
      alert('Por favor, insira um valor válido (maior ou igual a zero).');
      return;
    }

    if (form.data) {
      const [ano] = form.data.split('-');
      if (ano.length > 4 || parseInt(ano) < 1 || parseInt(ano) > 9999) {
        alert('Por favor, insira um ano válido entre 1 e 9999.');
        return;
      }
    }

    let dataHoraCompleta;
    if (form.data) {
      const [ano, mes, dia] = form.data.split('-');
      const [horas, minutos] = (form.hora || '00:00').split(':');
      dataHoraCompleta = new Date(ano, mes - 1, dia, horas, minutos);
    } else {
      dataHoraCompleta = serverTimestamp();
    }

    const dadosTransacao = {
      tipo: form.tipo,
      descricao: form.descricao.trim(),
      categoria: form.categoria,
      valor: parseFloat(form.valor),
      timestamp: dataHoraCompleta,
      userId: currentUser.uid,
    };

    try {
      if (transacaoAtual) {
        const ref = doc(db, 'transacoes', transacaoAtual.id);
        await updateDoc(ref, dadosTransacao);
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

  return (
    <div
      className={`fixed inset-0 bg-black/30 z-50 flex items-center justify-center ${
        showModal ? '' : 'hidden'
      }`}
      onClick={() => setShowModal(false)}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {transacaoAtual ? 'Editar Transação' : 'Nova Transação'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Tipo</label>
            <select
              className="border rounded px-3 py-2"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Data</label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={form.data}
              min="1900-01-01"
              max="2100-12-31"
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Hora</label>
          <input
            type="time"
            className="border rounded px-3 py-2"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Descrição</label>
          <input
            type="text"
            className="border rounded px-3 py-2"
            placeholder="Ex: Salário, Conta de Luz"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Valor</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="border rounded px-3 py-2"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Categoria
            </label>
            <select
              className="border rounded px-3 py-2"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Lazer">Lazer</option>
              <option value="Saúde">Saúde</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between gap-4 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded w-full transition"
          >
            {transacaoAtual ? 'Atualizar' : 'Adicionar'}
          </button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-4 py-2 rounded w-full transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
