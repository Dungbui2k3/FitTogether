import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Product3D } from './product3D.schema';
import { User } from './user.schema';

export type OrdersDocument = Orders & Document;

@Schema({ timestamps: true })
export class OrderItem {
  @ApiProperty({
    description: 'ID of the product',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId, ref: Product3D.name, required: true })
  productId: Types.ObjectId;

  @ApiProperty({
    description: 'Type of product',
    enum: ['physical', 'digital'],
    example: 'physical',
  })
  @Prop({ type: String, enum: ['physical', 'digital'], required: true })
  type: 'physical' | 'digital';

  @ApiProperty({ description: 'Quantity of this product', example: 2 })
  @Prop({
    required: true,
    min: 1,
    default: 1,
    validate: {
      validator: function (value: number) {
        // Nếu là digital thì quantity luôn = 1
        if (this.type === 'digital' && value !== 1) return false;
        return true;
      },
      message: 'Digital product quantity must be 1',
    },
  })
  quantity: number;

  @ApiProperty({ description: 'Price for this item', example: 59.99 })
  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Orders {
  @ApiProperty({ description: 'User who placed the order' })
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: 'Array of ordered items', type: [OrderItem] })
  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @ApiProperty({ description: 'Unique order code', example: '#12345678' })
  @Prop({ required: true, unique: true })
  orderCode: string;

  @ApiProperty({
    description: 'Status of the order',
    enum: ['pending', 'success', 'cancel'],
    example: 'pending',
  })
  @Prop({
    required: true,
    type: String,
    enum: ['pending', 'success', 'cancel'],
    default: 'pending',
  })
  status: string;

  @ApiProperty({ description: 'Total amount of the order', example: 142.98 })
  @Prop({ required: true })
  totalAmount: number;

  @ApiProperty({
    description: 'Payment method used for the order',
    enum: ['payos', 'bank_transfer', 'cash_on_delivery', 'wallet'],
    example: 'payos',
  })
  @Prop({
    type: String,
    enum: ['payos', 'cod'],
    required: true,
  })
  paymentMethod: string;

  @ApiProperty({
    description: 'Additional note or instructions for the order',
    example: 'Please deliver to the front desk',
    required: false,
  })
  @Prop({ type: String, default: '' })
  notes: string;

  @ApiProperty({
    description: 'Date when the order was created',
    example: '2025-09-26T10:00:00Z',
  })
  @Prop({ type: Date, default: Date.now })
  orderDate: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
