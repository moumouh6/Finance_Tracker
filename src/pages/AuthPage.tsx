import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 flex-col justify-center items-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block p-4 bg-white bg-opacity-10 rounded-full mb-4">
              <Wallet size={48} />
            </div>
            <h1 className="text-4xl font-bold mb-2">FinTrack</h1>
            <p className="text-xl font-light">Your personal finance companion</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
              <p className="text-white text-opacity-80">
                Log your daily expenses and income to gain insights into your spending habits.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Set Budgets</h3>
              <p className="text-white text-opacity-80">
                Create monthly budgets for different categories to help manage your finances.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Visualize Data</h3>
              <p className="text-white text-opacity-80">
                Get insightful charts and reports to understand where your money goes.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo (visible on small screens) */}
          <div className="md:hidden flex items-center justify-center mb-8">
            <div className="flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mr-3">
              <Wallet size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">FinTrack</h1>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            {isLogin ? (
              <LoginForm onToggleForm={toggleForm} />
            ) : (
              <SignupForm onToggleForm={toggleForm} />
            )}
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            By using FinTrack, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;