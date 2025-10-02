import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from '../../schemas/orders.schema';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrdersSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PaymentsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
