import { Controller, Get, HttpStatus, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EncountersService } from './encounters.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AUTHORIZED_ROLES } from '../auth/roles/constants';
import { EncounterQuery } from './dto/query.dto';
import { EncounterResponse } from './dto/response.dto';

@Controller('encounters')
@ApiTags('encounters')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
export class EncountersController {
  constructor(private encountersService: EncountersService) {}

  // GET : Get all encounters
  @Get()
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get all encounters with an optionnal filter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all encounters', type: [EncounterResponse] })
  getAllEncounters(@Query() params: EncounterQuery) {
    return this.encountersService.getAllEncounters(params);
  }
}
