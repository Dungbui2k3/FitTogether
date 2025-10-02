import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Phụ Kiện Thể Thao",
      subtitle: "Chính Hãng",
      highlight: "Chất Lượng Cao",
      description: "Khám phá bộ sưu tập phụ kiện thể thao đa dạng của chúng tôi. Từ giày thể thao, dụng cụ tập luyện đến trang phục thể thao - tất cả đều có chất lượng cao và giá cả hợp lý.",
      buttonText: "Mua Ngay",
      buttonSecondary: "Xem Sản Phẩm",
      product: {
        name: "Giày Thể Thao Nike Air Max",
        price: "2.999.000₫",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        description: "Chính hãng - Bảo hành 1 năm"
      },
      bgGradient: "from-green-600 via-blue-600 to-purple-800"
    },
    {
      id: 2,
      title: "Trang Phục Thể Thao",
      subtitle: "Cao Cấp",
      highlight: "Thiết Kế Hiện Đại",
      description: "Bộ sưu tập áo quần thể thao từ các thương hiệu hàng đầu thế giới. Chất liệu thoáng mát, thiết kế năng động và phong cách thời trang.",
      buttonText: "Khám Phá Ngay",
      buttonSecondary: "Xem Bộ Sưu Tập",
      product: {
        name: "Áo Thể Thao Adidas",
        price: "899.000₫",
        image: "https://product.hstatic.net/200000142885/product/z4121570251442_1ea4dad0962c57799e2306bf9b6cfe76_90c1420390b94518b2c2b45936bfbb88_master.jpg",
        description: "Vải thể thao cao cấp"
      },
      bgGradient: "from-orange-600 via-red-600 to-pink-800"
    },
    {
      id: 3,
      title: "Dụng Cụ Tập Luyện",
      subtitle: "Chuyên Nghiệp",
      highlight: "Hiệu Quả Tối Đa",
      description: "Thiết bị tập luyện chuyên nghiệp cho phòng gym và tập tại nhà. Chất liệu bền bỉ, an toàn và hiệu quả cho mọi cấp độ tập luyện.",
      buttonText: "Mua Thiết Bị",
      buttonSecondary: "Tư Vấn Miễn Phí",
      product: {
        name: "Bộ Dụng Cụ Tập Gym",
        price: "1.599.000₫",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        description: "Bộ đầy đủ cho phòng gym"
      },
      bgGradient: "from-purple-600 via-indigo-600 to-blue-800"
    },
    {
      id: 4,
      title: "Phụ Kiện Boxing",
      subtitle: "Chuyên Dụng",
      highlight: "Sức Mạnh Thật",
      description: "Găng tay boxing, bao cát và phụ kiện boxing chuyên nghiệp. Được sử dụng bởi các võ sĩ chuyên nghiệp và phòng tập hàng đầu.",
      buttonText: "Xem Boxing Gear",
      buttonSecondary: "Học Boxing",
      product: {
        name: "Găng Tay Boxing Pro",
        price: "799.000₫",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
        description: "Da thật - Chất lượng cao"
      },
      bgGradient: "from-red-600 via-orange-600 to-yellow-700"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Tăng thời gian lên 6 giây cho mỗi slide
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Main Slider Container */}
      <div className="relative h-screen">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${slide.bgGradient} text-white`}>
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 h-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm">Được tin tưởng bởi hơn 10,000+ khách hàng</span>
                      </div>
                      <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                        {slide.title}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> {slide.subtitle}</span>
                        <br />
                        {slide.highlight}
                      </h1>
                      <p className="text-xl text-gray-100 max-w-2xl">
                        {slide.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center space-x-2 transition-all transform hover:scale-105">
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold transition-all">
                        {slide.buttonSecondary}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative max-w-md mx-auto">
                    <div className="relative z-10 bg-white rounded-xl p-6 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <img 
                          src={slide.product.image}
                          alt={slide.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-3 text-gray-800">
                        <h3 className="font-bold text-base">{slide.product.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{slide.product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">{slide.product.price}</span>
                          <button className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 transition-colors">
                            Thêm vào giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20 z-20">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-6000 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
};

export default Hero;