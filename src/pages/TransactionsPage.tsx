import React, { useState } from 'react';
import TransactionsList from '../components/transactions/TransactionsList';
import TransactionForm from '../components/transactions/TransactionForm';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types';

const TransactionsPage: React.FC = () => {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleSubmit = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {isFormOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <TransactionForm
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            initialData={editingTransaction || undefined}
            categories={categories}
          />
        </div>
      ) : (
        <TransactionsList
          transactions={transactions}
          categories={categories}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TransactionsPage;