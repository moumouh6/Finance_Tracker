import React, { useState, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, getMonthName } from '../utils/helpers';

const ReportsPage: React.FC = () => {
  const { transactions, categories } = useFinance();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState<any>({
    income: 0,
    expenses: 0,
    categoryExpenses: {}
  });

  // Generate year options (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: getMonthName(i + 1)
  }));

  useEffect(() => {
    // Filter transactions for selected month and year
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        date.getFullYear() === selectedYear &&
        date.getMonth() + 1 === selectedMonth
      );
    });

    // Calculate totals
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate expenses by category
    const categoryExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, t) => {
        const category = categories.find(c => c.id === t.categoryId);
        if (category) {
          if (!acc[category.name]) {
            acc[category.name] = {
              amount: 0,
              color: category.color
            };
          }
          acc[category.name].amount += t.amount;
        }
        return acc;
      }, {});

    setMonthlyData({ income, expenses, categoryExpenses });
  }, [selectedYear, selectedMonth, transactions, categories]);

  const handleExport = () => {
    // Convert data to CSV format
    const rows = [
      ['Category', 'Amount'],
      ['Total Income', monthlyData.income],
      ['Total Expenses', monthlyData.expenses],
      ['Net Income', monthlyData.income - monthlyData.expenses],
      [''], // Empty row for separation
      ['Expenses by Category'],
      ...Object.entries(monthlyData.categoryExpenses).map(([category, data]: [string, any]) => [
        category,
        data.amount
      ])
    ];

    const csvContent = rows
      .map(row => row.join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financial_report_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Year"
              options={yearOptions}
              value={selectedYear.toString()}
              onChange={(value) => setSelectedYear(Number(value))}
              fullWidth
            />
          </div>
          <div className="flex-1">
            <Select
              label="Month"
              options={monthOptions}
              value={selectedMonth.toString()}
              onChange={(value) => setSelectedMonth(Number(value))}
              fullWidth
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Income
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(monthlyData.income)}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(monthlyData.expenses)}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Net Income
          </h3>
          <p className={`text-3xl font-bold ${
            monthlyData.income - monthlyData.expenses >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(monthlyData.income - monthlyData.expenses)}
          </p>
        </Card>
      </div>

      <Card title="Expenses by Category">
        <div className="space-y-4">
          {Object.entries(monthlyData.categoryExpenses).map(([category, data]: [string, any]) => (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: data.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatCurrency(data.amount)}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(data.amount / monthlyData.expenses) * 100}%`,
                    backgroundColor: data.color
                  }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {((data.amount / monthlyData.expenses) * 100).toFixed(1)}% of total expenses
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;