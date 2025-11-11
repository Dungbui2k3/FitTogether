import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from 'src/schemas/booking.schema';
import { SubField, SubFieldDocument } from 'src/schemas/subField.schema';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async exists(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const product = await this.bookingModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });

    return !!product;
  }

  async findById(id: string): Promise<SubFieldDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.bookingModel.findOne({
      _id: new Types.ObjectId(id),
      isDeleted: { $ne: true },
    });
  }
}
