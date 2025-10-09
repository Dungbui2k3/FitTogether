import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Put, 
  Delete, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SubFieldsService } from './subFields.service';
import { CreateSubFieldDto, UpdateSubFieldDto } from './dto';
import { Public, Roles } from 'src/decorators';
import { JwtAuthGuard, Role } from 'src/guards';

@ApiTags('SubFields')
@Controller('api/v1/subFields')
export class SubFieldsController {
  constructor(private readonly subFieldsService: SubFieldsService) {}

  @Post(':fieldId')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new sub-field (Admin or Field Owner only)' })
  @ApiParam({ name: 'fieldId', description: 'Field ID' })
  @ApiResponse({ status: 201, description: 'Sub-field created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  @ApiResponse({ status: 409, description: 'Sub-field name already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Field Owner access required' })
  async create(
    @Param('fieldId') fieldId: string,
    @Body() createSubFieldDto: CreateSubFieldDto,
  ) {
    return this.subFieldsService.create(createSubFieldDto, fieldId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all sub-fields with optional field filter' })
  @ApiQuery({ 
    name: 'fieldId', 
    required: false, 
    description: 'Filter by field ID' 
  })
  @ApiResponse({ status: 200, description: 'Sub-fields retrieved successfully' })
  async findAll(@Query('fieldId') fieldId?: string) {
    return this.subFieldsService.findAll(fieldId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get sub-field by ID' })
  @ApiParam({ name: 'id', description: 'Sub-field ID' })
  @ApiResponse({ status: 200, description: 'Sub-field retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Sub-field not found' })
  @ApiResponse({ status: 400, description: 'Invalid sub-field ID' })
  async findOne(@Param('id') id: string) {
    return this.subFieldsService.findById(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update sub-field by ID (Admin or Field Owner only)' })
  @ApiParam({ name: 'id', description: 'Sub-field ID' })
  @ApiResponse({ status: 200, description: 'Sub-field updated successfully' })
  @ApiResponse({ status: 404, description: 'Sub-field not found' })
  @ApiResponse({ status: 409, description: 'Sub-field name already exists' })
  @ApiResponse({ status: 400, description: 'Invalid sub-field ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Field Owner access required' })
  async update(
    @Param('id') id: string,
    @Body() updateSubFieldDto: UpdateSubFieldDto,
  ) {
    return this.subFieldsService.update(id, updateSubFieldDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.FIELD_OWNER)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete sub-field by ID (Admin or Field Owner only)' })
  @ApiParam({ name: 'id', description: 'Sub-field ID' })
  @ApiResponse({ status: 200, description: 'Sub-field deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sub-field not found' })
  @ApiResponse({ status: 400, description: 'Invalid sub-field ID' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Field Owner access required' })
  async remove(@Param('id') id: string) {
    return this.subFieldsService.remove(id);
  }

  @Public()
  @Get('field/:fieldId')
  @ApiOperation({ summary: 'Get sub-fields by field ID' })
  @ApiParam({ name: 'fieldId', description: 'Field ID' })
  @ApiResponse({ status: 200, description: 'Sub-fields retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid field ID' })
  async getByFieldId(@Param('fieldId') fieldId: string) {
    return this.subFieldsService.getByFieldId(fieldId);
  }
}
