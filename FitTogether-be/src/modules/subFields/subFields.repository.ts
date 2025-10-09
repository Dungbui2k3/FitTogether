import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubField, SubFieldDocument } from 'src/schemas/subField.schema';

@Injectable()
export class SubFieldsRepository {
  constructor(
    @InjectModel(SubField.name) private subFieldModel: Model<SubFieldDocument>,
  ) {}

  async exists(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const product = await this.subFieldModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    return !!product;
  }

  async findByName(name: string): Promise<SubFieldDocument | null> {
    return this.subFieldModel.findOne({
      name,
      isDeleted: { $ne: true },
    });
  }

  async findById(id: string): Promise<SubFieldDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.subFieldModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });
  }

  async findByOwnerId(ownerId: string): Promise<SubFieldDocument[]> {
    if (!Types.ObjectId.isValid(ownerId)) {
      return [];
    }

    return this.subFieldModel.find({
      owner: new Types.ObjectId(ownerId),
      isDeleted: { $ne: true },
    });
  }

  async countByCategory(categoryId: string): Promise<number> {
    if (!Types.ObjectId.isValid(categoryId)) {
      return 0;
    }

    return this.subFieldModel.countDocuments({
      categoryId: new Types.ObjectId(categoryId),
      isDeleted: { $ne: true },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.subFieldModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { isDeleted: true, deletedAt: new Date() }
    );

    return result.modifiedCount > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.subFieldModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount > 0;
  }
}
