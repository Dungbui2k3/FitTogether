import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { productService } from '../services/productService';
import { useToast } from '../hooks';
import type { Product } from '../types/product';

const ProductsPage: React.FC = () => {
  const { error: showError } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 12; // Products per page

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProducts({
        page: currentPage,
        limit: limit,
        search: searchTerm || undefined,
      });

      if (response.success && response.data) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
        setTotalProducts(response.data.pagination.total);
      } else {
        setError('Không thể tải danh sách sản phẩm');
        showError('Không thể tải danh sách sản phẩm');
      }
    } catch (err) {
      setError('Lỗi khi tải sản phẩm');
      showError('Lỗi khi tải sản phẩm');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tất Cả Sản Phẩm
            </h1>
          </div>
          
          {/* Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Products Grid/List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadProducts}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView3D={() => {}}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Không tìm thấy sản phẩm nào phù hợp với từ khóa tìm kiếm.' : 'Hiện tại chưa có sản phẩm nào.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}

        {/* Loading indicator for pagination */}
        {loading && currentPage > 1 && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;