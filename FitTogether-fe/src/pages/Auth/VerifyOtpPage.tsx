import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks';

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: showError } = useToast();
  
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      showError('Không tìm thấy email. Vui lòng đăng ký lại.');
      navigate('/register');
    }
  }, [email, navigate, showError]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      showError('Vui lòng chỉ dán số');
      return;
    }

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      showError('Vui lòng nhập đầy đủ 6 số OTP');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await authService.verifyOtp(email, otpString);

      if (response.success) {
        success('Xác thực email thành công! Vui lòng đăng nhập.');
        // Navigate to login with success message
        navigate('/login', { 
          state: { 
            registrationSuccess: true,
            message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.' 
          } 
        });
      } else {
        showError(response.error || 'Xác thực OTP thất bại');
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi xác thực OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);

    try {
      const response = await authService.resendOtp(email);

      if (response.success) {
        success('Mã OTP mới đã được gửi đến email của bạn');
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        showError(response.error || 'Không thể gửi lại OTP');
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi gửi lại OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/register')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại đăng ký
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Xác Thực Email
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Chúng tôi đã gửi mã OTP gồm 6 số đến<br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          {/* OTP Form */}
          <form onSubmit={handleVerify}>
            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xác thực...
                </>
              ) : (
                'Xác Thực'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Không nhận được mã?</p>
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gửi lại mã OTP
                  </>
                )}
              </button>
            ) : (
              <p className="text-gray-500">
                Gửi lại sau <span className="font-semibold text-blue-600">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Mẹo:</span> Kiểm tra cả hộp thư spam nếu không thấy email. 
              Mã OTP có hiệu lực trong 5 phút.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

