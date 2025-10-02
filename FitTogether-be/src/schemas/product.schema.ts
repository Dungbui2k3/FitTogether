import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
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

  //price of product
  @ApiProperty({ description: 'Price of the product', example: 29.99 })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'Quantity of the product', example: 29.99 })
  @Prop({ required: true })
  quantity: number;

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

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add indexes for better performance
ProductSchema.index({ name: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ isDeleted: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
