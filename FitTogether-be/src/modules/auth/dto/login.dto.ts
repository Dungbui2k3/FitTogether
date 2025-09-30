import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email address for login',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}