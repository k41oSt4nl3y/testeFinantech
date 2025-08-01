import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';

function TransactionList({ transactions, onEdit }) {
  const { deleteTransaction } = useTransactions();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDelete = async (transaction) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a transação "${transaction.description}"?`
    );
    
    if (confirmDelete) {
      const result = await deleteTransaction(transaction.id);
      if (result.success) {
        alert('Transação excluída com sucesso!');
      } else {
        alert('Erro ao excluir transação: ' + result.error);
      }
    }
  };

  const getTypeColor = (type) => {
    return type === 'receita' ? 'text-green-600' : 'text-red-600';
  };

  const getTypeBgColor = (type) => {
    return type === 'receita' ? 'bg-green-50' : 'bg-red-50';
  };

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mb-4">
          <Calendar className="h-12 w-12 mx-auto text-gray-300" />
        </div>
        <p className="text-lg font-medium mb-2">Nenhuma transação encontrada</p>
        <p className="text-sm">Adicione sua primeira transação para começar!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            {/* Informações da transação */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBgColor(transaction.type)} ${getTypeColor(transaction.type)}`}>
                  {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Tag className="h-3 w-3 mr-1" />
                  {transaction.category}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(transaction.date)}
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </h3>
              
              <p className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                {transaction.type === 'receita' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </p>
            </div>

            {/* Ações */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar transação"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => handleDelete(transaction)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir transação"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;