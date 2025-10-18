import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResponseUtil } from '../../common/utils/response.util';
import { EmailService } from '../../common/services/email.service';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private generateOTP(): string {
    // Generate 6 digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user with isEmailVerified = false
    const user = await this.usersService.create(createUserDto);
    
    // Generate OTP
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Update user with OTP
    await this.userModel.findByIdAndUpdate((user as any)._id, {
      otp,
      otpExpiry,
      isEmailVerified: false,
    });

    // Send OTP email
    try {
      await this.emailService.sendOTPEmail(user.email, otp, user.name);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      // Continue even if email fails, user can request resend
    }

    return ResponseUtil.created(
      {
        email: user.email,
        message: 'OTP has been sent to your email. Please verify to complete registration.',
      },
      'User registered successfully. Please verify your email.',
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailForAuth(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified. Please verify your email first.');
    }

    const payload = { email: user.email, sub: (user as any)._id };

    const authData = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    };

    return ResponseUtil.success(authData, 'Login successful');
  }

  async validateUser(payload: any) {
    return await this.usersService.findById(payload.sub);
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findByEmailForAuth(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    //check if new password is same as old password
    if (currentPassword === newPassword) {
      throw new ConflictException('New password must be different from old password');
    }

    user.password = newPassword;
    await user.save();

    return ResponseUtil.success(null, 'Password changed successfully');
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.usersService.findByEmailForAuth(verifyOtpDto.email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP found. Please request a new OTP.');
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP has expired. Please request a new OTP.');
    }

    // Verify OTP
    if (user.otp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Update user as verified
    await this.userModel.findByIdAndUpdate((user as any)._id, {
      isEmailVerified: true,
      otp: null,
      otpExpiry: null,
    });

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    // Generate token
    const payload = { email: user.email, sub: (user as any)._id };
    const authData = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: true,
      },
    };

    return ResponseUtil.success(authData, 'Email verified successfully');
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const user = await this.usersService.findByEmailForAuth(resendOtpDto.email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new OTP
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Update user with new OTP
    await this.userModel.findByIdAndUpdate((user as any)._id, {
      otp,
      otpExpiry,
    });

    // Send OTP email
    try {
      await this.emailService.sendOTPEmail(user.email, otp, user.name);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new BadRequestException('Failed to send OTP email. Please try again.');
    }

    return ResponseUtil.success(
      { email: user.email },
      'OTP has been resent to your email',
    );
  }

}
