import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  Logger,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Public } from '../../decorators/public.decorator';
import { GetUser } from '../../decorators/get-user.decorator';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus, PaymentMethod } from '../../schemas/payment.schema';
import { Types } from 'mongoose';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createPayment(
    @GetUser('id') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(userId, createPaymentDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(
    @Param('id') paymentId: string,
    @GetUser('id') userId: string,
  ) {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(paymentId)) {
      return { error: 'Invalid payment ID format' };
    }

    return this.paymentsService.getPaymentById(paymentId, userId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a pending payment' })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  @ApiResponse({
    status: 404,
    description: 'Payment not found or cannot be cancelled',
  })
  async cancelPayment(
    @Param('id') paymentId: string,
    @GetUser('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(paymentId)) {
      return { error: 'Invalid payment ID format' };
    }

    return this.paymentsService.cancelPayment(paymentId, userId, reason);
  }

  @Get('check-status/:orderCode')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status by order code' })
  @ApiResponse({
    status: 200,
    description: 'Payment status retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async checkPaymentStatus(@Param('orderCode') orderCode: string) {
    const orderCodeNumber = Number(orderCode);
    if (isNaN(orderCodeNumber)) {
      return { error: 'Invalid order code format' };
    }

    return this.paymentsService.checkPaymentStatus(orderCodeNumber);
  }

  @Post('webhook/payos')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'PayOS webhook endpoint',
    description: 'Receives payment status updates from PayOS',
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook data or signature',
  })
  async payosWebhook(@Body() webhookData: any) {
    try {
      this.logger.log('Received PayOS webhook:', JSON.stringify(webhookData));

      return await this.paymentsService.handleWebhook(webhookData);
    } catch (error) {
      this.logger.error('Error processing PayOS webhook:', error);
      throw error;
    }
  }

  @Post('callback/success')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Payment success callback',
    description: 'Handles successful payment callbacks from PayOS',
  })
  @ApiResponse({ status: 200, description: 'Payment success handled' })
  async paymentSuccess(@Body() callbackData: any) {
    try {
      this.logger.log(
        'Payment success callback:',
        JSON.stringify(callbackData),
      );

      // You can add additional success handling logic here
      // For now, we return success since the webhook will handle the actual status update
      return {
        success: true,
        message: 'Payment success callback received',
        data: callbackData,
      };
    } catch (error) {
      this.logger.error('Error processing payment success callback:', error);
      return {
        success: false,
        message: 'Error processing payment success callback',
      };
    }
  }

  @Post('callback/cancel')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Payment cancel callback',
    description: 'Handles cancelled payment callbacks from PayOS',
  })
  @ApiResponse({ status: 200, description: 'Payment cancel handled' })
  async paymentCancel(@Body() callbackData: any) {
    try {
      this.logger.log('Payment cancel callback:', JSON.stringify(callbackData));

      // You can add additional cancel handling logic here
      return {
        success: true,
        message: 'Payment cancel callback received',
        data: callbackData,
      };
    } catch (error) {
      this.logger.error('Error processing payment cancel callback:', error);
      return {
        success: false,
        message: 'Error processing payment cancel callback',
      };
    }
  }
}
