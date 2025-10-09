import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.schema';

export type FieldDocument = Field & Document;

@Schema({ timestamps: true })
export class Field {
  @ApiProperty({
    description: 'Tên sân / tiêu đề',
    example: 'Sân bóng đá FitTogether Arena',
  })
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @ApiProperty({
    description: 'ID người dùng',
    type: String,
    example: '652abc12345...', // chỉ 1 ví dụ
  })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'Địa chỉ sân',
    example: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
  })
  @Prop({ required: true })
  address: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0901234567',
  })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({
    description: 'Danh sách tiện ích, mô tả chi tiết',
    example: [
      'Sân cỏ nhân tạo chất lượng cao',
      'Hệ thống đèn chiếu sáng hiện đại',
      'Phòng thay đồ rộng rãi',
      'Bãi đậu xe miễn phí',
      'Căng tin phục vụ đồ uống',
    ],
  })
  @Prop({ type: [String], default: [] })
  facilities: string[];

  @ApiProperty({
    description: 'Danh sách các khung h',
    example: ['5:00 - 6:30', '6:40 - 8:10	', '8:20 - 9:50	', '10:00 - 11:30	'],
  })
  @Prop({ type: [String], default: [] })
  slots: string[];

  @ApiProperty({
    description: 'Thông điệp giới thiệu / kêu gọi',
    example:
      'Sân bóng đá hiện đại với cỏ nhân tạo chất lượng cao, phù hợp cho các trận đấu giao hữu và thi đấu chuyên nghiệp. Hãy đến và trải nghiệm không gian thể thao tuyệt vời!',
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Array of image URLs for the field',
    example: [
      'https://example.com/images/field-main.jpg',
      'https://example.com/images/field-facilities.jpg',
    ],
  })
  @Prop({ type: [String], default: [] })
  images: string[];

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

export const FieldSchema = SchemaFactory.createForClass(Field);

// Add indexes for better performance
FieldSchema.index({ name: 1 });
FieldSchema.index({ address: 1 });
FieldSchema.index({ isDeleted: 1 });
FieldSchema.index({ createdAt: -1 });
