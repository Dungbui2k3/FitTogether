import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreateSubFieldDto {
  @ApiProperty({ description: 'Tên sân con', example: 'Sân số 1' })
  @IsString()
  @IsNotEmpty({ message: 'Tên sân là bắt buộc' })
  name: string;

  @ApiProperty({
    description: 'Loại sân (5 người, 7 người...)',
    example: 'Sân 7 người',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Giá thuê mỗi giờ (VNĐ)', example: 300000 })
  @IsNumber({}, { message: 'pricePerHour phải là số' })
  @IsNotEmpty({ message: 'Giá thuê là bắt buộc' })
  pricePerHour: number;

  @ApiProperty({
    description: 'Trạng thái sân',
    example: 'available',
    enum: ['available', 'maintenance', 'booked'],
    default: 'available',
  })
  @IsEnum(['available', 'maintenance', 'booked'])
  @IsOptional()
  status?: string;
}

// Dùng cho update — cho phép gửi 1 phần thông tin
export class UpdateSubFieldDto extends PartialType(CreateSubFieldDto) {}
