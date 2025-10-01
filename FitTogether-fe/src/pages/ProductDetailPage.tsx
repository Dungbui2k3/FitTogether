import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  RotateCw,
  Package,
  Ruler,
  Clock,
  Award,
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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState<
    "digital" | "physical"
  >("digital");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await productService.getProductById(id);

        if (response.success && response.data) {
          setProduct(response.data);
          // Set default version based on available prices
          if (!response.data.physicalPrice) {
            setSelectedVersion("digital");
          }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading product...
          </h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h1>
          <button 
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;

    const itemQuantity = selectedVersion === "digital" ? 1 : quantity;
    const price = selectedVersion === "digital" ? product.digitalPrice : product.physicalPrice;

    if (!price) {
      showError("Price not available for this version");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: price,
      quantity: itemQuantity,
      version: selectedVersion,
      image: product.urlImgs?.[0],
      currency: product.currency,
    });

    success(
      `Added ${itemQuantity} ${selectedVersion} version(s) of ${product.name} to cart!`
    );
  };

  const getCurrentPrice = () => {
    return selectedVersion === "digital"
      ? product.digitalPrice
      : product.physicalPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg overflow-hidden">
              {product.urlImgs && product.urlImgs.length > 0 ? (
                <img
                  src={product.urlImgs[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/placeholder-image.svg";
                  }}
                />
              ) : (
                <ProductImage
                  productType="equipment"
                  className="w-full h-full"
                />
              )}
              
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                <div className="font-semibold">{product.name}</div>
                <div className="text-xs opacity-90">Interactive 3D Model</div>
              </div>
              
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoRotate 
                      ? "bg-blue-600 text-white"
                      : "bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100"
                  }`}
                  title="Toggle Auto Rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {product.urlImgs && product.urlImgs.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.urlImgs.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.svg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Purchase */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{product.nation}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category.name}
              </span>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Version Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Select Version
              </h3>
              <div className="flex flex-row gap-3">
                <button
                  onClick={() => setSelectedVersion("digital")}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedVersion === "digital"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold">Digital</div>
                      <div className="text-sm text-gray-500">3D file for printing</div>
                </div>
                    <div className="text-xl font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: product.currency,
                      }).format(product.digitalPrice)}
              </div>
                </div>
                </button>

                {product.physicalPrice && (
                  <button
                    onClick={() => setSelectedVersion("physical")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedVersion === "physical"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold">Physical</div>
                        <div className="text-sm text-gray-500">Pre-printed product</div>
                </div>
                      <div className="text-xl font-bold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: product.currency,
                        }).format(product.physicalPrice)}
              </div>
                </div>
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Selection */}
            {selectedVersion === "physical" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {selectedVersion === "digital" && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Digital files are sold as single copies only
                  </span>
                </div>
              </div>
            )}

            {/* Total Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">
                  Total ({selectedVersion === "digital" ? "1 file" : `${quantity} items`}):
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: product.currency,
                  }).format(
                    getCurrentPrice() * (selectedVersion === "digital" ? 1 : quantity)
                  )}
                </span>
                </div>
              </div>

            {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
              disabled={isInCart(product.id, selectedVersion)}
              className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                isInCart(product.id, selectedVersion)
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              }`}
                >
                  <ShoppingCart className="h-5 w-5" />
              <span>
                {isInCart(product.id, selectedVersion)
                  ? "Already in cart"
                  : `Add ${selectedVersion === "digital" ? "file" : "item(s)"} to cart`}
              </span>
                </button>
                
            {/* Version Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                {selectedVersion === "digital" ? "Digital Version" : "Physical Version"}
              </h4>
              <div className="text-sm text-blue-800">
                {selectedVersion === "digital" ? (
                  <ul className="space-y-1">
                    <li>• Receive 3D file for printing</li>
                    <li>• Detailed printing instructions</li>
                    <li>• Customizable size</li>
                    <li>• Instant delivery</li>
                  </ul>
                ) : (
                  <ul className="space-y-1">
                    <li>• Pre-printed product</li>
                    <li>• High quality finish</li>
                    <li>• Careful packaging</li>
                    <li>• 3-5 days delivery</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications Section */}
        <div className="mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">Category</span>
                  <p className="text-gray-600">{product.category.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Ruler className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">Dimensions</span>
                  <p className="text-gray-600">
                    {product.dimensions.width}cm × {product.dimensions.height}cm × {product.dimensions.depth}cm
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">Print Time</span>
                  <p className="text-gray-600">{product.printTime || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">Materials</span>
                  <p className="text-gray-600">
                    {product.material.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Product Details
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex justify-between">
                <span>Materials:</span>
                <span className="font-medium">{product.material.join(", ") || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Layer Height:</span>
                <span className="font-medium">{product.layerHeight || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>Stock Quantity:</span>
                <span className="font-medium">{product.quantity}</span>
              </li>
              <li className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${product.available ? "text-green-600" : "text-red-600"}`}>
                  {product.available ? "Available" : "Out of Stock"}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Country:</span>
                <span className="font-medium">{product.nation}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Info</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Standard delivery: 3-5 days</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Express delivery: 1-2 days</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Free shipping from $50</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Careful packaging</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Order tracking</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Customer Support
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>24/7 support</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>30-day returns</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Free consultation</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Usage guides</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>User community</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
