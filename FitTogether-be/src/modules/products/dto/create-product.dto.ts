import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsArray,
  Min,
  IsEnum,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class DimensionsDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  width: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  height: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  depth: number;
}

export class CreateProductDto {
  // === Thông tin cơ bản ===
  @ApiProperty({
    description: 'Name of the 3D product',
    example: 'Modern Office Chair',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the 3D product',
    example: 'A comfortable modern office chair',
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
    description: 'Price of the 3D model',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  digitalPrice: number;

  @ApiProperty({
    description: 'Price of the 3D model',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  physicalPrice: number;

  @ApiProperty({
    description: 'Price of the 3D model',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Currency of the price',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Whether the product is available for sale',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  available?: boolean;

  // === Thông tin kỹ thuật in 3D ===
  @ApiProperty({
    description: 'Materials used',
    example: ['PLA+', 'ABS'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  material?: string[];

  @ApiProperty({ description: 'Layer height for printing', example: '0.2mm' })
  @IsOptional()
  @IsString()
  layerHeight?: string;

  @ApiProperty({ description: 'Estimated print time', example: '12-18 hours' })
  @IsOptional()
  @IsString()
  printTime?: string;

  @ApiProperty({
    description: 'Dimensions of the 3D model',
    type: DimensionsDto,
  })
  @IsOptional()
  @Type(() => DimensionsDto)
  @ValidateNested()
  dimensions?: DimensionsDto;

  // === File / Media ===
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'All images including 3D model and previews',
  })
  @IsOptional()
  urlImgs?: Express.Multer.File[];
}
