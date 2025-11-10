import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookingDto } from './dto';
import { GetUser } from 'src/decorators';
import { User } from 'src/schemas/user.schema';
import { BookingService } from './booking.service';

@ApiTags('Booking')
@Controller('api/v1/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(':subFieldId')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Product name already exists' })
  async create(
    @Param('subFieldId') subFieldId: string,
    @Body() createBookingDto: CreateBookingDto,
    @GetUser('_id') userId: string,
  ) {
    return this.bookingService.create(createBookingDto, subFieldId, userId);
  }

  @Get('history-booking/:userId')
  async getBookingsByUserId(@Param('userId') userId: string) {
    const slots = await this.bookingService.getBookingsByUserId(userId);
    return { success: true, data: slots };
  }

  @Get(':subFieldId/:day')
  async getBookings(
    @Param('subFieldId') subFieldId: string,
    @Param('day') day: string,
  ) {
    const bookings = await this.bookingService.getBookingsBySubField(
      subFieldId,
      day,
    );
    return { success: true, data: bookings };
  }

  @Get('slots/:subFieldId/:day')
  async getSlots(
    @Param('subFieldId') subFieldId: string,
    @Param('day') day: string,
  ) {
    const slots = await this.bookingService.getSlots(subFieldId, day);
    return { success: true, data: slots };
  }

  @Get('history-booking/owner/:fieldId')
  async getOwnerBookingHistory (@Param('fieldId') fieldId: string) {
    const slots = await this.bookingService.getOwnerBookingHistory(fieldId);
    return { success: true, data: slots };
  }
}
