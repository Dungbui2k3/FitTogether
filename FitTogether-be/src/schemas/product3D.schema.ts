import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.schema';
import { User } from './user.schema';

export type Product3DDocument = Product3D & Document;

@Schema({ timestamps: true })
export class Product3D {
  // === Thông tin cơ bản ===
  @ApiProperty({
    description: 'Name of the 3D product',
    example: 'Cool 3D Chair',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-poly 3D model of a modern chair',
  })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Nation of the product', example: 'Vietnam' })
  @Prop()
  nation?: string;

  @ApiProperty({ description: 'Category of the product' })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  // === Thông tin bán hàng ===
  @ApiProperty({ description: 'Digital price of the product', example: 29.99 })
  @Prop({ required: true, min: 0 })
  digitalPrice: number;

  @ApiProperty({ description: 'Digital price of the product', example: 29.99 })
  @Prop({ required: true, min: 0 })
  physicalPrice: number;

  @ApiProperty({ description: 'Price of the product', example: 29.99 })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({
    description: 'Currency of the price',
    example: 'USD',
    default: 'USD',
  })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({
    description: 'Whether the product is available for sale',
    example: true,
    default: true,
  })
  @Prop({ default: true })
  available: boolean;

  // === Thông tin kỹ thuật in 3D ===
  @ApiProperty({
    description: 'Materials used',
    example: ['PLA+', 'ABS'],
    type: [String],
  })
  @Prop([String])
  material?: string[];

  @ApiProperty({ description: 'Height of layer', example: '0.2mm' })
  @Prop()
  layerHeight?: string;

  @ApiProperty({ description: 'Print time', example: '2 hours' })
  @Prop()
  printTime?: string;

  @ApiProperty({
    description: 'Dimensions of the product in units',
    example: { width: 1.2, height: 0.8, depth: 0.7 },
  })
  @Prop({
    type: {
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      depth: { type: Number, min: 0 },
    },
    _id: false,
  })
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };

  // === File / Media ===
  @ApiProperty({
    description: 'Array of image URLs including model URL and preview images',
    example: [
      'https://example.com/models/chair.glb',
      'https://example.com/images/chair-front.jpg',
    ],
  })
  @Prop({ type: [String], default: [] })
  urlImgs: string[];

  // === Soft Delete ===
  @ApiProperty({ description: 'Soft delete flag', example: false })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ description: 'Deleted at timestamp' })
  @Prop()
  deletedAt?: Date;

  // === Timestamps ===
  createdAt?: Date;
  updatedAt?: Date;
}

export const Product3DSchema = SchemaFactory.createForClass(Product3D);

// Add indexes for better performance
Product3DSchema.index({ name: 1 });
Product3DSchema.index({ categoryId: 1 });
Product3DSchema.index({ owner: 1 });
Product3DSchema.index({ available: 1 });
Product3DSchema.index({ isDeleted: 1 });
Product3DSchema.index({ digitalPrice: 1 });
Product3DSchema.index({ physicalPrice: 1 });
Product3DSchema.index({ createdAt: -1 });
