import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({
    description: 'Tên sân / tiêu đề',
    example: 'Sân bóng đá FitTogether Arena',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Địa chỉ sân',
    example: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Danh sách tiện ích, mô tả chi tiết',
    example: [
      'Sân cỏ nhân tạo chất lượng cao',
      'Hệ thống đèn chiếu sáng hiện đại',
      'Phòng thay đồ rộng rãi',
      'Bãi đậu xe miễn phí',
      'Căng tin phục vụ đồ uống'
    ],
    type: [String],
  })
   @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value]; 
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facilities?: string[];

  @ApiProperty({
    description: 'Thông điệp giới thiệu / kêu gọi',
    example: 'Sân bóng đá hiện đại với cỏ nhân tạo chất lượng cao, phù hợp cho các trận đấu giao hữu và thi đấu chuyên nghiệp. Hãy đến và trải nghiệm không gian thể thao tuyệt vời!',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Field images',
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}
