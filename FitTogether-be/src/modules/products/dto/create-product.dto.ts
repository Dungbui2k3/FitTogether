import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  // === Thông tin cơ bản ===
  @ApiProperty({
    description: 'Name of the 3D product',
    example: 'Cool 3D Chair',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-poly 3D model of a modern chair',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nation of the product', example: 'Vietnam' })
  @IsOptional()
  @IsString()
  nation?: string;

  @ApiProperty({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  // === Thông tin bán hàng ===
  @ApiProperty({
    description: 'Price of the product',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  // === File / Media ===
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Array of image URLs including model URL and preview images',
  })
  @IsOptional()
  urlImgs?: Express.Multer.File[];
}
