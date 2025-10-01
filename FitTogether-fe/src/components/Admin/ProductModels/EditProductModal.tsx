import React, { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { productService } from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { useToast } from '../../../hooks';
import type { Product } from '../../../types/product';
import type { Category } from '../../../types/category';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({});

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await categoryService.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          error('Failed to load categories');
        }
      } catch (err) {
        error('Error loading categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, error]);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        nation: product.nation,
        category: product.category,
        digitalPrice: product.digitalPrice,
        physicalPrice: product.physicalPrice,
        quantity: product.quantity,
        currency: product.currency,
        available: product.available,
        material: product.material,
        layerHeight: product.layerHeight,
        printTime: product.printTime,
        dimensions: product.dimensions,
        urlImgs: product.urlImgs,
      });
      // Initialize preview URLs with existing images from DB
      setPreviewUrls(product.urlImgs || []);
      // Reset removed images when product changes
      setRemovedImages([]);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof NonNullable<typeof formData.dimensions>;
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions!,
          [dimensionKey]: parseFloat(value) || 0,
        },
      }));
    } else if (name === 'material') {
      const materials = value.split(',').map(m => m.trim()).filter(m => m);
      setFormData(prev => ({ ...prev, material: materials }));
    } else if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat._id === value);
      setFormData(prev => ({
        ...prev,
        category: selectedCategory || { _id: '', name: '', description: '' },
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = previewUrls[index];
    
    // Check if it's a new file (blob URL) or existing image from DB
    const isNewFile = imageUrl?.startsWith('blob:');
    
    if (isNewFile) {
      // Remove from new files
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(imageUrl);
    } else {
      // Add to removed images list (existing image from DB)
      setRemovedImages(prev => [...prev, imageUrl]);
    }
    
    // Remove from preview
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsLoading(true);

    try {
      if (!formData.name?.trim()) {
        error("Product name is required");
        return;
      }
      if (!formData.category?._id) {
        error("Please select a category");
        return;
      }

      const formDataToSend = new FormData();

      // append text fields
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description?.trim() || "");
      formDataToSend.append("nation", formData.nation?.trim() || "");
      formDataToSend.append("categoryId", formData.category._id);
      formDataToSend.append("digitalPrice", String(formData.digitalPrice || 0));
      formDataToSend.append("physicalPrice", String(formData.physicalPrice || 0));
      formDataToSend.append("quantity", String(formData.quantity || 0));
      formDataToSend.append("currency", formData.currency || "VND");
      formDataToSend.append("available", String(formData.available));
      formDataToSend.append("layerHeight", formData.layerHeight || "");
      formDataToSend.append("printTime", formData.printTime || "");

      // append materials
      formData.material?.forEach(m => {
        formDataToSend.append("material", m);
      });

      // append dimensions
      formDataToSend.append("dimensions[width]", String(formData.dimensions?.width || 0));
      formDataToSend.append("dimensions[height]", String(formData.dimensions?.height || 0));
      formDataToSend.append("dimensions[depth]", String(formData.dimensions?.depth || 0));

      // append new images (files)
      imageFiles.forEach(file => {
        formDataToSend.append("urlImgs", file); 
      });

      // append removed images (JSON string)
      if (removedImages.length > 0) {
        removedImages.forEach(url => {
          formDataToSend.append("removedImgs", url);
        });
        
      }

      // gửi request
      const result = await productService.updateProduct(product.id, formDataToSend);

      if (result.success) {
        success("✅ Product updated successfully!", 3000);
        onSuccess();
        handleClose();
      } else {
        error(result.error || "Failed to update product");
      }
    } catch (err) {
      error("An error occurred while updating the product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up URL objects to prevent memory leaks
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setFormData({});
    setImageFiles([]);
    setPreviewUrls([]);
    setRemovedImages([]);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nation *
                </label>
                <input
                  type="text"
                  name="nation"
                  value={formData.nation || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Vietnam, USA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Price (VND) *
                </label>
                <input
                  type="number"
                  name="digitalPrice"
                  value={formData.digitalPrice || 0}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Price (VND) *
                </label>
                <input
                  type="number"
                  name="physicalPrice"
                  value={formData.physicalPrice || 0}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity || 0}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency || 'VND'}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Images</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Additional Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop multiple images
                    </span>
                  </label>
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Images ({previewUrls.length} total)
                      </span>
                      <div className="flex space-x-2 text-xs text-gray-500">
                        <span>Current: {previewUrls.filter(url => !url.startsWith('blob:')).length}</span>
                        <span>New: {previewUrls.filter(url => url.startsWith('blob:')).length}</span>
                        {removedImages.length > 0 && (
                          <span className="text-red-500">Removed: {removedImages.length}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {previewUrls.map((url, index) => {
                        const isNewFile = url.startsWith('blob:');
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <div className="absolute top-1 left-1">
                              <span className={`px-1 py-0.5 text-xs rounded ${
                                isNewFile 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-blue-500 text-white'
                              }`}>
                                {isNewFile ? 'New' : 'Current'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category and Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Category & Technical Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.category?._id || ''}
                  onChange={handleInputChange}
                  required
                  disabled={categoriesLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formData.category?.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.category.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Print Time
                </label>
                <input
                  type="text"
                  name="printTime"
                  value={formData.printTime || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 12 hours, 2 days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layer Height
                </label>
                <input
                  type="text"
                  name="layerHeight"
                  value={formData.layerHeight || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 0.2mm, 0.3mm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials (comma separated)
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material?.join(', ') || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PLA, ABS, PETG"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed product description"
            />
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions (cm)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions?.width || 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions?.height || 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Depth</label>
                <input
                  type="number"
                  name="dimensions.depth"
                  value={formData.dimensions?.depth || 0}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Available</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
