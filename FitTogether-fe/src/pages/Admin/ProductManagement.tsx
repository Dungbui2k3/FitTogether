import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { productService } from "../../services/productService";
import categoryService from "../../services/categoryService";
import { useToast } from "../../hooks";
import CreateProductModal from "../../components/Admin/ProductModels/CreateProductModal";
import EditProductModal from "../../components/Admin/ProductModels/EditProductModal";
import type { Product, ProductListParams } from "../../types/product";
import type { Category } from "../../types/category";

interface ProductManagementState {
  products: Product[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  category: string;
  sortBy: "name" | "price" | "rating" | "createdAt";
  sortOrder: "asc" | "desc";
  inStock: boolean | null;
  featured: boolean | null;
  difficulty: string;
}

const ProductManagement: React.FC = () => {
  const { success, error } = useToast();
  const [state, setState] = useState<ProductManagementState>({
    products: [],
    loading: false,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    search: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    inStock: null,
    featured: null,
    difficulty: "",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Load products
  const loadProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const params: ProductListParams = {
        page: state.page,
        limit: state.limit,
        search: state.search || undefined,
        category: state.category || undefined,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        inStock: state.inStock !== null ? state.inStock : undefined,
        featured: state.featured !== null ? state.featured : undefined,
        difficulty:
          (state.difficulty as "easy" | "medium" | "hard") || undefined,
      };

      const response = await productService.getProducts(params);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          products: response.data.products,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
          loading: false,
        }));
      } else {
        error(response.error || "Không thể tải danh sách sản phẩm");
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      error("Có lỗi xảy ra khi tải sản phẩm");
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [
    state.page,
    state.limit,
    state.search,
    state.category,
    state.sortBy,
    state.sortOrder,
    state.inStock,
    state.featured,
    state.difficulty,
    error,
  ]);

  // Load categories on mount
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

    loadCategories();
  }, [error]);

  // Load products on mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle search
  const handleSearch = (value: string) => {
    setState((prev) => ({ ...prev, search: value, page: 1 }));
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setState((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setState((prev) => ({ ...prev, page: newPage }));
  };

  // Handle sorting
  const handleSort = (field: "name" | "price" | "rating" | "createdAt") => {
    setState((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };


  const handleDeleteProduct = async (product_id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setActionLoading((prev) => ({ ...prev, [product_id]: true }));

    try {
      const response = await productService.deleteProduct(product_id);
      if (response.success) {
        success("Xóa sản phẩm thành công");
        loadProducts();
      } else {
        error(response.error || "Xóa thất bại");
      }
    } catch (err) {
      error("Có lỗi xảy ra khi xóa");
    } finally {
      setActionLoading((prev) => ({ ...prev, [product_id]: false }));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm?`
      )
    )
      return;

    try {
      const deletePromises = selectedProducts.map((id) =>
        productService.deleteProduct(id)
      );
      await Promise.all(deletePromises);
      success(`Đã xóa ${selectedProducts.length} sản phẩm thành công`);
      setSelectedProducts([]);
      loadProducts();
    } catch (err) {
      error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === state.products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(state.products.map((p) => p.id));
    }
  };

  const handleSelectProduct = (product_id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product_id)
        ? prev.filter((id) => id !== product_id)
        : [...prev, product_id]
    );
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "VND") => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all 3D products
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={state.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-64">
            <select
              value={state.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={categoriesLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'All Categories'}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              Đã chọn {selectedProducts.length} sản phẩm
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Xóa đã chọn</span>
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === state.products.length &&
                      state.products.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Giá</span>
                    {state.sortBy === "price" && (
                      <span className="text-blue-600">
                        {state.sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Ngày tạo</span>
                    {state.sortBy === "createdAt" && (
                      <span className="text-blue-600">
                        {state.sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Đang tải...</p>
                  </td>
                </tr>
              ) : state.products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không có sản phẩm nào</p>
                  </td>
                </tr>
              ) : (
                state.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={
                              product.urlImgs?.[0] || "/placeholder-image.svg"
                            }
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-image.svg";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.nation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Digital:{" "}
                          {formatCurrency(
                            product.digitalPrice,
                            product.currency
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          Physical:{" "}
                          {formatCurrency(
                            product.physicalPrice,
                            product.currency
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={actionLoading[product.id]}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {state.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(state.page - 1)}
                disabled={state.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange(state.page + 1)}
                disabled={state.page === state.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(state.page - 1) * state.limit + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(state.page * state.limit, state.total)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{state.total}</span> kết quả
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(state.page - 1)}
                    disabled={state.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from(
                    { length: Math.min(5, state.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            state.page === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(state.page + 1)}
                    disabled={state.page === state.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          loadProducts();
        }}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setEditingProduct(null);
          loadProducts();
        }}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductManagement;
