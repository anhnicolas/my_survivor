import { Controller, Get, HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { TipsService } from './tips.service';
import { TipsResponse } from './dto/response.dto';
import { AUTHORIZED_ROLES } from '../auth/roles/constants';

@Controller('tips')
@ApiTags('tips')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
export class TipsController {
  constructor(private tipsService: TipsService) {}

  @Get()
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get all tips' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All tips', type: [TipsResponse] })
  getTips() {
    return this.tipsService.getTips();
  }
}
