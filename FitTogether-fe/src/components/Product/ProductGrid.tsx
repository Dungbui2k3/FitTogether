import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';


const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: 1,
          limit: 6, // Show 6 featured products
        });

        if (response.success && response.data) {
          setProducts(response.data.products);
        } else {
          setError('Không thể tải danh sách sản phẩm');
        }
      } catch (err) {
        setError('Lỗi khi tải sản phẩm');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sản Phẩm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Nổi Bật</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá bộ sưu tập phụ kiện thể thao chất lượng cao, được thiết kế để nâng cao hiệu suất tập luyện của bạn.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fit Together – Đồng hành cùng bạn trên từng trận đấu
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Fit Together
            </span>
            {" – "}
            <span className="text-gray-800">
              Đồng hành cùng bạn trên từng trận đấu
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            <span className="text-gray-600 font-semibold">FitTogether</span> - nơi cung cấp cho bạn những
            <span className="text-gray-600 font-semibold"> sản phẩm thể thao</span> và
            <span className="text-gray-600 font-semibold"> sân chơi chất lượng</span> hàng đầu.
          </p>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView3D={() => {}} // Empty function since we removed 3D modal
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau!</p>
          </div>
        )}
        
        {/* <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
            Xem tất cả sản phẩm
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default ProductGrid;