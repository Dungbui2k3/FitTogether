import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  PAYOS = 'payos',
  BANK_TRANSFER = 'bank_transfer',
  COD = 'cod',
  WALLET = 'wallet',
}

@Schema({ timestamps: true })
export class Payment {
  @ApiProperty({ description: 'Order code from PayOS' })
  @Prop({ required: true, unique: true })
  orderCode: number;

  @ApiProperty({ description: 'User who made the payment' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({ description: 'Order being paid for' })
  @Prop({ type: Types.ObjectId, ref: 'Orders', required: true })
  orderId: Types.ObjectId;

  @ApiProperty({ description: 'Payment amount in VND' })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({ description: 'Payment description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'PayOS payment link ID' })
  @Prop()
  paymentLinkId?: string;

  @ApiProperty({ description: 'PayOS checkout URL' })
  @Prop()
  checkoutUrl?: string;

  @ApiProperty({ description: 'PayOS QR code' })
  @Prop()
  qrCode?: string;

  @ApiProperty({ description: 'Payment expiration date' })
  @Prop()
  expiredAt?: Date;

  @ApiProperty({ description: 'Transaction reference from bank' })
  @Prop()
  transactionReference?: string;

  @ApiProperty({ description: 'Transaction datetime' })
  @Prop()
  transactionDateTime?: Date;

  @ApiProperty({ description: 'PayOS webhook data' })
  @Prop({ type: Object })
  webhookData?: any;

  @ApiProperty({ description: 'Cancellation reason' })
  @Prop()
  cancellationReason?: string;

  @ApiProperty({ description: 'Payment cancelled at' })
  @Prop()
  cancelledAt?: Date;

  @ApiProperty({ description: 'Payment paid at' })
  @Prop()
  paidAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Add indexes
PaymentSchema.index({ orderCode: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });