import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfig implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = this.configService.get<string>('database.uri') || 'mongodb://localhost:27017/nestjs-auth';
    
    return {
      uri,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      // Event listeners
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('🚀 MongoDB connected successfully!');
        });
        
        connection.on('error', (error) => {
          console.error('❌ MongoDB connection error:', error.message);
        });
        
        connection.on('disconnected', () => {
          console.warn('⚠️ MongoDB disconnected');
        });
        
        connection.on('reconnected', () => {
          console.log('🔄 MongoDB reconnected successfully!');
        });
        
        return connection;
      },
    };
  }
}