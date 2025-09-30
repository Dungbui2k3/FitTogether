import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
