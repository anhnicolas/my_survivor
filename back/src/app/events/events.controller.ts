import { Controller, Get, HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EventsService } from './events.service';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { AUTHORIZED_ROLES } from '../auth/roles/constants';
import { EventsResponse } from './dto/response.dto';

@Controller('events')
@ApiTags('events')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  // GET : All events
  @Get()
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all events', type: [EventsResponse] })
  getEvents() {
    return this.eventsService.getEvents();
  }
}
