import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, DollarSign, Tag, PieChart, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/transactions', label: 'Transactions', icon: <DollarSign size={20} /> },
    { to: '/categories', label: 'Categories', icon: <Tag size={20} /> },
    { to: '/budgets', label: 'Budgets', icon: <BarChart2 size={20} /> },
    { to: '/reports', label: 'Reports', icon: <PieChart size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-20 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;