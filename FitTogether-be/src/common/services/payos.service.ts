import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { createHmac } from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { PayOSConfigService } from '../../config/payos.config';

export interface PayOSPaymentData {
  orderCode: number;
  amount: number;
  description: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PayOSCreatePaymentResponse {
  code: string;
  desc: string;
  data?: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string;
  };
  signature: string;
}

export interface PayOSWebhookData {
  code: string;
  desc: string;
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId?: string;
    counterAccountBankName?: string;
    counterAccountName?: string;
    counterAccountNumber?: string;
    virtualAccountName?: string;
    virtualAccountNumber?: string;
  };
  signature: string;
}

@Injectable()
export class PayOSService {
  private readonly logger = new Logger(PayOSService.name);
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly apiKey: string;
  private readonly checksumKey: string;

  constructor(private readonly payosConfig: PayOSConfigService) {
    const config = this.payosConfig.getConfig();
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.apiKey = config.apiKey;
    this.checksumKey = config.checksumKey;
  }

  /**
   * Create payment link
   */
  async createPaymentLink(
    paymentData: PayOSPaymentData,
  ): Promise<PayOSCreatePaymentResponse> {
    try {
      // Create object containing data to sign (only necessary fields)
      const dataToSign = {
        orderCode: paymentData.orderCode,
        amount: paymentData.amount,
        description: paymentData.description,
        returnUrl: paymentData.returnUrl,
        cancelUrl: paymentData.cancelUrl,
      };

      // Generate the signature string by sorting keys and concatenating key=value pairs
      const signatureString = Object.keys(dataToSign)
        .sort()
        .map((key) => `${key}=${dataToSign[key]}`)
        .join('&');

      // Generate HMAC SHA256 signature
      const signature = createHmac('sha256', this.checksumKey)
        .update(signatureString)
        .digest('hex');

      const requestBody = {
        orderCode: paymentData.orderCode,
        amount: paymentData.amount,
        description: paymentData.description,
        returnUrl: paymentData.returnUrl,
        cancelUrl: paymentData.cancelUrl,
        buyerName: paymentData.buyerName,
        buyerEmail: paymentData.buyerEmail,
        buyerPhone: paymentData.buyerPhone,
        signature,
        items: paymentData.items || [],
      };

      const response: AxiosResponse<PayOSCreatePaymentResponse> =
        await axios.post(`${this.baseUrl}/v2/payment-requests`, requestBody, {
          headers: {
            'x-client-id': this.clientId,
            'x-api-key': this.apiKey,
          },
        });
      return response.data;
    } catch (error) {
      this.logger.error(
        'Error creating PayOS payment link:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        `Failed to create payment link: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Get payment information
   */
  async getPaymentInfo(orderCode: number): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/payment-requests/${orderCode}`,
        {
          headers: {
            'x-client-id': this.clientId,
            'x-api-key': this.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Error getting PayOS payment info:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        `Failed to get payment info: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Cancel payment
   */
  async cancelPayment(
    orderCode: number,
    cancellationReason?: string,
  ): Promise<any> {
    try {
      const body = {
        cancellationReason: cancellationReason || 'User cancelled',
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/payment-requests/${orderCode}/cancel`,
        body,
        {
          headers: {
            'x-client-id': this.clientId,
            'x-api-key': this.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Error cancelling PayOS payment:',
        error.response?.data || error.message,
      );
      throw new BadRequestException(
        `Failed to cancel payment: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature: string, data: any): boolean {
    try {
      // Bỏ qua signature trong data trước khi verify
      const { signature: _, ...dataToVerify } = data;

      const dataString = JSON.stringify(dataToVerify);
      const expectedSignature = createHmac('sha256', this.checksumKey)
        .update(dataString)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Verify signature error:', error);
      return false;
    }
  }

  /**
   * Handle payment webhook
   */
  async handlePaymentWebhook(webhookData: any) {
    // This method should be implemented in the payments service
    // that handles database operations for payments
    console.info('PayOS Webhook received:', webhookData);
    return webhookData;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderCode: number) {
    return this.getPaymentInfo(orderCode);
  }

  /**
   * Generate unique order code
   */
  generateOrderCode(): number {
    // Generate a unique order code (you might want to use a more sophisticated approach)
    return Math.floor(Date.now() / 1000); // Unix timestamp
  }

  /**
   * Validate payment amount
   */
  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 500000000; // Max 500M VND
  }

  /**
   * Format amount to VND
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
}
