import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { FieldsRepository } from './fields.repository';
import { Field, FieldSchema } from 'src/schemas/field.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Field.name, schema: FieldSchema }
    ])
  ],
  controllers: [FieldsController],
  providers: [
    FieldsService, 
    FieldsRepository,
  ],
  exports: [FieldsService, FieldsRepository]
})
export class FieldsModule {}
