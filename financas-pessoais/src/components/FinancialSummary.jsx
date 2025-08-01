import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

function FinancialSummary({ summary }) {
  const { totalReceitas, totalDespesas, saldo } = summary;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSaldoColor = () => {
    if (saldo > 0) return 'text-green-600';
    if (saldo < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSaldoBgColor = () => {
    if (saldo > 0) return 'bg-green-50 border-green-200';
    if (saldo < 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Receitas */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total de Receitas</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceitas)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Despesas */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total de Despesas</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDespesas)}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Saldo */}
      <div className={`bg-white rounded-lg shadow-sm p-6 border ${getSaldoBgColor()}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Saldo Atual</p>
            <p className={`text-2xl font-bold ${getSaldoColor()}`}>
              {formatCurrency(saldo)}
            </p>
            {saldo < 0 && (
              <p className="text-xs text-red-500 mt-1">Saldo negativo</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${
            saldo > 0 ? 'bg-green-100' : saldo < 0 ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <DollarSign className={`h-6 w-6 ${getSaldoColor()}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialSummary;