import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: string;
  createdDate: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Cardio Equipment',
      description: 'Treadmills, bikes, ellipticals and other cardio machines',
      productCount: 15,
      status: 'Active',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Strength Training',
      description: 'Weight machines, dumbbells, and strength equipment',
      productCount: 25,
      status: 'Active',
      createdDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Yoga & Pilates',
      description: 'Mats, blocks, straps and yoga accessories',
      productCount: 12,
      status: 'Active',
      createdDate: '2024-01-08'
    },
    {
      id: '4',
      name: 'Accessories',
      description: 'Water bottles, towels, and other fitness accessories',
      productCount: 8,
      status: 'Inactive',
      createdDate: '2024-01-05'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCategories(prev => [...prev, newCategory]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: 'Active' });
    setEditingCategory(null);
    setShowModal(false);
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setShowModal(true);
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Organize your product categories</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(category.status)}`}>
                {category.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{category.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Products:</span>
                <span className="font-medium">{category.productCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium">{new Date(category.createdDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => editCategory(category)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteCategory(category.id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;