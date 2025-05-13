import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Category, Budget } from '../types';
import { MOCK_CATEGORIES, MOCK_TRANSACTIONS, MOCK_BUDGETS } from '../data/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedCategories = localStorage.getItem('categories');
    const storedBudgets = localStorage.getItem('budgets');

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [transactions, categories, budgets]);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(item => (item.id === id ? { ...item, ...transaction } : item))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  // Category functions
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: crypto.randomUUID()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prev =>
      prev.map(item => (item.id === id ? { ...item, ...category } : item))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(item => item.id !== id));
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: crypto.randomUUID()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setBudgets(prev =>
      prev.map(item => (item.id === id ? { ...item, ...budget } : item))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(item => item.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};