import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/helpers';

interface BalanceCardProps {
  income: number;
  expenses: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ income, expenses }) => {
  const balance = income - expenses;
  const isPositive = balance >= 0;

  return (
    <Card>
      <div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Current Balance</h3>
        <p 
          className={`text-3xl font-bold mt-2 ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Income</span>
          <div className="flex items-center mt-1">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {formatCurrency(income)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</span>
          <div className="flex items-center mt-1">
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {formatCurrency(expenses)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;