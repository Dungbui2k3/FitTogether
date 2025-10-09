// create-booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Thời gian đặt sân', example: '5:00 - 6:30' })
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ description: 'Ngày đặt sân (YYYY-MM-DD)', example: '2025-10-10' })
  @IsNotEmpty()
  @IsString()
  day: string;

  @ApiProperty({ description: 'Tổng tiền (VNĐ)', example: 600000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;
}
