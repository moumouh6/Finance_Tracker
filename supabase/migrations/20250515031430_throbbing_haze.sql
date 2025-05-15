/*
  # Initial Schema Setup for Finance Tracker

  1. New Tables
    - `users` - Stores user profiles
      - `id` (uuid, primary key) - User ID from auth.users
      - `username` (text) - Display name
      - `email` (text) - User's email
      - `created_at` (timestamptz) - Account creation date
      
    - `categories` - Transaction categories
      - `id` (uuid, primary key)
      - `name` (text) - Category name
      - `color` (text) - Color code for UI
      - `icon` (text) - Icon name
      - `user_id` (uuid) - Owner of the category
      - `created_at` (timestamptz)
      
    - `transactions` - Financial transactions
      - `id` (uuid, primary key)
      - `title` (text) - Transaction description
      - `amount` (numeric) - Transaction amount
      - `type` (text) - 'income' or 'expense'
      - `date` (date) - Transaction date
      - `category_id` (uuid) - Reference to categories
      - `user_id` (uuid) - Owner of the transaction
      - `notes` (text) - Optional notes
      - `created_at` (timestamptz)
      
    - `budgets` - Monthly budgets per category
      - `id` (uuid, primary key)
      - `month` (integer) - Budget month (1-12)
      - `year` (integer) - Budget year
      - `amount` (numeric) - Budget amount
      - `category_id` (uuid) - Reference to categories
      - `user_id` (uuid) - Owner of the budget
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create new records
      - Update their own records
      - Delete their own records
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  icon text,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  date date NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  year integer NOT NULL CHECK (year >= 2024),
  amount numeric NOT NULL CHECK (amount > 0),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(month, year, category_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for categories table
CREATE POLICY "Users can read own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for transactions table
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create policies for budgets table
CREATE POLICY "Users can read own budgets"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create budgets"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own budgets"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own budgets"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());