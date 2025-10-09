// sub-field.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SubFieldDocument = SubField & Document;

@Schema({ timestamps: true })
export class SubField {
  @ApiProperty({ description: 'Mã sân cha (Field)', example: '652abc12345...' })
  @Prop({ type: Types.ObjectId, ref: 'Field', required: true })
  fieldId: Types.ObjectId;

  @ApiProperty({ description: 'Tên sân con', example: 'Sân số 1' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Loại sân (5 người, 7 người...)',
    example: 'Sân 7 người',
  })
  @Prop()
  type?: string;

  @ApiProperty({ description: 'Giá thuê mỗi giờ (VNĐ)', example: 300000 })
  @Prop({ required: true })
  pricePerHour: number;

  @ApiProperty({ description: 'Trạng thái sân', example: 'available' })
  @Prop({ enum: ['available', 'maintenance', 'booked'], default: 'available' })
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SubFieldSchema = SchemaFactory.createForClass(SubField);

// Index để query nhanh
SubFieldSchema.index({ fieldId: 1 });
SubFieldSchema.index({ status: 1 });
SubFieldSchema.index({ pricePerHour: 1 });
