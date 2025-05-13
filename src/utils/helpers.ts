// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get month name from month number (1-12)
export const getMonthName = (month: number): string => {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleString('en-US', { month: 'long' });
};

// Calculate total income from transactions
export const calculateTotalIncome = (transactions: { amount: number; type: string }[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate total expenses from transactions
export const calculateTotalExpenses = (transactions: { amount: number; type: string }[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate balance (income - expenses)
export const calculateBalance = (transactions: { amount: number; type: string }[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

// Calculate budget usage percentage
export const calculateBudgetUsage = (
  spent: number,
  budgetAmount: number
): number => {
  if (budgetAmount <= 0) return 0;
  const percentage = (spent / budgetAmount) * 100;
  return Math.min(percentage, 100); // Cap at 100%
};

// Get current month's transactions
export const getCurrentMonthTransactions = (transactions: { date: string }[]): any[] => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = now.getFullYear();
  
  return transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
  });
};

// Group transactions by category
export const groupTransactionsByCategory = (
  transactions: { categoryId: string; amount: number; type: string }[]
): Record<string, number> => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((groups, transaction) => {
      const { categoryId, amount } = transaction;
      if (!groups[categoryId]) {
        groups[categoryId] = 0;
      }
      groups[categoryId] += amount;
      return groups;
    }, {} as Record<string, number>);
};

// Get category color
export const getCategoryColor = (categoryId: string, categories: { id: string; color: string }[]): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.color : '#607D8B'; // Default color
};

// Get category name
export const getCategoryName = (categoryId: string, categories: { id: string; name: string }[]): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Uncategorized';
};