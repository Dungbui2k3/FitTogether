import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { SubField, SubFieldSchema } from 'src/schemas/subField.schema';
import { SubFieldsController } from './subFields.controller';
import { SubFieldsService } from './subFields.service';
import { SubFieldsRepository } from './subFields.repository';
import { Field, FieldSchema } from 'src/schemas/field.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubField.name, schema: SubFieldSchema },
      { name: Field.name, schema: FieldSchema },
    ])
  ],
  controllers: [SubFieldsController],
  providers: [
    SubFieldsService, 
    SubFieldsRepository,
  ],
  exports: [SubFieldsService]
})
export class SubFieldsModule {}
