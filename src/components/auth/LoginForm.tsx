import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email or password is incorrect. Please try again.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please confirm your email address before logging in.');
      } else if (err.message.includes('User not found')) {
        setError('No account found with this email. Please sign up.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Welcome Back</h2>
      <p className="text-center text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>

      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          leftIcon={<Mail size={18} />}
          required
        />
      </div>

      <div>
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          leftIcon={<Lock size={18} />}
          required
        />
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        isLoading={isLoading}
      >
        Sign In
      </Button>

      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
        <button
          type="button"
          onClick={onToggleForm}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;