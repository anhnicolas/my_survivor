import { Body, Controller, Delete, FileTypeValidator, Get, HttpStatus, Param, ParseFilePipe, Patch, Post, Put, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CustomersService } from './customers.service';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { AUTHORIZED_ROLES, MANAGERS_ROLES } from '../auth/roles/constants';
import { CustomerAssignedResponse, CustomerCreatedResponse, CustomersResponse } from './dto/response.dto';
import { ReqUser } from '../dto/request.user.dto';
import { CustomerQuery } from './dto/query.dto';
import { CustomerAssignBody, CustomerBody } from './dto/body.dto';
import { NotFoundError } from '../dto/response.notFound.dto';
import { ConflictError } from '../dto/response.conflict.dto';
import { BadRequestError } from '../dto/response.badRequest.dto';

@Controller('customers')
@ApiTags('customers')
@ApiBearerAuth('token')
@UseGuards(AuthGuard, RolesGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  // POST : Create a new customer
  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Customer created', type: CustomerCreatedResponse })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Customer already exists', type: ConflictError })
  createCustomer(@Body() customer: CustomerBody, @UploadedFile(
    new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' }) ]})
  ) image: Express.Multer.File) {
    return this.customersService.createCustomer(customer, image);
  }

  // GET : All customers
  @Get()
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all customers', type: [CustomersResponse] })
  getCustomers(@Req() req: ReqUser) {
    return this.customersService.getCustomers(req);
  }

  // GET : Customer details
  @Get('/:customerId')
  @SetMetadata('roles', AUTHORIZED_ROLES)
  @ApiOperation({ summary: 'Get details of a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the customer details', type: CustomersResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found', type: NotFoundError })
  getCustomer(@Param() params: CustomerQuery) {
    return this.customersService.getCustomer(params);
  }

  // PATCH : Assign a customer to an employee
  @Patch('/:customerId/assign')
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Assign a coach to a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Coach assigned', type: CustomerAssignedResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer or Coach not found', type: NotFoundError })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Employee is not a coach', type: BadRequestError })
  assignCoach(@Param() params: CustomerQuery, @Body() body: CustomerAssignBody) {
    return this.customersService.assignCoach(params, body);
  }

  // PUT : Update the customer
  @Put('/:customerId')
  @UseInterceptors(FileInterceptor('image'))
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer updated', type: CustomersResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found', type: NotFoundError })
  updateCustomer(@Param() params: CustomerQuery, @Body() customer: CustomerBody) {
    return this.customersService.updateCustomer(params, customer);
  }

  // DELETE : Delete the customer
  @Delete('/:customerId')
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Customer deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found', type: NotFoundError })
  deleteCustomer(@Param() params: CustomerQuery) {
    return this.customersService.deleteCustomer(params);
  }
}
