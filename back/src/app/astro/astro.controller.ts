import { Controller, Get, HttpStatus, Param, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AstroService } from './astro.service';
import { CompatibilityQuery } from './dto/query.dto';
import { CompatibilityResponse } from './dto/response.dto';
import { BadRequestError } from 'src/app/dto/response.badRequest.dto';
import { NotFoundError } from 'src/app/dto/response.notFound.dto';
import { AUTHORIZED_ROLES } from '../auth/roles/constants';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('astro')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('astro')
export class AstroController {
  constructor(private astroService: AstroService) {}

  @Get('compatibility/:customerRefId/:customerTargetId')
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get the compability of two clients' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The compability of two clients', type: CompatibilityResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: BadRequestError })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: NotFoundError })
  getCompatibility(@Param() params: CompatibilityQuery) {
    return this.astroService.getCompatibility(params);
  }
}
