import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, Min, ValidateIf, IsOptional, IsString } from 'class-validator';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
}

export enum PaymentMethod {
  PAYOS = 'payos',
  BANK_TRANSFER = 'bank_transfer',
  COD = 'cod',
  WALLET = 'wallet',
}

class OrderItemDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ enum: ProductType, example: ProductType.PHYSICAL })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 2, description: 'Quantity must be 1 if digital' })
  @IsNumber()
  @Min(1)
  @ValidateIf((o) => o.type === ProductType.PHYSICAL)
  quantity: number;

  @ValidateIf((o) => o.type === ProductType.DIGITAL)
  @IsNumber()
  quantityDigitalCheck(): number {
    return 1;
  }
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @IsNotEmpty()
  items: OrderItemDto[];

  @ApiProperty({ 
    enum: PaymentMethod, 
    example: PaymentMethod.PAYOS,
    description: 'Payment method for the order'
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: 150000, description: 'Total amount for the order in VND' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ 
    example: 'Please deliver to the front desk',
    description: 'Additional note or instructions for the order',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Shipping address for physical products', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
