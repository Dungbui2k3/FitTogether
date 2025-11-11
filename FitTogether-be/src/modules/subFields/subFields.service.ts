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
import { CreateSubFieldDto, UpdateSubFieldDto } from './dto';
import { Field, FieldDocument } from 'src/schemas/field.schema';
import { ResponseUtil } from '../../common/utils/response.util';

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

      return ResponseUtil.created(
        this.formatSubFieldResponse(savedSubField),
        'Sub-field created successfully',
      );
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create sub-field: ${error.message}`,
      );
    }
  }

  async findAll(fieldId?: string): Promise<any> {
    try {
      const filter: any = {};
      
      if (fieldId) {
        if (!Types.ObjectId.isValid(fieldId)) {
          throw new BadRequestException('Invalid fieldId format');
        }
        filter.fieldId = new Types.ObjectId(fieldId);
      }

      const subFields = await this.subFieldModel
        .find(filter)
        .populate('fieldId', 'name address')
        .sort({ createdAt: -1 })
        .exec();

      const formattedSubFields = subFields.map((subField: any) =>
        this.formatSubFieldResponse(subField),
      );

      return ResponseUtil.success(
        formattedSubFields,
        'Sub-fields retrieved successfully',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve sub-fields: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid sub-field ID');
      }

      const subField = await this.subFieldModel
        .findById(id)
        .populate('fieldId', 'name address')
        .exec();

      if (!subField) {
        throw new NotFoundException('Sub-field not found');
      }

      return ResponseUtil.success(
        this.formatSubFieldResponse(subField),
        'Sub-field retrieved successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve sub-field: ${error.message}`,
      );
    }
  }

  async update(id: string, updateSubFieldDto: UpdateSubFieldDto): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid sub-field ID');
      }

      const existingSubField = await this.subFieldModel.findById(id);
      if (!existingSubField) {
        throw new NotFoundException('Sub-field not found');
      }

      // Check name conflict if name is being updated
      if (updateSubFieldDto.name && updateSubFieldDto.name !== existingSubField.name) {
        const conflict = await this.subFieldModel.findOne({
          name: updateSubFieldDto.name.trim(),
          fieldId: existingSubField.fieldId,
          _id: { $ne: id },
        });
        if (conflict) {
          throw new ConflictException(
            `Sub-field with name "${updateSubFieldDto.name}" already exists in this field`,
          );
        }
      }

      const updatedSubField = await this.subFieldModel
        .findByIdAndUpdate(id, updateSubFieldDto, { new: true })
        .populate('fieldId', 'name address')
        .exec();

      return ResponseUtil.success(
        this.formatSubFieldResponse(updatedSubField),
        'Sub-field updated successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update sub-field: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid sub-field ID');
      }

      const subField = await this.subFieldModel.findById(id);
      if (!subField) {
        throw new NotFoundException('Sub-field not found');
      }

      await this.subFieldModel.findByIdAndDelete(id);

      return ResponseUtil.success(null, 'Sub-field deleted successfully');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete sub-field: ${error.message}`,
      );
    }
  }

  async getByFieldId(fieldId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(fieldId)) {
        throw new BadRequestException('Invalid fieldId format');
      }

      const subFields = await this.subFieldModel
        .find({ 
          fieldId: new Types.ObjectId(fieldId),
          isDeleted: { $ne: true }
        })
        .populate('fieldId', 'name address')
        .sort({ createdAt: -1 })
        .exec();

      // Filter out subFields without valid _id
      const validSubFields = subFields.filter((subField: any) => 
        subField && subField._id && Types.ObjectId.isValid(subField._id)
      );

      const formattedSubFields = validSubFields.map((subField: any) =>
        this.formatSubFieldResponse(subField),
      );

      return ResponseUtil.success(
        formattedSubFields,
        'Sub-fields retrieved successfully',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve sub-fields: ${error.message}`,
      );
    }
  }

  private formatSubFieldResponse(subField: any) {
    return {
      id: subField._id,
      fieldId: subField.fieldId,
      field: subField.fieldId ? {
        id: subField.fieldId._id,
        name: subField.fieldId.name,
        address: subField.fieldId.address,
      } : null,
      name: subField.name,
      type: subField.type,
      pricePerHour: subField.pricePerHour,
      status: subField.status,
      createdAt: subField.createdAt,
      updatedAt: subField.updatedAt,
    };
  }
}
