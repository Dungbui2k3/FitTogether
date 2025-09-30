import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsEnum, IsString, IsDateString, IsMongoId } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  CANCEL = 'cancel',
}

export enum OrderSortBy {
  CREATED_AT = 'createdAt',
  ORDER_DATE = 'orderDate',
  TOTAL_AMOUNT = 'totalAmount',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetOrdersQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: OrderStatus, description: 'Filter by order status' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011', description: 'Filter by user ID' })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiPropertyOptional({ example: 'search term', description: 'Search by order code or user info' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Filter orders from this date' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Filter orders to this date' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ enum: OrderSortBy, description: 'Sort by field', default: OrderSortBy.CREATED_AT })
  @IsOptional()
  @IsEnum(OrderSortBy)
  sortBy?: OrderSortBy = OrderSortBy.CREATED_AT;

  @ApiPropertyOptional({ enum: SortOrder, description: 'Sort order', default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ example: 100, description: 'Filter orders with minimum amount' })
  @IsOptional()
  @Type(() => Number)
  minAmount?: number;

  @ApiPropertyOptional({ example: 1000, description: 'Filter orders with maximum amount' })
  @IsOptional()
  @Type(() => Number)
  maxAmount?: number;
}
