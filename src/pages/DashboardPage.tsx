import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Card from '../components/ui/Card';
import BalanceCard from '../components/dashboard/BalanceCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import { useFinance } from '../context/FinanceContext';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses,
  getCurrentMonthTransactions,
  getMonthName
} from '../utils/helpers';

const DashboardPage: React.FC = () => {
  const { transactions, categories, budgets } = useFinance();
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState(transactions);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  // Get current month and year
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() is 0-based
  const currentYear = today.getFullYear();

  useEffect(() => {
    // Filter transactions for the current month
    const monthTransactions = getCurrentMonthTransactions(transactions);
    setCurrentMonthTransactions(monthTransactions);
    
    // Calculate totals
    setTotalIncome(calculateTotalIncome(monthTransactions));
    setTotalExpenses(calculateTotalExpenses(monthTransactions));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Overview for {getMonthName(currentMonth)} {currentYear}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <BalanceCard income={totalIncome} expenses={totalExpenses} />
        </div>
        <div className="col-span-1">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Monthly Income</h3>
                <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Budget Status</h3>
                <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">$0 / $0</p>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                Coming Soon
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions 
            transactions={currentMonthTransactions} 
            categories={categories}
          />
        </div>
        <div className="lg:col-span-1">
          <SpendingByCategory 
            transactions={currentMonthTransactions}
            categories={categories}
            totalExpenses={totalExpenses}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;