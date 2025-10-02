import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductsRepository } from './products.repository';
import { ResponseUtil } from '../../common/utils/response.util';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<any> {
    try {
      // Check if product name already exists
      const existingProduct = await this.productModel.findOne({
        name: createProductDto.name,
        isDeleted: { $ne: true },
      });

      if (existingProduct) {
        throw new ConflictException('Product with this name already exists');
      }

      // Validate category exists
      if (!Types.ObjectId.isValid(createProductDto.categoryId)) {
        throw new BadRequestException('Invalid category ID');
      }

      let uploadedUrls: string[] = [];

      // Upload files if provided
      if (createProductDto.urlImgs && createProductDto.urlImgs.length > 0) {
        const files = createProductDto.urlImgs.map((file) => ({
          buffer: file.buffer,
          originalName: file.originalname,
        }));

        const uploads = await this.cloudinaryService.uploadMultipleFiles(
          files,
          'image',
        );
        uploadedUrls = uploads.map((upload) => upload.secure_url);
      }

      const productData = {
        ...createProductDto,
        urlImgs: uploadedUrls,
        categoryId: new Types.ObjectId(createProductDto.categoryId),
      };

      const newProduct = new this.productModel(productData);
      const savedProduct = await newProduct.save();

      // Populate and return
      const populatedProduct = await this.productModel
        .findById(savedProduct._id)
        .populate('categoryId', 'name description')
        .exec();

      return ResponseUtil.created(
        this.formatProductResponse(populatedProduct),
        'Product created successfully',
      );
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create product: ${error.message}`,
      );
    }
  }

  async findAll(query: GetProductsQueryDto = {}): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        categoryId,
        available,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search,
      } = query;

      // Build filter object
      const filter: any = { isDeleted: { $ne: true } };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          // Add other fields to search if needed
        ];
      }

      if (name) {
        filter.name = { $regex: name, $options: 'i' };
      }

      if (categoryId && Types.ObjectId.isValid(categoryId)) {
        filter.categoryId = new Types.ObjectId(categoryId);
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter: any = {};
        if (minPrice !== undefined) priceFilter.$gte = minPrice;
        if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
        filter.price = priceFilter;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get total count
      const total = await this.productModel.countDocuments(filter);

      // Get products with pagination and populate
      const products = await this.productModel
        .find(filter)
        .populate('categoryId', 'name description')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      const formattedProducts = products.map((product: any) =>
        this.formatProductResponse(product),
      );

      return ResponseUtil.success(
        {
          products: formattedProducts,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        },
        'Products retrieved successfully',
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve products: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid product ID');
      }

      const product = await this.productModel
        .findOne({ _id: id, isDeleted: { $ne: true } })
        .populate('categoryId', 'name description')
        .exec();

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return ResponseUtil.success(
        this.formatProductResponse(product),
        'Product retrieved successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve product: ${error.message}`,
      );
    }
  }

  async update(id: string, updateProductDto: any): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid product ID');
      }

      const existingProduct = await this.productModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });
      if (!existingProduct) throw new NotFoundException('Product not found');

      // check name conflict
      if (
        updateProductDto.name &&
        updateProductDto.name !== existingProduct.name
      ) {
        const conflict = await this.productModel.findOne({
          name: updateProductDto.name,
          _id: { $ne: id },
          isDeleted: { $ne: true },
        });
        if (conflict)
          throw new ConflictException('Product with this name already exists');
      }

      let finalUrls = [...(existingProduct.urlImgs || [])];

      // 1. Delete old images
      if (updateProductDto.removedImgs?.length) {
        try {
          await this.cloudinaryService.deleteMultipleFiles(
            updateProductDto.removedImgs,
            'image',
          );
        } catch (error) {
          console.warn(
            'Failed to delete some images from Cloudinary:',
            error.message,
          );
        }
        finalUrls = finalUrls.filter(
          (u) => !updateProductDto.removedImgs.includes(u),
        );
      }

      // 2. Upload new images
      if (updateProductDto.urlImgs?.length) {
        const files = updateProductDto.urlImgs.map((file) => ({
          buffer: file.buffer,
          originalName: file.originalname,
        }));

        const uploads = await this.cloudinaryService.uploadMultipleFiles(
          files,
          'image',
        );
        finalUrls.push(...uploads.map((u) => u.secure_url));
      }

      // 3. Chuẩn bị updateData
      const updateData: any = {
        ...updateProductDto,
        urlImgs: finalUrls,
      };

      if (updateProductDto.categoryId) {
        if (!Types.ObjectId.isValid(updateProductDto.categoryId)) {
          throw new BadRequestException('Invalid category ID');
        }
        updateData.categoryId = new Types.ObjectId(updateProductDto.categoryId);
      }

      const updated = await this.productModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .populate('categoryId', 'name description')
        .exec();

      return ResponseUtil.success(
        this.formatProductResponse(updated),
        'Product updated successfully',
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
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid product ID');
      }

      const product = await this.productModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Soft delete
      await this.productModel.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
      });

      return ResponseUtil.success(null, 'Product deleted successfully');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete product: ${error.message}`,
      );
    }
  }

  private formatProductResponse(product: any) {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      nation: product.nation,
      category: product.categoryId
        ? {
            _id: product.categoryId._id,
            name: product.categoryId.name,
            description: product.categoryId.description,
          }
        : null,
      price: product.price,
      quantity: product.quantity,
      urlImgs: product.urlImgs,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
