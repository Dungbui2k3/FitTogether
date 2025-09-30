import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { ResponseUtil } from '../../common/utils/response.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepository.create(createCategoryDto);
    return ResponseUtil.created(
      {
        id: (category as any)._id,
        name: category.name,
        description: category.description,
        createdAt: (category as any).createdAt,
      },
      'Category created successfully'
    );
  }

  async findAll() {
    const categories = await this.categoriesRepository.findAll();
    return ResponseUtil.success(categories, 'Categories retrieved successfully');
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return ResponseUtil.success(
      {
        id: (category as any)._id,
        name: category.name,
        description: category.description,
        createdAt: (category as any).createdAt,
        updatedAt: (category as any).updatedAt,
      },
      'Category retrieved successfully'
    );
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.update(id, updateCategoryDto);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return ResponseUtil.success(
      {
        id: (category as any)._id,  
        name: category.name,
        description: category.description,
        updatedAt: (category as any).updatedAt,
      },
      'Category updated successfully'
    );
  }

  async remove(id: string) {
    const deleted = await this.categoriesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return ResponseUtil.success(null, 'Category deleted successfully');
  }
}
