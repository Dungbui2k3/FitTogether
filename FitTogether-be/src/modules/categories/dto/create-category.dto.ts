import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Furniture',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the category',
    example: '3D models of chairs, tables, and other furniture items',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

}
