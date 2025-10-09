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
  @ApiOperation({ summary: 'Get all fields owned by current user with complete information including subFields (Field Owner or Admin only)' })
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
  @ApiResponse({ status: 200, description: 'My fields with complete information retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Field Owner or Admin access required' })
  async getMyFields(
    @Query() query: GetFieldsQueryDto,
    @GetUser('_id') userId: string,
  ) {
    return this.fieldsService.findByUserId(userId, query);
  }

  @Get('my-fields/stats')
  @Roles(Role.FIELD_OWNER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get statistics for fields owned by current user (Field Owner or Admin only)' })
  @ApiResponse({ status: 200, description: 'My fields statistics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Field Owner or Admin access required' })
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
  @ApiResponse({ status: 409, description: 'Field name or phone already exists' })
  @ApiResponse({ status: 400, description: 'Invalid field ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Field Owner access required' })
  async update(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files?.length > 0) {
      updateFieldDto.images = files;
    }

    return this.fieldsService.update(id, updateFieldDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete field by ID (Admin or Field Owner only - soft delete)' })
  @ApiParam({ name: 'id', description: 'Field ID' })
  @ApiResponse({ status: 200, description: 'Field deleted successfully' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  @ApiResponse({ status: 400, description: 'Invalid field ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Field Owner access required' })
  async remove(@Param('id') id: string) {
    return this.fieldsService.remove(id);
  }
}
