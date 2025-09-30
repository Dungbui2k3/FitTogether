import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseUtil } from '../../common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create(createUserDto);
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

    return ResponseUtil.created(authData, 'User registered successfully');
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

}
