import React, { useState } from 'react';
import { User, Mail, Lock, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // This is a mock implementation
    if (username.trim() && email.trim()) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    // This is a mock implementation
    setSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // This is a mock implementation
      logout();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>

      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <Card title="Profile Settings">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<User size={18} />}
            fullWidth
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            fullWidth
          />

          <Button type="submit" variant="primary">
            Update Profile
          </Button>
        </form>
      </Card>

      <Card title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            fullWidth
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            fullWidth
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            fullWidth
          />

          <Button type="submit" variant="primary">
            Change Password
          </Button>
        </form>
      </Card>

      <Card title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              Dark Mode
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toggle between light and dark theme
            </p>
          </div>
          <div className="relative inline-block w-12 mr-2 align-middle select-none">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
              style={{
                transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0)',
                borderColor: theme === 'dark' ? '#3B82F6' : '#D1D5DB'
              }}
            />
            <label
              className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></label>
          </div>
        </div>
      </Card>

      <Card title="Danger Zone" className="border-red-200 dark:border-red-800">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;