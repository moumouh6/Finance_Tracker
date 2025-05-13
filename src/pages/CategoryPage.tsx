import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useFinance } from '../context/FinanceContext';
import { Category } from '../types';

const CategoryPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#607D8B');
  const [error, setError] = useState('');

  const handleAdd = () => {
    setIsEditing(true);
    setEditingCategory(null);
    setName('');
    setColor('#607D8B');
    setError('');
  };

  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect your transactions.')) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, { name, color });
    } else {
      addCategory({ name, color });
    }
    
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Categories</h1>
        {!isEditing && (
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />} 
            onClick={handleAdd}
          >
            Add Category
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            {error && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Category Name"
              placeholder="e.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 border-none rounded cursor-pointer"
                />
                <span className="text-gray-600 dark:text-gray-400">
                  {color}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button type="submit" variant="primary" fullWidth>
                {editingCategory ? 'Update' : 'Create'} Category
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium text-gray-800 dark:text-white">
                  {category.name}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => handleEdit(category)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;