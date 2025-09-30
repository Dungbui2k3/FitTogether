import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentDocument, PaymentStatus } from '../../schemas/payment.schema';
import { Orders, OrdersDocument } from '../../schemas/orders.schema';
import { PayOSService, PayOSPaymentData, PayOSWebhookData } from '../../common/services/payos.service';
import { ResponseUtil } from '../../common/utils/response.util';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Orders.name) private ordersModel: Model<OrdersDocument>,
    private readonly payosService: PayOSService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new payment
   */
  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    try {
      // Validate order
      const order = await this.ordersModel
        .findOne({
          _id: createPaymentDto.orderId,
          userId: new Types.ObjectId(userId),
        })
        .exec();

      if (!order) {
        throw new NotFoundException('Order not found or does not belong to user');
      }

      // Check if payment already exists for this order
      const existingPayment = await this.paymentModel
        .findOne({ orderId: new Types.ObjectId(createPaymentDto.orderId) })
        .exec();

      if (existingPayment) {
        throw new BadRequestException('Payment already exists for this order');
      }

      const totalAmount = order.totalAmount;

      // Validate amount
      if (!this.payosService.validateAmount(totalAmount)) {
        throw new BadRequestException('Invalid payment amount');
      }

      // Generate PayOS order code
      const payosOrderCode = this.payosService.generateOrderCode();

      // Create PayOS payment data
      const payosPaymentData: PayOSPaymentData = {
        orderCode: payosOrderCode,
        amount: totalAmount,
        description: `Order ${order.orderCode}`,
        items: order.items.map(item => ({
          name: `Item ${item.productId}`,
          quantity: item.quantity,
          price: item.price,
        })),
        returnUrl: `${this.configService.get('FRONTEND_URL')}/payment/success`,
        cancelUrl: `${this.configService.get('FRONTEND_URL')}/payment/cancel`,
      };

      // Create payment link with PayOS
      const payosResponse = await this.payosService.createPaymentLink(payosPaymentData);

      if (payosResponse.code !== '00') {
        this.logger.error('PayOS Error Response:', payosResponse);
        throw new BadRequestException(`PayOS Error: ${payosResponse.desc || 'Payment creation failed'}`);
      }

      // Create payment record in database with all required fields
      const payment = new this.paymentModel({
        userId: new Types.ObjectId(userId),
        orderId: new Types.ObjectId(createPaymentDto.orderId),
        orderCode: payosOrderCode,
        amount: totalAmount,
        description: `Order ${order.orderCode}`,
        status: PaymentStatus.PENDING,
        paymentLinkId: payosResponse.data?.paymentLinkId,
        checkoutUrl: payosResponse.data?.checkoutUrl,
        qrCode: payosResponse.data?.qrCode,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes default
        webhookData: payosResponse.data,
      });

      await payment.save();

      // Return response
      return ResponseUtil.created({
        paymentId: payment._id,
        orderCode: payosOrderCode,
        amount: totalAmount,
        formattedAmount: this.payosService.formatAmount(totalAmount),
        checkoutUrl: payosResponse.data?.checkoutUrl,
        qrCode: payosResponse.data?.qrCode,
        order: {
          id: order._id,
          orderCode: order.orderCode,
          totalAmount: order.totalAmount,
        },
        status: PaymentStatus.PENDING,
        expiresAt: payment.expiredAt || new Date(Date.now() + 15 * 60 * 1000),
      }, 'Payment created successfully');

    } catch (error) {
      this.logger.error('Error creating payment:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create payment: ${error.message}`);
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string, userId?: string) {
    try {
      const query: any = { _id: paymentId };
      if (userId) {
        query.userId = userId;
      }

      const payment = await this.paymentModel
        .findOne(query)
        .populate('orderId')
        .populate('userId', 'name email')
        .exec();

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return ResponseUtil.success({
        id: payment._id,
        orderCode: payment.orderCode,
        amount: payment.amount,
        formattedAmount: this.payosService.formatAmount(payment.amount),
        status: payment.status,
        description: payment.description,
        checkoutUrl: payment.checkoutUrl,
        qrCode: payment.qrCode,
        transactionReference: payment.transactionReference,
        transactionDateTime: payment.transactionDateTime,
        order: payment.orderId,
        user: payment.userId,
        paidAt: payment.paidAt,
        cancelledAt: payment.cancelledAt,
        cancellationReason: payment.cancellationReason,
        expiredAt: payment.expiredAt,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      }, 'Payment retrieved successfully');

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to retrieve payment: ${error.message}`);
    }
  }

  /**
   * Handle PayOS webhook
   */
  async handleWebhook(webhookData: PayOSWebhookData) {
    try {
      this.logger.log('Processing PayOS webhook:', JSON.stringify(webhookData));

      // Verify signature
      if (!this.payosService.verifyWebhookSignature(webhookData.signature, webhookData)) {
        this.logger.warn('Invalid webhook signature');
        throw new BadRequestException('Invalid signature');
      }

      const { data } = webhookData;
      const orderCode = data.orderCode;

      // Find payment
      const payment = await this.paymentModel.findOne({ orderCode });
      if (!payment) {
        this.logger.warn(`Payment not found for order code: ${orderCode}`);
        throw new NotFoundException('Payment not found');
      }

      // Update payment based on webhook data
      const updateData: any = {
        webhookData: data,
        transactionReference: data.reference,
        transactionDateTime: new Date(data.transactionDateTime),
      };

      // Determine status based on webhook code
      if (data.code === '00') {
        // Payment successful
        updateData.status = PaymentStatus.PAID;
        updateData.paidAt = new Date();
        this.logger.log(`Payment ${orderCode} marked as PAID`);
      } else {
        // Payment failed or cancelled
        updateData.status = PaymentStatus.FAILED;
        this.logger.log(`Payment ${orderCode} marked as FAILED with code: ${data.code}`);
      }

      // Update payment
      await this.paymentModel.updateOne({ _id: payment._id }, updateData);

      return { message: 'Webhook processed successfully' };

    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to process webhook: ${error.message}`);
    }
  }

  /**
   * Cancel payment
   */
  async cancelPayment(paymentId: string, userId: string, reason?: string) {
    try {
      const payment = await this.paymentModel.findOne({ 
        _id: paymentId, 
        userId: new Types.ObjectId(userId),
        status: PaymentStatus.PENDING 
      });

      if (!payment) {
        throw new NotFoundException('Payment not found or cannot be cancelled');
      }

      // Cancel with PayOS
      await this.payosService.cancelPayment(payment.orderCode, reason);

      // Update payment status
      await this.paymentModel.updateOne(
        { _id: payment._id },
        {
          status: PaymentStatus.CANCELLED,
          cancellationReason: reason || 'Cancelled by user',
          cancelledAt: new Date(),
        }
      );

      return ResponseUtil.success(null, 'Payment cancelled successfully');

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to cancel payment: ${error.message}`);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderCode: number) {
    try {
      // Get from PayOS
      const payosInfo = await this.payosService.getPaymentInfo(orderCode);
      
      // Get from database
      const payment = await this.paymentModel.findOne({ orderCode });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      return ResponseUtil.success({
        orderCode,
        localStatus: payment.status,
        payosStatus: payosInfo.data?.status,
        amount: payment.amount,
        formattedAmount: this.payosService.formatAmount(payment.amount),
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      }, 'Payment status retrieved successfully');

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to check payment status: ${error.message}`);
    }
  }
}