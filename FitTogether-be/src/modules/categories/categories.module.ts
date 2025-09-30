import { Module } from '@nestjs/common';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
