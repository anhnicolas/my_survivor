import { Body, Controller, Delete, FileTypeValidator, Get, HttpStatus, Param, ParseFilePipe, Patch, Post, Put, Query, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { EmployeesService } from './employees.service';
import { InternalError } from '../dto/response.internal.dto';
import { UnauthorizedError } from '../dto/response.unauthorized.dto';
import { ConflictError } from '../dto/response.conflict.dto';
import { NotFoundError } from '../dto/response.notFound.dto';
import { ReqUser } from '../dto/request.user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { MANAGERS_ROLES } from '../auth/roles/constants';
import { EmployeeCreatedResponse, EmployeeResponse, LoginResponse } from './dto/response.dto';
import { EmployeeBody, EmployeePatchBody, LoginBody } from './dto/body.dto';
import { EmployeeFilter, EmployeeQuery } from './dto/query.dto';

@Controller('employees')
@ApiTags('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  // POST : Login
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Logged-in', type: LoginResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid Credentials', type: UnauthorizedError })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error', type: InternalError })
  login(@Body() auth: LoginBody) {
    return this.employeesService.login(auth);
  }

  // POST : Create a new employee
  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Employee created', type: EmployeeCreatedResponse })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Employee already exists', type: ConflictError })
  createEmployee(@Body() employee: EmployeeBody, @UploadedFile(
    new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' }) ]})
  ) image: Express.Multer.File) {
    return this.employeesService.createEmployee(employee, image);
  }

  // PATCH : Update the employee
  @Patch('/update')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the employee data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee updated', type: EmployeeResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee not found', type: NotFoundError })
  patchEmployee(@Req() req: ReqUser, @Body() employee: EmployeePatchBody) {
    return this.employeesService.patchEmployee(req, employee);
  }

  // GET : My profile
  @Get('/me')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get my profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'My profile', type: EmployeeResponse })
  getMe(@Req() req: ReqUser) {
    return this.employeesService.getMe(req);
  }

  // GET : All employees filtered by role
  @Get()
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Get all employees with an optionnal filter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all employees', type: [EmployeeResponse] })
  getEmployeesFilter(@Query() params: EmployeeFilter) {
    return this.employeesService.getEmployees(params);
  }

  // GET : Employee details
  @Get('/:employeeId')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Get details of an employee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the employee details', type: EmployeeResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee not found', type: NotFoundError })
  getEmployee(@Param() params: EmployeeQuery) {
    return this.employeesService.getEmployee(params);
  }

  // PUT : Update the employee
  @Put('/:employeeId')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee updated', type: EmployeeResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee not found', type: NotFoundError })
  putEmployee(@Param() params: EmployeeQuery, @Body() employee: EmployeeBody) {
    return this.employeesService.putEmployee(params, employee);
  }

  // DELETE : Delete the employee
  @Delete('/:employeeId')
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', MANAGERS_ROLES)
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee not found', type: NotFoundError })
  deleteEmployee(@Param() params: EmployeeQuery) {
    return this.employeesService.deleteEmployee(params);
  }
}
