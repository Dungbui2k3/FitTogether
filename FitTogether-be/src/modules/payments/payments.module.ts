import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { Orders, OrdersSchema } from '../../schemas/orders.schema';
import { PayOSService } from '../../common/services/payos.service';
import { PayOSConfigService } from '../../config/payos.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Orders.name, schema: OrdersSchema },
    ]),
    ConfigModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PayOSService,
    PayOSConfigService,
  ],
  exports: [PaymentsService, PayOSService, PayOSConfigService],
})
export class PaymentsModule {}