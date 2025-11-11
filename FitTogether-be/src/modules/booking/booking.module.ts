import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubField, SubFieldSchema } from 'src/schemas/subField.schema';
import { Booking, BookingSchema } from 'src/schemas/booking.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from './booking.repository';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubField.name, schema: SubFieldSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}