import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, FileText, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Transaction, Category } from '../../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Transaction;
  categories: Category[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  categories
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set initial values if editing an existing transaction
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setType(initialData.type);
      setCategoryId(initialData.categoryId);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title,
      amount: Number(amount),
      date,
      type,
      categoryId,
      notes: notes.trim() || undefined
    });
  };

  const categoryOptions = categories
    .filter(category => {
      // Show all categories for expenses
      // For income, only show income categories or "Other"
      if (type === 'expense') return true;
      return category.name === 'Salary' || 
             category.name === 'Investments' || 
             category.name === 'Other';
    })
    .map(category => ({
      value: category.id,
      label: category.name
    }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              label="Title"
              placeholder="e.g., Grocery Shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              fullWidth
            />
          </div>
          <div className="flex-1">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              fullWidth
              leftIcon={<DollarSign size={18} />}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              fullWidth
              leftIcon={<Calendar size={18} />}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <div className="flex rounded-md overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        <Select
          label="Category"
          options={categoryOptions}
          value={categoryId}
          onChange={(value) => setCategoryId(value)}
          error={errors.categoryId}
          fullWidth
        />

        <div>
          <Input
            label="Notes (Optional)"
            placeholder="Add any additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            leftIcon={<FileText size={18} />}
            multiline
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <Button type="submit" variant="primary" fullWidth>
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;