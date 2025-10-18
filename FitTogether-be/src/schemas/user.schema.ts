import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password',
    example: '$2b$10$...',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    default: 'user',
  })
  @Prop({ default: 'user' })
  role: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: false,
    default: false,
  })
  @Prop({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'OTP code for email verification',
    example: '123456',
    required: false,
  })
  @Prop()
  otp?: string;

  @ApiProperty({
    description: 'OTP expiry time',
    example: new Date(),
    required: false,
  })
  @Prop()
  otpExpiry?: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add instance method
UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
