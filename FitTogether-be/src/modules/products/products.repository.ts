import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product3D, Product3DDocument } from 'src/schemas/product3D.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product3D.name) private productModel: Model<Product3DDocument>,
  ) {}

  async exists(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    return !!product;
  }

  async findByName(name: string): Promise<Product3DDocument | null> {
    return this.productModel.findOne({
      name,
      isDeleted: { $ne: true },
    });
  }

  async findById(id: string): Promise<Product3DDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.productModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });
  }

  async findByOwnerId(ownerId: string): Promise<Product3DDocument[]> {
    if (!Types.ObjectId.isValid(ownerId)) {
      return [];
    }

    return this.productModel.find({
      owner: new Types.ObjectId(ownerId),
      isDeleted: { $ne: true },
    });
  }

  async countByCategory(categoryId: string): Promise<number> {
    if (!Types.ObjectId.isValid(categoryId)) {
      return 0;
    }

    return this.productModel.countDocuments({
      categoryId: new Types.ObjectId(categoryId),
      isDeleted: { $ne: true },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.productModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { isDeleted: true, deletedAt: new Date() }
    );

    return result.modifiedCount > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.productModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount > 0;
  }
}
