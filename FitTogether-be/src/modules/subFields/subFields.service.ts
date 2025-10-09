import { SubField, SubFieldDocument } from 'src/schemas/subField.schema';
import { SubFieldsRepository } from './subFields.repository';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubFieldDto } from './dto';
import { Field, FieldDocument } from 'src/schemas/field.schema';

@Injectable()
export class SubFieldsService {
  constructor(
    private readonly subFieldsRepository: SubFieldsRepository,
    @InjectModel(SubField.name)
    private readonly subFieldModel: Model<SubFieldDocument>,
    @InjectModel(Field.name)
    private readonly fieldModel: Model<FieldDocument>,
  ) {}
  async create(
    createSubFieldDto: CreateSubFieldDto,
    fieldId: string,
  ): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(fieldId)) {
        throw new BadRequestException('Invalid fieldId format');
      }
      // 1️⃣ Kiểm tra Field cha có tồn tại không
      const existingField = await this.fieldModel.findById(fieldId);
      if (!existingField) {
        throw new NotFoundException('Field not found');
      }

      // 2️⃣ Kiểm tra trùng tên SubField trong cùng Field
      const existingSubField = await this.subFieldModel.findOne({
        fieldId: fieldId,
        name: createSubFieldDto.name.trim(),
      });

      if (existingSubField) {
        throw new ConflictException(
          `Sub-field with name "${createSubFieldDto.name}" already exists in this field.`,
        );
      }

      // 3️⃣ Tạo mới SubField
      const newSubField = new this.subFieldModel({
        ...createSubFieldDto,
        fieldId: new Types.ObjectId(fieldId),
      });

      const savedSubField = await newSubField.save();

      return {
        success: true,
        message: 'Sub-field created successfully',
        data: savedSubField,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create sub-field: ${error.message}`,
      );
    }
  }

  async getByFieldId(fieldId: string) {
    if (!Types.ObjectId.isValid(fieldId)) {
      throw new BadRequestException('Invalid fieldId format');
    }

    const subFields = await this.subFieldModel.find({
      fieldId: new Types.ObjectId(fieldId),
    });
    
    return {
      success: true,
      data: subFields,
    };
  }
}
