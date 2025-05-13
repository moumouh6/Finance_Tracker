export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: string;
  notes?: string;
}

export interface Budget {
  id: string;
  month: number;
  year: number;
  amount: number;
  categoryId: string;
}

export type ThemeMode = 'light' | 'dark';