import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from '../categories/dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { GetUser, Public, Roles } from 'src/decorators';
import { JwtAuthGuard, Role } from 'src/guards';
import { GetProductsQueryDto } from './dto/get-products-query.dto';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('urlImgs', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Product name already exists' })
  async create(
    @GetUser('_id') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    if (files?.length > 0) {
      createProductDto.urlImgs = files;
    }

    return this.productsService.create(createProductDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by name',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    type: Boolean,
    description: 'Filter by availability',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'digitalPrice', 'physicalPrice', 'createdAt', 'updatedAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('urlImgs', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product name already exists' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files?.length > 0) {
      updateProductDto.urlImgs = files;
    }
    console.log('updateProductDto', updateProductDto);

    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product by ID (Admin only - soft delete)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('category/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: GetProductsQueryDto,
  ) {
    return this.productsService.findAll({ ...query, categoryId });
  }
}
