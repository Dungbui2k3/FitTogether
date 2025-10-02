import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  RotateCw,
  Package,    
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  Check,
  X,
  Plus,
  Minus,
  Eye,
} from "lucide-react";
import ProductImage from "../components/ProductImage";
import { productService } from "../services/productService";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../hooks";
import type { Product } from "../types/product";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { success, error: showError } = useToast();
  
  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<"shipping" | "support">("shipping");

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProductById(id);

        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Error loading product");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!product?.urlImgs || product.urlImgs.length <= 1) return;
      
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex(prev => 
          prev === 0 ? product.urlImgs.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex(prev => 
          prev === product.urlImgs.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [product?.urlImgs]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (!product.price) {
      showError("Giá sản phẩm không có sẵn");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      version: 'physical', // Physical sports accessories
      image: product.urlImgs?.[0],
      currency: 'VND', // Default currency
    });

    success(
      `Đã thêm ${quantity} ${product.name} vào giỏ hàng!`
    );
  }, [product, quantity, addToCart, success, showError]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      success("Đã sao chép liên kết vào clipboard!");
    }
  }, [product, success]);


  const nextImage = useCallback(() => {
    if (!product?.urlImgs || product.urlImgs.length <= 1) return;
    setSelectedImageIndex(prev => 
      prev === product.urlImgs.length - 1 ? 0 : prev + 1
    );
  }, [product?.urlImgs]);

  const prevImage = useCallback(() => {
    if (!product?.urlImgs || product.urlImgs.length <= 1) return;
    setSelectedImageIndex(prev => 
      prev === 0 ? product.urlImgs.length - 1 : prev - 1
    );
  }, [product?.urlImgs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đang tải sản phẩm...
          </h1>
          <p className="text-gray-600">Vui lòng đợi trong khi chúng tôi tải thông tin chi tiết</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Không tìm thấy sản phẩm"}
          </h1>
          <p className="text-gray-600 mb-6">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại</span>
          </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? "bg-red-100 text-red-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Thêm vào danh sách yêu thích"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Chia sẻ sản phẩm"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg overflow-hidden group">
              {product.urlImgs && product.urlImgs.length > 0 ? (
                <img
                  src={product.urlImgs[selectedImageIndex]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                  }}
                />
              ) : (
                <ProductImage
                  productType="equipment"
                  className="w-full h-full"
                />
              )}
              
              {/* Image navigation */}
              {product.urlImgs && product.urlImgs.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Ảnh tiếp theo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Product info overlay */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                <div className="font-semibold">{product.name}</div>
                <div className="text-xs opacity-90 flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Xem chi tiết sản phẩm</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoRotate 
                      ? "bg-blue-600 text-white"
                      : "bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100"
                  }`}
                  title="Xem ảnh 360°"
                >
                  <RotateCw className={`h-5 w-5 ${autoRotate ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Image counter */}
              {product.urlImgs && product.urlImgs.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                  {selectedImageIndex + 1} / {product.urlImgs.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.urlImgs && product.urlImgs.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.urlImgs.slice(0, 8).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all ${
                      selectedImageIndex === index 
                        ? "ring-2 ring-blue-500 ring-offset-2" 
                        : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Purchase */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{product.nation}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    (!product.isDeleted && product.quantity > 0)
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {(!product.isDeleted && product.quantity > 0) ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Còn hàng
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Hết hàng
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category?.name || 'Tổng quát'}
              </span>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả sản phẩm
              </h3>
              <div className="text-gray-700 leading-relaxed">
                <p className={showFullDescription ? "" : "line-clamp-3"}>
                {product.description}
              </p>
                {product.description && product.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-flex items-center space-x-1"
                  >
                    <span>{showFullDescription ? "Thu gọn" : "Xem thêm"}</span>
                    <ChevronRight className={`h-3 w-3 transition-transform ${showFullDescription ? "rotate-90" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Product Price */}
            <div>
              <div className="">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900 mb-30">Giá sản phẩm:</span>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: 'VND',
                    }).format(product.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selection */}
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Số lượng
                </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-3 text-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.quantity} có sẵn
                </span>
                </div>
              </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">
                  Tổng cộng ({quantity} sản phẩm):
                </span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: 'VND',
                      }).format(product.price * quantity)}
                  </div>
                  {quantity > 1 && (
                  <div className="text-sm text-gray-600 mt-1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: 'VND',
                    }).format(product.price)} × {quantity} sản phẩm
                  </div>
                )} 
                </div>
              </div>

              {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                disabled={isInCart(product.id, 'physical') || product.isDeleted || product.quantity <= 0}
                className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-lg ${
                  isInCart(product.id, 'physical')
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : (product.isDeleted || product.quantity <= 0)
                    ? "bg-red-400 text-red-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
                >
                  <ShoppingCart className="h-5 w-5" />
              <span>
                  {(product.isDeleted || product.quantity <= 0)
                    ? "Hết hàng"
                    : isInCart(product.id, 'physical')
                    ? "Đã có trong giỏ"
                    : "Thêm vào giỏ hàng"}
              </span>
                </button>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "shipping", label: "Vận chuyển", icon: Truck },
                { id: "support", label: "Hỗ trợ", icon: Shield },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin vận chuyển</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Tùy chọn giao hàng</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <span className="font-medium text-blue-900">Giao hàng tiêu chuẩn</span>
                          <p className="text-sm text-blue-700">3-5 ngày làm việc • Miễn phí từ 1.000.000đ</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                          <span className="font-medium text-green-900">Giao hàng nhanh</span>
                          <p className="text-sm text-green-700">1-2 ngày làm việc • Phí 300.000đ</p>
                </div>
              </div>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                          <span className="font-medium text-purple-900">Giao hàng siêu tốc</span>
                          <p className="text-sm text-purple-700">Trong ngày tại TP.HCM và Hà Nội • Phí 50.000đ</p>
                        </div>
                      </div>
                </div>
              </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Tính năng vận chuyển</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Đóng gói cẩn thận</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Theo dõi đơn hàng</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Kiểm tra hàng trước khi nhận</span>
                      </div>
              <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Đổi trả miễn phí</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hỗ trợ khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Dịch vụ hỗ trợ</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Hỗ trợ khách hàng 24/7</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Chính sách đổi trả 30 ngày</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700">Tư vấn sản phẩm miễn phí</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">Hướng dẫn sử dụng chi tiết</span>
                      </div>
              <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">Cộng đồng thể thao FitTogether</span>
                      </div>
                    </div>
                  </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Thông tin liên hệ</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">Hỗ trợ Email</p>
                        <p className="text-sm text-gray-600">support@fittogether.com</p>
                        <p className="text-xs text-gray-500">Phản hồi trong vòng 24 giờ</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">Chat trực tuyến</p>
                        <p className="text-sm text-gray-600">Có sẵn 9 AM - 6 PM</p>
                        <p className="text-xs text-gray-500">Phản hồi ngay lập tức</p>
                </div>
              </div>
            </div>
          </div>
        </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;