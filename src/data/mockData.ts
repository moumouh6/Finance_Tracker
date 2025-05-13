import { Transaction, Category, Budget } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF5722', icon: 'utensils' },
  { id: '2', name: 'Transportation', color: '#2196F3', icon: 'car' },
  { id: '3', name: 'Housing', color: '#4CAF50', icon: 'home' },
  { id: '4', name: 'Entertainment', color: '#9C27B0', icon: 'tv' },
  { id: '5', name: 'Utilities', color: '#FFC107', icon: 'zap' },
  { id: '6', name: 'Healthcare', color: '#E91E63', icon: 'heart' },
  { id: '7', name: 'Salary', color: '#3F51B5', icon: 'briefcase' },
  { id: '8', name: 'Investments', color: '#009688', icon: 'trending-up' },
  { id: '9', name: 'Gifts', color: '#795548', icon: 'gift' },
  { id: '10', name: 'Other', color: '#607D8B', icon: 'more-horizontal' }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.75,
    date: '2025-04-05',
    type: 'expense',
    categoryId: '1',
    notes: 'Weekly groceries from Whole Foods'
  },
  {
    id: '2',
    title: 'Monthly Salary',
    amount: 3500,
    date: '2025-04-01',
    type: 'income',
    categoryId: '7',
    notes: 'Monthly salary deposit'
  },
  {
    id: '3',
    title: 'Rent Payment',
    amount: 1200,
    date: '2025-04-03',
    type: 'expense',
    categoryId: '3',
    notes: 'Monthly rent'
  },
  {
    id: '4',
    title: 'Electric Bill',
    amount: 95.40,
    date: '2025-04-10',
    type: 'expense',
    categoryId: '5',
    notes: 'Monthly electricity'
  },
  {
    id: '5',
    title: 'Uber Ride',
    amount: 24.50,
    date: '2025-04-12',
    type: 'expense',
    categoryId: '2',
    notes: 'Trip to downtown'
  },
  {
    id: '6',
    title: 'Freelance Project',
    amount: 750,
    date: '2025-04-15',
    type: 'income',
    categoryId: '7',
    notes: 'Website development project'
  },
  {
    id: '7',
    title: 'Movie Tickets',
    amount: 32.00,
    date: '2025-04-16',
    type: 'expense',
    categoryId: '4',
    notes: 'Movie night with friends'
  },
  {
    id: '8',
    title: 'Dividend Payment',
    amount: 120.75,
    date: '2025-04-20',
    type: 'income',
    categoryId: '8',
    notes: 'Quarterly stock dividends'
  }
];

export const MOCK_BUDGETS: Budget[] = [
  { id: '1', month: 4, year: 2025, amount: 500, categoryId: '1' },
  { id: '2', month: 4, year: 2025, amount: 300, categoryId: '2' },
  { id: '3', month: 4, year: 2025, amount: 1300, categoryId: '3' },
  { id: '4', month: 4, year: 2025, amount: 200, categoryId: '4' },
  { id: '5', month: 4, year: 2025, amount: 150, categoryId: '5' },
  { id: '6', month: 4, year: 2025, amount: 100, categoryId: '6' }
];