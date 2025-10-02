import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Phụ Kiện Thể Thao Chính Hãng",
      description: "Khám phá bộ sưu tập phụ kiện thể thao chất lượng cao",
      image: "/slide1.jpg",
      bgGradient: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Trang Phục Thể Thao Cao Cấp",
      description: "Thiết kế hiện đại, chất liệu thoáng mát",
      image: "/slide2.jpg",
      bgGradient: "from-green-600 to-blue-600"
    },
    {
      id: 3,
      title: "Dụng Cụ Tập Luyện Chuyên Nghiệp",
      description: "Thiết bị tập luyện an toàn và hiệu quả",
      image: "/slide3.jpg",
      bgGradient: "from-purple-600 to-pink-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide
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
      <div className="relative h-[50vh] md:h-[55vh]">
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
            <div className={`h-full bg-gradient-to-br ${slide.bgGradient} relative`}>
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-image.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-20"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-20"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;