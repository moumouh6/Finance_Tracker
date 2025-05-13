import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, calculateBudgetUsage, getCurrentMonthTransactions } from '../utils/helpers';

const BudgetsPage: React.FC = () => {
  const { budgets, categories, transactions, addBudget, updateBudget, deleteBudget } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  // Get current month's transactions
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);

  const handleAdd = () => {
    setIsEditing(true);
    setEditingBudget(null);
    setAmount('');
    setCategoryId('');
    setError('');
  };

  const handleEdit = (budget: any) => {
    setIsEditing(true);
    setEditingBudget(budget);
    setAmount(budget.amount.toString());
    setCategoryId(budget.categoryId);
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    const today = new Date();
    const budgetData = {
      amount: Number(amount),
      categoryId,
      month: today.getMonth() + 1,
      year: today.getFullYear()
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }

    setIsEditing(false);
  };

  const calculateSpentAmount = (categoryId: string): number => {
    return currentMonthTransactions
      .filter(t => t.categoryId === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Budgets</h1>
        {!isEditing && (
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={handleAdd}
          >
            Add Budget
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h2>

            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <Select
              label="Category"
              options={categories.map(cat => ({
                value: cat.id,
                label: cat.name
              }))}
              value={categoryId}
              onChange={(value) => setCategoryId(value)}
              error={error && !categoryId ? 'Please select a category' : ''}
              fullWidth
            />

            <Input
              label="Budget Amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={error && !amount ? 'Please enter an amount' : ''}
              fullWidth
            />

            <div className="flex space-x-3 pt-2">
              <Button type="submit" variant="primary" fullWidth>
                {editingBudget ? 'Update' : 'Create'} Budget
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const category = categories.find(c => c.id === budget.categoryId);
            const spent = calculateSpentAmount(budget.categoryId);
            const percentage = calculateBudgetUsage(spent, budget.amount);

            return (
              <Card key={budget.id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {category?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monthly Budget
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatCurrency(spent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Budget</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {formatCurrency(budget.amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        percentage >= 100
                          ? 'bg-red-500'
                          : percentage >= 80
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetsPage;