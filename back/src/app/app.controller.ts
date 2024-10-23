import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.I_AM_A_TEAPOT)
  @ApiOperation({ summary: 'Home page' })
  @ApiResponse({ status: 418, description: 'I am a teapot', schema: { example: { statusCode: 418, message: 'I am a teapot.' } } })
  getTeapot(): { message: string } {
    return this.appService.getTeapot();
  }
}
