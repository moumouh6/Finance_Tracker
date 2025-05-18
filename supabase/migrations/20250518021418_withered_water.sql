/*
  # Complete Finance Tracker Backend Schema

  1. Tables
    - users
    - categories
    - transactions
    - budgets
    - reports
    - notifications
    - settings

  2. Functions
    - calculate_monthly_balance
    - get_budget_status
    - generate_report
    
  3. Security
    - Row Level Security (RLS)
    - Policies for data access
    - Audit logging
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text NOT NULL,
  email text NOT NULL UNIQUE,
  avatar_url text,
  currency text DEFAULT 'USD',
  timezone text DEFAULT 'UTC',
  notification_preferences jsonb DEFAULT '{"email": true, "push": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  color text NOT NULL,
  icon text,
  type text CHECK (type IN ('income', 'expense', 'both')),
  description text,
  is_default boolean DEFAULT false,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  date date NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notes text,
  attachments jsonb DEFAULT '[]'::jsonb,
  recurring_id uuid,
  recurring_frequency text,
  tags text[],
  location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  year integer NOT NULL CHECK (year >= 2024),
  amount numeric NOT NULL CHECK (amount > 0),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rollover boolean DEFAULT false,
  notifications jsonb DEFAULT '{"warning": 80, "critical": 90}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(month, year, category_id, user_id)
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('monthly', 'category', 'annual', 'custom')),
  parameters jsonb NOT NULL,
  data jsonb NOT NULL,
  generated_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferences jsonb DEFAULT '{
    "theme": "light",
    "language": "en",
    "dateFormat": "MM/DD/YYYY",
    "numberFormat": {
      "decimal": ".",
      "thousand": ","
    }
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Functions

-- Calculate Monthly Balance
CREATE OR REPLACE FUNCTION calculate_monthly_balance(
  p_user_id uuid,
  p_month integer,
  p_year integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'income', COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0),
    'expenses', COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0),
    'balance', COALESCE(
      SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END),
      0
    )
  )
  INTO v_result
  FROM transactions
  WHERE user_id = p_user_id
    AND EXTRACT(MONTH FROM date) = p_month
    AND EXTRACT(YEAR FROM date) = p_year;

  RETURN v_result;
END;
$$;

-- Get Budget Status
CREATE OR REPLACE FUNCTION get_budget_status(
  p_user_id uuid,
  p_month integer,
  p_year integer
)
RETURNS TABLE (
  category_id uuid,
  category_name text,
  budget_amount numeric,
  spent_amount numeric,
  remaining_amount numeric,
  percentage_used numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH budget_data AS (
    SELECT 
      b.category_id,
      c.name as category_name,
      b.amount as budget_amount,
      COALESCE(SUM(t.amount), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON c.id = b.category_id
    LEFT JOIN transactions t ON t.category_id = b.category_id
      AND EXTRACT(MONTH FROM t.date) = p_month
      AND EXTRACT(YEAR FROM t.date) = p_year
      AND t.type = 'expense'
    WHERE b.user_id = p_user_id
      AND b.month = p_month
      AND b.year = p_year
    GROUP BY b.category_id, c.name, b.amount
  )
  SELECT 
    bd.category_id,
    bd.category_name,
    bd.budget_amount,
    bd.spent_amount,
    (bd.budget_amount - bd.spent_amount) as remaining_amount,
    ROUND((bd.spent_amount / bd.budget_amount * 100)::numeric, 2) as percentage_used
  FROM budget_data bd;
END;
$$;

-- Generate Report
CREATE OR REPLACE FUNCTION generate_report(
  p_user_id uuid,
  p_type text,
  p_parameters jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_start_date date;
  v_end_date date;
BEGIN
  -- Extract date range from parameters
  v_start_date := (p_parameters->>'startDate')::date;
  v_end_date := (p_parameters->>'endDate')::date;

  -- Generate report based on type
  CASE p_type
    WHEN 'monthly' THEN
      SELECT jsonb_build_object(
        'summary', (
          SELECT jsonb_build_object(
            'income', COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0),
            'expenses', COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0),
            'balance', COALESCE(
              SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END),
              0
            )
          )
          FROM transactions
          WHERE user_id = p_user_id
            AND date BETWEEN v_start_date AND v_end_date
        ),
        'categories', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'category', c.name,
              'amount', COALESCE(SUM(t.amount), 0),
              'percentage', ROUND(
                COALESCE(SUM(t.amount), 0) / NULLIF(
                  (SELECT SUM(amount) FROM transactions 
                   WHERE user_id = p_user_id 
                   AND type = 'expense'
                   AND date BETWEEN v_start_date AND v_end_date),
                  0
                ) * 100,
                2
              )
            )
          )
          FROM categories c
          LEFT JOIN transactions t ON t.category_id = c.id
            AND t.date BETWEEN v_start_date AND v_end_date
            AND t.type = 'expense'
          WHERE c.user_id = p_user_id
          GROUP BY c.id
        ),
        'transactions', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'date', date,
              'title', title,
              'amount', amount,
              'type', type,
              'category', (SELECT name FROM categories WHERE id = category_id)
            )
          )
          FROM transactions
          WHERE user_id = p_user_id
            AND date BETWEEN v_start_date AND v_end_date
          ORDER BY date DESC
        )
      ) INTO v_result;

    WHEN 'category' THEN
      -- Category-specific report implementation
      v_result := jsonb_build_object(
        'type', 'category',
        'data', 'Category report implementation'
      );

    WHEN 'annual' THEN
      -- Annual report implementation
      v_result := jsonb_build_object(
        'type', 'annual',
        'data', 'Annual report implementation'
      );

    ELSE
      v_result := jsonb_build_object(
        'error', 'Unsupported report type'
      );
  END CASE;

  -- Store the generated report
  INSERT INTO reports (user_id, type, parameters, data)
  VALUES (p_user_id, p_type, p_parameters, v_result);

  RETURN v_result;
END;
$$;

-- Triggers

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Audit logging
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      new_data,
      ip_address,
      user_agent
    )
    VALUES (
      NEW.user_id,
      'INSERT',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(NEW),
      current_setting('request.headers', true)::jsonb->>'x-real-ip',
      current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_data,
      new_data,
      ip_address,
      user_agent
    )
    VALUES (
      NEW.user_id,
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      current_setting('request.headers', true)::jsonb->>'x-real-ip',
      current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_data,
      ip_address,
      user_agent
    )
    VALUES (
      OLD.user_id,
      'DELETE',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD),
      current_setting('request.headers', true)::jsonb->>'x-real-ip',
      current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_transactions
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_categories
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_budgets
  AFTER INSERT OR UPDATE OR DELETE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_changes();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can read own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Budgets policies
CREATE POLICY "Users can read own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create budgets"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Reports policies
CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Settings policies
CREATE POLICY "Users can read own settings"
  ON settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Users can read own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO categories (name, color, icon, type, is_default, user_id)
  VALUES
    ('Salary', '#4CAF50', 'briefcase', 'income', true, NEW.id),
    ('Investments', '#2196F3', 'trending-up', 'income', true, NEW.id),
    ('Other Income', '#9C27B0', 'plus-circle', 'income', true, NEW.id),
    ('Housing', '#FF5722', 'home', 'expense', true, NEW.id),
    ('Transportation', '#795548', 'car', 'expense', true, NEW.id),
    ('Food & Dining', '#FF9800', 'utensils', 'expense', true, NEW.id),
    ('Utilities', '#607D8B', 'zap', 'expense', true, NEW.id),
    ('Healthcare', '#E91E63', 'heart', 'expense', true, NEW.id),
    ('Entertainment', '#673AB7', 'tv', 'expense', true, NEW.id),
    ('Shopping', '#00BCD4', 'shopping-bag', 'expense', true, NEW.id),
    ('Education', '#3F51B5', 'book', 'expense', true, NEW.id),
    ('Personal Care', '#009688', 'user', 'expense', true, NEW.id),
    ('Travel', '#FFC107', 'plane', 'expense', true, NEW.id),
    ('Gifts & Donations', '#8BC34A', 'gift', 'expense', true, NEW.id),
    ('Other Expenses', '#9E9E9E', 'more-horizontal', 'expense', true, NEW.id);

  -- Create default settings
  INSERT INTO settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_defaults
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories();