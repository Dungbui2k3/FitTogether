import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/guards';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Public } from 'src/decorators';

@ApiTags('Categories')
@Controller('api/v1/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
