import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by product name',
    example: 'Chair',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by availability status',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    default: 'createdAt',
    enum: ['name', 'digitalPrice', 'physicalPrice', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'digitalPrice', 'physicalPrice', 'createdAt', 'updatedAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    default: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Search by product name',
    example: 'Chair',
  })
  @IsOptional()
  @IsString()
  search?: string;
}