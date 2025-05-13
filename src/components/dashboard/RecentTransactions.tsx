import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../ui/Card';
import { Transaction, Category } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  categories 
}) => {
  // Get the most recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  return (
    <Card title="Recent Transactions" noPadding>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => {
            const category = getCategoryById(transaction.categoryId);
            const isIncome = transaction.type === 'income';
            
            return (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      isIncome ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {transaction.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: category?.color }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category?.name} • {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <span 
                  className={`font-semibold ${
                    isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No recent transactions
          </div>
        )}
      </div>

      {recentTransactions.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View All Transactions
          </button>
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;