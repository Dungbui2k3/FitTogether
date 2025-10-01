import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Nguyễn Văn An",
      location: "Hà Nội",
      rating: 5,
      comment: "Đôi giày Nike Air Max mua ở FitTogether chất lượng tuyệt vời! Đúng hàng chính hãng, giao hàng nhanh và đóng gói cẩn thận. Sẽ ủng hộ shop lâu dài.",
      product: "Giày Nike Air Max"
    },
    {
      name: "Trần Thị Lan",
      location: "TP. Hồ Chí Minh",
      rating: 5,
      comment: "Bộ dụng cụ tập gym mua tại đây rất chất lượng và giá cả hợp lý. Staff tư vấn nhiệt tình, hỗ trợ chọn sản phẩm phù hợp với nhu cầu tập luyện.",
      product: "Bộ Dụng Cụ Tập Gym"
    },
    {
      name: "Lê Hoàng Nam",
      location: "Đà Nẵng",
      rating: 5,
      comment: "Áo thể thao Adidas mua ở FitTogether vải rất mát, thiết kế đẹp. Chất lượng 100% chính hãng như cam kết. Rất hài lòng với dịch vụ.",
      product: "Áo Thể Thao Adidas"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khách Hàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Nói Gì Về Chúng Tôi</span>
          </h2>
          <p className="text-xl text-gray-600">
            Hàng nghìn khách hàng hài lòng trên toàn quốc
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-green-600 mr-3" />
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.comment}"
              </p>
              
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.location}</div>
                <div className="text-sm text-green-600 mt-1">Đã mua: {testimonial.product}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <div className="text-gray-900">
              <span className="font-semibold">4.9/5</span>
              <span className="text-gray-600 ml-2">từ 5,000+ đánh giá</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;