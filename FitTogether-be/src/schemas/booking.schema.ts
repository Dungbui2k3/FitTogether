// booking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SubField } from './subField.schema';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @ApiProperty({ description: 'Sân con được đặt', example: '652abc12345...' })
  @Prop({ type: Types.ObjectId, ref: SubField.name, required: true })
  subFieldId: Types.ObjectId;

  @ApiProperty({ description: 'Người đặt sân', example: '652user12345...' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
  })
  duration: string;

  @ApiProperty({
    description: 'Ngày đặt sân (YYYY-MM-DD)',
    example: '2025-10-10',
  })
  @Prop({ required: true })
  day: string;

  @ApiProperty({ description: 'Tổng tiền (VNĐ)', example: 600000 })
  @Prop({ required: true })
  totalPrice: number;

  @ApiProperty({ description: 'Trạng thái đặt sân', example: 'confirmed' })
  @Prop({
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  status: string;

  @ApiProperty({
    description: 'Phone number for the order',
    example: '1234567890',
    required: false,
  })
  @Prop({ type: String, default: '' })
  phone: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ subFieldId: 1, day: 1, duration: 1 }, { unique: true });
