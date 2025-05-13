import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { Transaction, Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface SpendingByCategoryProps {
  transactions: Transaction[];
  categories: Category[];
  totalExpenses: number;
}

interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

const SpendingByCategory: React.FC<SpendingByCategoryProps> = ({ 
  transactions, 
  categories,
  totalExpenses
}) => {
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);

  useEffect(() => {
    // Get only expense transactions
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group transactions by category and calculate totals
    const spendingByCategory: Record<string, number> = {};
    
    expenseTransactions.forEach(transaction => {
      const { categoryId, amount } = transaction;
      
      if (!spendingByCategory[categoryId]) {
        spendingByCategory[categoryId] = 0;
      }
      
      spendingByCategory[categoryId] += amount;
    });
    
    // Convert to array with category details and percentage
    const spendingData = Object.entries(spendingByCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      return {
        categoryId,
        categoryName: category?.name || 'Unknown',
        categoryColor: category?.color || '#607D8B',
        amount,
        percentage
      };
    });
    
    // Sort by amount (descending)
    spendingData.sort((a, b) => b.amount - a.amount);
    
    setCategorySpending(spendingData);
  }, [transactions, categories, totalExpenses]);

  return (
    <Card title="Spending by Category">
      {categorySpending.length > 0 ? (
        <div className="space-y-4">
          {categorySpending.map((category) => (
            <div key={category.categoryId}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.categoryColor }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.categoryName}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatCurrency(category.amount)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${category.percentage}%`, 
                    backgroundColor: category.categoryColor 
                  }}
                ></div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {category.percentage.toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No expense data available
        </div>
      )}
    </Card>
  );
};

export default SpendingByCategory;