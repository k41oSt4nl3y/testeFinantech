import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import FinancialSummary from '../components/FinancialSummary';
import Header from '../components/Header';
import Filters from '../components/Filters';
import { Plus } from 'lucide-react';

function Dashboard() {
  const { currentUser } = useAuth();
  const { transactions, loading, getFinancialSummary } = useTransactions();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  // Filtrar transações baseado nos filtros aplicados
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesCategory = !filters.category || transaction.category === filters.category;
    const matchesSearch = !filters.search || 
      transaction.description.toLowerCase().includes(filters.search.toLowerCase());

    let matchesDate = true;
    if (filters.startDate && filters.endDate) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      matchesDate = transactionDate >= startDate && transactionDate <= endDate;
    }

    return matchesType && matchesCategory && matchesSearch && matchesDate;
  });

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Resumo Financeiro */}
        <FinancialSummary summary={getFinancialSummary()} />

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
          <Filters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Lista de Transações */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Transações ({filteredTransactions.length})
              </h2>
              <button
                onClick={handleAddTransaction}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Transação</span>
              </button>
            </div>
          </div>
          
          <TransactionList 
            transactions={filteredTransactions}
            onEdit={handleEditTransaction}
          />
        </div>
      </main>

      {/* Modal do Formulário */}
      {showTransactionForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default Dashboard;