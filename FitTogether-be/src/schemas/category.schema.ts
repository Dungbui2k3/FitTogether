import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Furniture',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Description of the category',
    example: '3D models of chairs, tables, and other furniture items',
  })
  @Prop()
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
