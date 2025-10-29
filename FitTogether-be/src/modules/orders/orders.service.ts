import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersQueryDto, OrderStatus } from './dto/get-orders-query.dto';
import { Orders, OrdersDocument } from '../../schemas/orders.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private orderModel: Model<OrdersDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<Orders> {
    // Verify user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify all products exist
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.productModel
      .find({
        _id: { $in: productIds },
        isDeleted: { $ne: true },
      })
      .lean();

    // Calculate items with prices and validate quantities
    const itemsWithPrice = createOrderDto.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      const price = product.price;
      const quantity = item.type === 'digital' ? 1 : item.quantity;

      // Validate digital product quantity
      if (item.type === 'digital' && item.quantity !== 1) {
        throw new BadRequestException('Digital product quantity must be 1');
      }

      // Check if product has enough quantity for physical products
      if (item.type === 'physical' && product.quantity < quantity) {
        throw new BadRequestException(
          `Not enough quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${quantity}`,
        );
      }

      return {
        productId: new Types.ObjectId(item.productId),
        type: item.type,
        quantity,
        price,
      };
    });

    const generateOrderCode = this.generateOrderCode();

    const newOrder = new this.orderModel({
      userId: new Types.ObjectId(userId),
      orderCode: generateOrderCode,
      items: itemsWithPrice,
      status: OrderStatus.PENDING,
      totalAmount:
        createOrderDto.totalAmount ||
        itemsWithPrice.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      paymentMethod: createOrderDto.paymentMethod,
      notes: createOrderDto.notes || '',
      phone: createOrderDto.phone || '',
      address: createOrderDto.address || '',
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    // Update product quantities for physical products
    for (const item of itemsWithPrice) {
      if (item.type === 'physical') {
        await this.productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: -item.quantity } },
          { new: true },
        );
      }
    }

    await savedOrder.populate({
      path: 'items.productId',
      select: 'name urlImgs price',
    });

    return savedOrder as Orders;
  }

  async findAll(query: GetOrdersQueryDto = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      search,
      fromDate,
      toDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minAmount,
      maxAmount,
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      // Validate userId is a valid ObjectId before using it
      if (!Types.ObjectId.isValid(userId)) {
        console.error('Invalid userId received in findAll:', userId);
        throw new BadRequestException(`Invalid user ID format: ${userId}`);
      }
      filter.userId = new Types.ObjectId(userId);
    }

    if (search) {
      filter.$or = [
        { orderCode: { $regex: search, $options: 'i' } },
        // Add user name/email search through populate if needed
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.orderDate = {};
      if (fromDate) filter.orderDate.$gte = new Date(fromDate);
      if (toDate) filter.orderDate.$lte = new Date(toDate);
    }

    // Amount range filter
    if (minAmount !== undefined || maxAmount !== undefined) {
      filter.totalAmount = {};
      if (minAmount !== undefined) filter.totalAmount.$gte = minAmount;
      if (maxAmount !== undefined) filter.totalAmount.$lte = maxAmount;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count for pagination info
    const total = await this.orderModel.countDocuments(filter);

    // Get orders with pagination and population
    const orders = await this.orderModel
      .find(filter)
      .populate('userId', 'name email')
      .populate('items.productId', 'name urlImgs price')
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id: string): Promise<Orders> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name urlImgs price')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderCode(orderCode: string): Promise<Orders> {
    const order = await this.orderModel
      .findOne({ orderCode })
      .populate('userId', 'name email')
      .populate('items.productId', 'name urlImgs price')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with code ${orderCode} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Orders> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Validate status transitions
    if (
      updateOrderDto.status &&
      !this.isValidStatusTransition(order.status, updateOrderDto.status)
    ) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${updateOrderDto.status}`,
      );
    }

    // Handle quantity restoration when order is cancelled
    if (
      updateOrderDto.status === OrderStatus.CANCEL &&
      order.status !== OrderStatus.CANCEL
    ) {
      // Restore product quantities for physical products
      for (const item of order.items) {
        await this.productModel.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.quantity } },
          { new: true },
        );
      }
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('userId', 'name email')
      .populate('items.productId', 'name urlImgs price')
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Orders> {
    return this.update(id, { status });
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async getOrdersByUserId(
    userId: string,
    query: GetOrdersQueryDto = {},
  ): Promise<any> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Add userId to query filter
    const userQuery = { ...query, userId };
    return this.findAll(userQuery);
  }

  /**
   * Check if products have enough quantity for the order
   */
  private async validateProductAvailability(
    items: { productId: string; type: string; quantity: number }[],
  ): Promise<void> {
    const productIds = items.map((item) => item.productId);
    const products = await this.productModel
      .find({
        _id: { $in: productIds },
        isDeleted: { $ne: true },
      })
      .lean();

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (item.type === 'physical' && product.quantity < item.quantity) {
        throw new BadRequestException(
          `Not enough quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        );
      }
    }
  }

  private isValidStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): boolean {
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.SUCCESS, OrderStatus.CANCEL],
      [OrderStatus.SUCCESS]: [], // Cannot change from success
      [OrderStatus.CANCEL]: [], // Cannot change from cancel
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
  private generateOrderCode(): string {
    return `ORD-${Date.now().toString().slice(-3) + Math.floor(Math.random() * 1000)}`;
  }
}
