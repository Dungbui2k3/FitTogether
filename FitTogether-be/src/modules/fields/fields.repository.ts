import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Field, FieldDocument } from 'src/schemas/field.schema';

@Injectable()
export class FieldsRepository {
  constructor(
    @InjectModel(Field.name) private fieldModel: Model<FieldDocument>,
  ) {}

  async exists(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const field = await this.fieldModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    return !!field;
  }

  async findByName(name: string): Promise<FieldDocument | null> {
    return this.fieldModel.findOne({
      name,
      isDeleted: { $ne: true },
    });
  }

  async findById(id: string): Promise<FieldDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.fieldModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });
  }

  async findByAddress(address: string): Promise<FieldDocument[]> {
    return this.fieldModel.find({
      address: { $regex: address, $options: 'i' },
      isDeleted: { $ne: true },
    });
  }

  async findByPhone(phone: string): Promise<FieldDocument | null> {
    return this.fieldModel.findOne({
      phone,
      isDeleted: { $ne: true },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.fieldModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { isDeleted: true, deletedAt: new Date() }
    );

    return result.modifiedCount > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.fieldModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount > 0;
  }

  async countAll(): Promise<number> {
    return this.fieldModel.countDocuments({
      isDeleted: { $ne: true },
    });
  }
}
