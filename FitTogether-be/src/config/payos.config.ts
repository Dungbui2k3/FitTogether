import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PayOSConfig {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  baseUrl: string;
}

@Injectable()
export class PayOSConfigService {
  private readonly config: PayOSConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      clientId: this.configService.get<string>('PAYOS_CLIENT_ID') || '',
      apiKey: this.configService.get<string>('PAYOS_API_KEY') || '',
      checksumKey: this.configService.get<string>('PAYOS_CHECKSUM_KEY') || '',
      baseUrl: 'https://api-merchant.payos.vn',
    };

    this.validateConfig();
  }

  private validateConfig(): void {
    const { clientId, apiKey, checksumKey } = this.config;
    
    if (!clientId || !apiKey || !checksumKey) {
      throw new Error(
        'PayOS credentials are not configured properly. Please set PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY in your environment variables.'
      );
    }
  }

  getConfig(): PayOSConfig {
    return { ...this.config };
  }

  getClientId(): string {
    return this.config.clientId;
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  getChecksumKey(): string {
    return this.config.checksumKey;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}