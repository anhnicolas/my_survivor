import { Controller, Get, HttpStatus, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaymentsService } from './payments.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { MANAGERS_ROLES } from '../auth/roles/constants';
import { PaymentQuery } from './dto/query.dto';
import { PaymentResponse } from './dto/response.dto';

@Controller('payments')
@ApiTags('payments')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // GET : Get all payments
  @Get()
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Get all payments with an optionnal filter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all payments', type: [PaymentResponse] })
  getAllPayments(@Query() params: PaymentQuery) {
    return this.paymentsService.getAllPayments(params);
  }
}
