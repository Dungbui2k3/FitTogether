import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { FieldsRepository } from './fields.repository';
import { Field, FieldSchema } from 'src/schemas/field.schema';
import { SubField, SubFieldSchema } from 'src/schemas/subField.schema';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { CloudinaryProvider } from '../products/cloudinary/cloudinary.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Field.name, schema: FieldSchema },
      { name: SubField.name, schema: SubFieldSchema }
    ])
  ],
  controllers: [FieldsController],
  providers: [
    FieldsService, 
    FieldsRepository,
    CloudinaryProvider,
    CloudinaryService,
  ],
  exports: [FieldsService, FieldsRepository, CloudinaryService]
})
export class FieldsModule {}
