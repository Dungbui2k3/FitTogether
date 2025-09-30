import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from '../../schemas/orders.schema';
import { Product3D, Product3DSchema } from '../../schemas/product3D.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrdersSchema },
      { name: Product3D.name, schema: Product3DSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PaymentsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
