import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    ProductsRepository,
    CloudinaryProvider,
    CloudinaryService
  ],
  exports: [ProductsService, CloudinaryService]
})
export class ProductsModule {}
