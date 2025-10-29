import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsBoolean, MinLength, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'John Doe Updated',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.updated@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password for the user',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'User role',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Reward points of the user',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiPropertyOptional({
    description: 'Whether the user account is active',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}