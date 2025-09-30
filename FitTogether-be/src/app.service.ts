import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string, status: string } {
    return { 
        message: 'NestJS Authentication API is running!',
        status: 'OK',
     };
  }
}