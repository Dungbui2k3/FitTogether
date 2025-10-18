import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const mailHost = this.configService.get<string>('MAIL_HOST');
    const mailPort = this.configService.get<number>('MAIL_PORT');
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD');

    // Check if email configuration is available
    if (!mailHost || !mailPort || !mailUser || !mailPassword) {
      this.logger.warn('Email configuration is incomplete. Email functionality will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailPort === 465, // true for 465, false for other ports
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
      // Add timeout and connection options
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      // Add TLS options for better compatibility
      tls: {
        rejectUnauthorized: false,
      },
      // Add pool options for better connection management
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 20000, // 20 seconds
      rateLimit: 5, // max 5 emails per rateDelta
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    if (!this.transporter) {
      this.logger.warn('Email transporter not initialized. Skipping connection verification.');
      return;
    }

    try {
      await this.transporter.verify();
      this.logger.log('Email transporter connection verified successfully');
    } catch (error) {
      this.logger.error('Email transporter connection verification failed:', error.message);
    }
  }

  async sendOTPEmail(email: string, otp: string, name: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not available. Skipping OTP email send.');
      return;
    }

    const mailOptions = {
      from: `"FitTogether" <${this.configService.get<string>('MAIL_FROM') || 'noreply@fittogether.com'}>`,
      to: email,
      subject: 'Xác thực tài khoản FitTogether',
      html: `
        <!DOCTYPE html>
        <html>
        <head>  
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 10px 10px 0 0;
            }
            .content {
              padding: 30px;
              background-color: #f9f9f9;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              padding: 20px;
              background-color: #fff;
              border: 2px dashed #667eea;
              border-radius: 10px;
              margin: 20px 0;
              letter-spacing: 5px;
              color: #667eea;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
            .warning {
              color: #e74c3c;
              font-weight: bold;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏋️ FitTogether</h1>
              <p>Xác thực tài khoản của bạn</p>
            </div>
            <div class="content">
              <h2>Xin chào ${name}!</h2>
              <p>Cảm ơn bạn đã đăng ký tài khoản tại FitTogether. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP bên dưới:</p>
              
              <div class="otp-code">${otp}</div>
              
              <p><strong>Mã OTP này sẽ hết hạn sau 5 phút.</strong></p>
              
              <p>Nếu bạn không yêu cầu đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
              
              <p class="warning">⚠️ Không chia sẻ mã OTP này với bất kỳ ai!</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 FitTogether. All rights reserved.</p>
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}:`, error.message);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not available. Skipping welcome email send.');
      return;
    }

    const mailOptions = {
      from: `"FitTogether" <${this.configService.get<string>('MAIL_FROM') || 'noreply@fittogether.com'}>`,
      to: email,
      subject: 'Chào mừng bạn đến với FitTogether!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 10px 10px 0 0;
            }
            .content {
              padding: 30px;
              background-color: #f9f9f9;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Chào mừng đến với FitTogether!</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${name}!</h2>
              <p>Tài khoản của bạn đã được xác thực thành công. Chúc mừng bạn đã trở thành thành viên của FitTogether!</p>
              
              <p>Bây giờ bạn có thể:</p>
              <ul>
                <li>Đặt sân thể thao yêu thích</li>
                <li>Tham gia các hoạt động thể thao cộng đồng</li>
                <li>Kết nối với những người có cùng sở thích</li>
              </ul>
              
              <p>Hãy bắt đầu hành trình thể thao của bạn ngay hôm nay!</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 FitTogether. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error.message);
    }
  }
}

