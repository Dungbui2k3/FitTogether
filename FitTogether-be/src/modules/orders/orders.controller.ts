import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrdersQueryDto, OrderStatus } from './dto/get-orders-query.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ActiveUserGuard } from '../../guards/active-user.guard';
import { RolesGuard, Role } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { GetUser } from '../../decorators/get-user.decorator';
import { ResponseUtil } from '../../common/utils/response.util';
import { PaymentsService } from '../payments/payments.service';
import { Types } from 'mongoose';

@ApiTags('Orders')
@Controller('api/v1/orders')
@UseGuards(JwtAuthGuard, ActiveUserGuard, RolesGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 404, description: 'Product not found or unavailable' })
  async create(
    @GetUser('_id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.ordersService.create(createOrderDto, userId);

    let paymentInfo: any = null;

    if (createOrderDto.paymentMethod === PaymentMethod.PAYOS) {
      try {
        const createPaymentDto = {
          orderId: (order as any)._id.toString(),
          orderCode: order.orderCode,
        };

        const paymentResult = await this.paymentsService.createPayment(
          userId,
          createPaymentDto,
        );

        if (paymentResult.status === 'success') {
          paymentInfo = paymentResult.data;
        }
      } catch (error) {
        console.error('Failed to create PayOS payment link:', error);
      }
    }

    const responseData: any = {
      id: (order as any)._id,
      orderCode: order.orderCode,
      items: order.items,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentMethod: (order as any).paymentMethod,
      note: (order as any).note,
      phone: (order as any).phone,
      address: (order as any).address,
      orderDate: order.orderDate,
      createdAt: (order as any).createdAt,
    };

    if (paymentInfo) {
      responseData.payment = {
        checkoutUrl: paymentInfo.checkoutUrl,
        qrCode: paymentInfo.qrCode,
        paymentId: paymentInfo.paymentId,
        orderCode: paymentInfo.orderCode,
        amount: paymentInfo.amount,
        formattedAmount: paymentInfo.formattedAmount,
        expiresAt: paymentInfo.expiresAt,
      };
    }

    return ResponseUtil.created(
      responseData,
      createOrderDto.paymentMethod === PaymentMethod.PAYOS && paymentInfo
        ? 'Order created successfully with PayOS payment link'
        : 'Order created successfully',
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all orders with pagination and filtering (Admin only)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter by order status',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by order code',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    description: 'Filter orders from date',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    description: 'Filter orders to date',
  })
  @ApiQuery({
    name: 'minAmount',
    required: false,
    type: Number,
    description: 'Minimum order amount',
  })
  @ApiQuery({
    name: 'maxAmount',
    required: false,
    type: Number,
    description: 'Maximum order amount',
  })
  async findAll(@Query() query: GetOrdersQueryDto) {
    // Additional validation for userId if provided
    if (query.userId && !Types.ObjectId.isValid(query.userId)) {
      console.error('Invalid userId in query parameters:', query.userId);
      throw new BadRequestException(
        `Invalid user ID format in query parameter: ${query.userId}`,
      );
    }

    const result = await this.ordersService.findAll(query);
    return ResponseUtil.success(result, 'Orders retrieved successfully');
  }

  @Get('my-orders')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter by order status',
  })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
  })
  async getMyOrders(
    @GetUser('_id') userId: string,
    @Query() query: GetOrdersQueryDto,
  ) {
    const result = await this.ordersService.getOrdersByUserId(userId, query);
    return ResponseUtil.success(result, 'Your orders retrieved successfully');
  }

  @Get('code/:orderCode')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get order by order code' })
  @ApiParam({
    name: 'orderCode',
    description: 'Order code (e.g., #12345678ABCD)',
  })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findByOrderCode(
    @Param('orderCode') orderCode: string,
    @GetUser('_id') userId: string,
    @GetUser() user: any,
  ) {
    const order = await this.ordersService.findByOrderCode(orderCode);

    // Check if user can access this order (admin or order owner)
    if (user.role !== Role.ADMIN && order.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return ResponseUtil.success(
      {
        id: (order as any)._id,
        orderCode: order.orderCode,
        items: order.items,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentMethod: (order as any).paymentMethod,
        note: (order as any).note,
        phone: (order as any).phone,
        address: (order as any).address,
        orderDate: order.orderDate,
        user: order.userId,
        createdAt: (order as any).createdAt,
        updatedAt: (order as any).updatedAt,
      },
      'Order retrieved successfully',
    );
  }

  @Get('user/:userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get orders by user ID (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter by order status',
  })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID format' })
  async getOrdersByUserId(
    @Param('userId') userId: string,
    @Query() query: GetOrdersQueryDto,
  ) {
    const result = await this.ordersService.getOrdersByUserId(userId, query);
    return ResponseUtil.success(result, 'User orders retrieved successfully');
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(
    @Param('id') id: string,
    @GetUser('_id') userId: string,
    @GetUser() user: any,
  ) {
    const order = await this.ordersService.findById(id);

    // Check if user can access this order (admin or order owner)
    if (user.role !== Role.ADMIN && order.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return ResponseUtil.success(
      {
        id: (order as any)._id,
        orderCode: order.orderCode,
        items: order.items,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentMethod: (order as any).paymentMethod,
        note: (order as any).note,
        phone: (order as any).phone,
        address: (order as any).address,
        orderDate: order.orderDate,
        user: order.userId,
        createdAt: (order as any).createdAt,
        updatedAt: (order as any).updatedAt,
      },
      'Order retrieved successfully',
    );
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update order by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.update(id, updateOrderDto);
    return ResponseUtil.success(
      {
        id: (order as any)._id,
        orderCode: order.orderCode,
        items: order.items,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentMethod: (order as any).paymentMethod,
        note: (order as any).note,
        phone: (order as any).phone,
        address: (order as any).address,
        orderDate: order.orderDate,
        user: order.userId,
        updatedAt: (order as any).updatedAt,
      },
      'Order updated successfully',
    );
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    const order = await this.ordersService.updateStatus(id, status);
    return ResponseUtil.success(
      {
        id: (order as any)._id,
        orderCode: order.orderCode,
        status: order.status,
        updatedAt: (order as any).updatedAt,
      },
      `Order status updated to ${status} successfully`,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return ResponseUtil.success(null, 'Order deleted successfully');
  }
}
