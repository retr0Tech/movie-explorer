import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Health check', description: 'Simple health check endpoint' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
