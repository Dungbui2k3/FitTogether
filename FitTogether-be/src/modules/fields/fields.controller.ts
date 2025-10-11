import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { GetFieldsQueryDto } from './dto/get-fields-query.dto';
import { GetUser, Public, Roles } from 'src/decorators';
import { JwtAuthGuard, Role } from 'src/guards';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@ApiTags('Fields')
@Controller('api/v1/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new field (Admin or Field Owner only)' })
  @ApiResponse({ status: 201, description: 'Field created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Field name or phone already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Field Owner access required' })
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFieldDto: CreateFieldDto,
    @GetUser('_id') userId: string,
  ) {
    if (files?.length > 0) {
      createFieldDto.images = files;
    }

    return this.fieldsService.create(createFieldDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all fields with pagination and filtering' })
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
    name: 'name',
    required: false,
    type: String,
    description: 'Search by name',
  })
  @ApiQuery({
    name: 'address',
    required: false,
    type: String,
    description: 'Search by address',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'General search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'address', 'createdAt', 'updatedAt'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiResponse({ status: 200, description: 'Fields retrieved successfully' })
  async findAll(@Query() query: GetFieldsQueryDto) {
    return this.fieldsService.findAll(query);
  }

  @Get('my-fields')
  @Roles(Role.FIELD_OWNER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Get all fields owned by current user with complete information including subFields (Field Owner or Admin only)',
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
    name: 'name',
    required: false,
    type: String,
    description: 'Search by field name',
  })
  @ApiQuery({
    name: 'address',
    required: false,
    type: String,
    description: 'Search by address',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: 'Search by phone',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiResponse({
    status: 200,
    description: 'My fields with complete information retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Field Owner or Admin access required',
  })
  async getMyFields(
    @Query() query: GetFieldsQueryDto,
    @GetUser('_id') userId: string,
  ) {
    return this.fieldsService.findByUserId(userId, query);
  }

  @Get('my-fields/stats')
  @Roles(Role.FIELD_OWNER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Get statistics for fields owned by current user (Field Owner or Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'My fields statistics retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Field Owner or Admin access required',
  })
  async getMyFieldsStats(@GetUser('_id') userId: string) {
    return this.fieldsService.getFieldsStatsByUserId(userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get field by ID' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({ status: 200, description: 'Field retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  @ApiResponse({ status: 400, description: 'Invalid field ID' })
  async findOne(@Param('id') id: string) {
    return this.fieldsService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update field by ID (Admin or Field Owner only)' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({ status: 200, description: 'Field updated successfully' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  @ApiResponse({
    status: 409,
    description: 'Field name or phone already exists',
  })
  @ApiResponse({ status: 400, description: 'Invalid field ID' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Field Owner access required',
  })
  async update(
    @Param('id') id: string,
    @Body() body: any, // Nhận tạm body raw từ FormData
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // 1️⃣ Parse subFields JSON string nếu tồn tại
    if (body.subFields) {
      try {
        body.subFields = JSON.parse(body.subFields);
      } catch (e) {
        throw new BadRequestException('subFields JSON không hợp lệ');
      }
    }

    // 2️⃣ Sanitize subFields chỉ giữ các field hợp lệ
    if (body.subFields && Array.isArray(body.subFields)) {
      body.subFields = body.subFields.map((s: any) => ({
        _id: s._id,
        name: s.name,
        type: s.type,
        pricePerHour: s.pricePerHour,
        status: s.status || 'available', // Keep original status or default to available
      }));
    }

    // 3️⃣ Nếu có files upload, gán vào body
    if (files?.length > 0) {
      body.images = files;
    }

    // 4️⃣ Transform body thành DTO và validate
    const updateFieldDto = plainToInstance(UpdateFieldDto, body);
    const errors = await validate(updateFieldDto);
    if (errors.length) {
      throw new BadRequestException(errors);
    }

    // 5️⃣ Gọi service update
    return this.fieldsService.update(id, updateFieldDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete field by ID (Admin or Field Owner only - soft delete)',
  })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({ status: 200, description: 'Field deleted successfully' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  @ApiResponse({ status: 400, description: 'Invalid field ID' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Field Owner access required',
  })
  async remove(@Param('id') id: string) {
    return this.fieldsService.remove(id);
  }
}
