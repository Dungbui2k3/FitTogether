import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Search by email',
    example: 'john@example.com',
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search by name or email',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
