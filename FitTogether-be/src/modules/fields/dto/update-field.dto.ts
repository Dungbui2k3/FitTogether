import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateFieldDto } from './create-field.dto';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'Image URLs you want to remove',
    required: false,
  })
  @IsOptional()
  removedImages?: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'Image URLs you want to keep',
    required: false,
  })
  @IsOptional()
  existingImages?: string[];

}
