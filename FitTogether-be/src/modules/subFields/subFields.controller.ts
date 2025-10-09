import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubFieldsService } from './subFields.service';
import { CreateSubFieldDto } from './dto';

@ApiTags('SubFields')
@Controller('api/v1/subFields')
export class SubFieldsController {
  constructor(private readonly subFieldsService: SubFieldsService) {}

  @Post(':fieldId')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Product name already exists' })
  async create(
    @Param('fieldId') fieldId: string,
    @Body() createSubFieldDto: CreateSubFieldDto,
  ) {
    return this.subFieldsService.create(createSubFieldDto, fieldId);
  }

  @Get(':fieldId')
  @ApiOperation({ summary: 'Get subFields by fieldId' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getByFieldId(@Param('fieldId') fieldId: string) {
    return this.subFieldsService.getByFieldId(fieldId);
  }
}
