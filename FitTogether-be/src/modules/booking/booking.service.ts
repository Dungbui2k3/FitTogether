import { SubField, SubFieldDocument } from 'src/schemas/subField.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto';
import { BookingRepository } from './booking.repository';
import { Booking, BookingDocument } from 'src/schemas/booking.schema';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    @InjectModel(SubField.name)
    private readonly subFieldModel: Model<SubFieldDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}
  async create(
    createBookingDto: CreateBookingDto,
    subFieldId: string,
    userId: string,
  ): Promise<any> {
    try {
      const { day, duration, totalPrice } = createBookingDto;

      // 1️⃣ Kiểm tra subFieldId hợp lệ và tồn tại
      if (!Types.ObjectId.isValid(subFieldId)) {
        throw new BadRequestException('Invalid subFieldId format');
      }

      const existingSubField = await this.subFieldModel.findById(subFieldId);
      if (!existingSubField) {
        throw new NotFoundException('Sub-field not found');
      }

      // 2️⃣ Kiểm tra trùng booking (subFieldId + day + duration)
      const existingBooking = await this.bookingModel.findOne({
        subFieldId,
        day,
        duration,
      });

      if (existingBooking) {
        throw new ConflictException(
          `Booking for this sub-field at ${duration} on ${day} already exists.`,
        );
      }

      // 3️⃣ Tạo mới Booking
      const newBooking = new this.bookingModel({
        subFieldId,
        userId,
        day,
        duration,
        totalPrice,
        status: 'confirmed',
      });

      const savedBooking = await newBooking.save();

      return {
        success: true,
        message: 'Booking created successfully',
        data: savedBooking,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create booking: ${error.message}`,
      );
    }
  }

  async getBookingsBySubField(subFieldId: string, day: string) {
    if (!Types.ObjectId.isValid(subFieldId)) {
      throw new BadRequestException('Invalid subFieldId format');
    }

    const bookings = await this.bookingModel
      .find({ subFieldId, day })
      .select('duration status userId -_id') // chỉ cần thông tin cần thiết
      .lean();

    return bookings;
  }

  // booking.service.ts
  async getSlots(subFieldId: string, day: string) {
    if (!Types.ObjectId.isValid(subFieldId)) {
      throw new BadRequestException('Invalid subFieldId format');
    }

    const bookings = await this.bookingModel
      .find({ subFieldId, day })
      .select('duration status -_id') // chỉ cần duration + trạng thái
      .lean();

    // Chuyển thành danh sách slot với trạng thái
    const allSlots = [
      '5:00 - 6:30',
      '6:40 - 8:10',
      '8:20 - 9:50',
      '10:00 - 11:30',
    ];
    const bookedSlots = new Set(bookings.map((b) => b.duration));

    const slotsWithStatus = allSlots.map((slot) => ({
      time: slot,
      isBooked: bookedSlots.has(slot),
    }));

    return slotsWithStatus;
  }

  async getBookingsByUserId(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId format');
    }

    const bookings = await this.bookingModel
    .find({ userId: new Types.ObjectId(userId) })
    .populate('userId', 'name email -_id')
    .populate({
      path: 'subFieldId',
      select: 'name type pricePerHour fieldId -_id', 
      populate: {
        path: 'fieldId',
        select: 'name -_id',
      },
    })
    .sort({ createdAt: -1 })
    .lean() 
    .exec();

    return bookings;
  }
}
