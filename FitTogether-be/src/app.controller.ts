import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { ResponseUtil } from './common/utils/response.util';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get application status' })
  getHello() {
    const data = this.appService.getHello();
    return ResponseUtil.success(data, 'Application is running');
  }
}