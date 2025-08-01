import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export function useTransactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Escutar mudanças nas transações em tempo real
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setTransactions(transactionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Adicionar nova transação
  const addTransaction = async (transactionData) => {
    try {
      if (!currentUser) throw new Error('Usuário não autenticado');

      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      return { success: false, error: error.message };
    }
  };

  // Atualizar transação
  const updateTransaction = async (transactionId, transactionData) => {
    try {
      if (!currentUser) throw new Error('Usuário não autenticado');

      const transactionRef = doc(db, 'transactions', transactionId);
      await updateDoc(transactionRef, {
        ...transactionData,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return { success: false, error: error.message };
    }
  };

  // Deletar transação
  const deleteTransaction = async (transactionId) => {
    try {
      if (!currentUser) throw new Error('Usuário não autenticado');

      await deleteDoc(doc(db, 'transactions', transactionId));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return { success: false, error: error.message };
    }
  };

  // Calcular resumo financeiro
  const getFinancialSummary = () => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount) || 0;
        
        if (transaction.type === 'receita') {
          acc.totalReceitas += amount;
        } else if (transaction.type === 'despesa') {
          acc.totalDespesas += amount;
        }
        
        return acc;
      },
      { totalReceitas: 0, totalDespesas: 0 }
    );

    summary.saldo = summary.totalReceitas - summary.totalDespesas;
    return summary;
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFinancialSummary
  };
}