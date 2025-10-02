import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { OrderStatus } from './get-orders-query.dto';

export class UpdateOrderDto {
  @ApiPropertyOptional({ 
    enum: OrderStatus, 
    example: OrderStatus.SUCCESS,
    description: 'Update order status'
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ 
    example: 'Order has been processed and shipped',
    description: 'Additional note or update message'
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ 
    example: '1234567890',
    description: 'Shipping phone number for physical products'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    example: '123 Main St, City, Country',
    description: 'Shipping address for physical products'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ 
    example: 299.99,
    description: 'Update total amount if needed'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;
}

