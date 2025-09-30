import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}