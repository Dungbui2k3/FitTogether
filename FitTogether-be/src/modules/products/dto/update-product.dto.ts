import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'Image URLs you want to remove',
    required: false,
  })
  @IsOptional()
  removedImgs?: string[];
}
