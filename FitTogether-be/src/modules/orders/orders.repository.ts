import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Orders, OrdersDocument } from 'src/schemas/orders.schema';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<OrdersDocument>,
  ) {}

  async exists(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(id),
    });

    return !!order;
  }

  async findByOrderCode(orderCode: string): Promise<OrdersDocument | null> {
    return this.orderModel.findOne({
      orderCode,
    });
  }

  async findById(id: string): Promise<OrdersDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.orderModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  async findByUserId(userId: string): Promise<OrdersDocument[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    return this.orderModel.find({
      userId: new Types.ObjectId(userId),
    });
  }

  async countByStatus(status: string): Promise<number> {
    return this.orderModel.countDocuments({
      status,
    });
  }

  async countByUserId(userId: string): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) {
      return 0;
    }

    return this.orderModel.countDocuments({
      userId: new Types.ObjectId(userId),
    });
  }
}
