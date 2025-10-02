import { Dumbbell, Award, Truck, Shield } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Dumbbell className="h-12 w-12 text-blue-600" />,
      title: "Phụ Kiện Chất Lượng",
      description: "Chúng tôi chỉ bán những sản phẩm phụ kiện thể thao chính hãng từ các thương hiệu uy tín hàng đầu thế giới."
    },
    {
      icon: <Award className="h-12 w-12 text-green-600" />,
      title: "Đa Dạng Sản Phẩm",
      description: "Từ giày thể thao, dụng cụ tập luyện đến trang phục thể thao - đáp ứng mọi nhu cầu luyện tập của bạn."
    },
    {
      icon: <Shield className="h-12 w-12 text-purple-600" />,
      title: "Bảo Hành Chính Hãng",
      description: "Tất cả sản phẩm đều có bảo hành chính hãng và chế độ đổi trả linh hoạt trong vòng 30 ngày."
    },
    {
      icon: <Truck className="h-12 w-12 text-orange-600" />,
      title: "Giao Hàng Nhanh",
      description: "Giao hàng toàn quốc, nhanh chóng và an toàn. Miễn phí ship cho đơn hàng trên 500.000đ."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">FitTogether</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến cho bạn những sản phẩm phụ kiện thể thao chất lượng cao nhất 
            với giá cả hợp lý và dịch vụ tận tâm.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 transition-all">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl text-white p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Cam Kết Chất Lượng</h3>
              <div className="space-y-4 text-lg">
                <p>
                  Mỗi sản phẩm đều được tuyển chọn kỹ lưỡng từ các nhà cung cấp uy tín 
                  và trải qua kiểm tra chất lượng nghiêm ngặt.
                </p>
                <p>
                  Đội ngũ chuyên gia thể thao của chúng tôi luôn sẵn sàng tư vấn 
                  để bạn chọn được sản phẩm phù hợp nhất.
                </p>
                <p>
                  Từ giày chạy bộ Nike đến dụng cụ tập gym chuyên nghiệp, 
                  chúng tôi có mọi thứ bạn cần cho hành trình thể thao của mình.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Sản Phẩm</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-90">Khách Hàng Hài Lòng</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-sm opacity-90">Thương Hiệu</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">Chính Hãng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;