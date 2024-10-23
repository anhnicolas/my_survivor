import { HttpStatus, Injectable, Logger, InternalServerErrorException, UnauthorizedException, ConflictException, NotFoundException, Req, Param, Body, UploadedFile, ParseFilePipe, FileTypeValidator } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { Model } from "mongoose";
import { S3 } from "aws-sdk";

import { Authentification } from "./schemas/authentification.schema";
import { Employee } from "./schemas/employee.schema";
import { ReqUser } from "../dto/request.user.dto";
import { EmployeeFilter, EmployeeQuery } from "./dto/query.dto";
import { EmployeeBody, LoginBody } from "./dto/body.dto";
import { EmployeeCreatedResponse, LoginResponse } from "./dto/response.dto";

@Injectable()
export class EmployeesService {
  private readonly groupToken = new ConfigService().get('GROUP_TOKEN');
  private readonly passwordSalt = new ConfigService().get<number>('PASSWORD_SALT');
  private readonly logger = new Logger(EmployeesService.name);
  private readonly s3Client = new S3({
    region: 'eu-west-1',
    endpoint: new ConfigService().get('AWS_URL'),
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
    accessKeyId: new ConfigService().get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: new ConfigService().get('AWS_SECRET_ACCESS_KEY'),
  });
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  @InjectModel(Authentification.name) private readonly authentificationModel: Model<Authentification>;
  @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>;

  async login(auth: LoginBody): Promise<LoginResponse> {
    try {
      // Test if employee exists in the database
      const existingEmployee = await this.authentificationModel.findOne({ email: auth.email });
      if (existingEmployee) {
        const isPasswordMatching = await bcrypt.compare(auth.password, existingEmployee.password);
        if (!isPasswordMatching)
          throw new UnauthorizedException();
      } else {
        // const { access_token } = await this.loginRequest(auth);
        // if (!access_token)
        //   throw new UnauthorizedException();

        const hashedPassword = await this.hashPassword(auth.password);
        const newEmployee = new this.authentificationModel({ email: auth.email, password: hashedPassword });
        await newEmployee.save();
      }

      // Request employee data
      const employeeData = await this.getEmployeeData(auth.email);
      const payload = { email: auth.email, work: employeeData.work, id: employeeData.id };

      this.logger.log(`User ${auth.email} logged in`);
      return { access_token: (await this.jwtService.signAsync(payload)) };
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async createEmployee(@Body() employee: EmployeeBody, @UploadedFile(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' }) ]})) imageFile: Express.Multer.File): Promise<EmployeeCreatedResponse> {
    const existingEmployee = await this.employeeModel.findOne({ email: employee.email });
    if (existingEmployee)
      throw new ConflictException('Employee already exists');

    // Create new employee
    const objectId = new this.employeeModel().id;
    const newEmployee = new this.employeeModel({
      _id: objectId,
      email: employee.email,
      name: employee.name,
      surname: employee.surname,
      gender: employee.gender,
      work: employee.work,
      birthDate: employee.birthDate,
      image: `${new ConfigService().get('AWS_BUCKET_URL')}/employees/${objectId}.jpg`,
    });
    await newEmployee.save();

    // Upload image
    this.uploadImage(imageFile.buffer, newEmployee.id);

    // Create authentification
    const hashedPassword = await this.hashPassword(employee.password);
    const newAuthentification = new this.authentificationModel({ email: employee.email, password: hashedPassword });
    await newAuthentification.save();

    return { _id: newEmployee.id };
  }

  async getMe(@Req() req: ReqUser) {
    const employeeData = await this.getEmployeeData(req.user.email);
    return employeeData;
  }

  async getEmployees(@Param() params?: EmployeeFilter): Promise<Employee[]> {
    const employees = await this.employeeModel.find().exec();
    if (params)
      return employees.filter(employee => {
        if (params.email && !employee.email.includes(params.email))
          return false;
        if (params.name && !employee.name.includes(params.name))
          return false;
        if (params.surname && !employee.surname.includes(params.surname))
          return false;
        if (params.work && !employee.work.includes(params.work))
          return false;
        if (params.gender && !employee.gender.includes(params.gender))
          return false;
        if (params.birthDate && !employee.birthDate.includes(params.birthDate))
          return false;
        return true;
    });
    return employees;
  }

  async getEmployee(@Param() params: EmployeeQuery): Promise<Employee> {
    const employee = await this.employeeModel.findById(params.employeeId).select(['-idRef']).exec();
    if (!employee)
      throw new NotFoundException('Employee not found');
    return employee;
  }

  async patchEmployee(@Req() req: ReqUser, @Body() employee: EmployeeBody) {
    const existingEmployee = await this.employeeModel.findById(req.user.id);
    if (!existingEmployee)
      throw new NotFoundException('Employee not found');

    if (employee.password)
      employee.password = await this.hashPassword(employee.password);
    return await this.employeeModel.findByIdAndUpdate(req.user.id, employee, { new: true });
  }

  async putEmployee(@Param() params: EmployeeQuery, @Body() employee: EmployeeBody) {
    const existingEmployee = await this.employeeModel.findById(params.employeeId);
    if (!existingEmployee)
      throw new NotFoundException('Employee not found');

    if (employee.password)
      employee.password = await this.hashPassword(employee.password);
    return await this.employeeModel.findByIdAndUpdate(params.employeeId, employee, { new: true });
  }

  async deleteEmployee(@Param() params: EmployeeQuery) {
    const existingEmployee = await this.employeeModel.findById(params.employeeId);
    if (!existingEmployee)
      throw new NotFoundException('Employee not found');
    await this.employeeModel.findByIdAndDelete(params.employeeId);
  }

  private async loginRequest(auth: LoginBody) {
    const { data } = await firstValueFrom(
      this.httpService.post('https://soul-connection.fr/api/employees/login', auth, { headers: { 'X-Group-Authorization': this.groupToken }}).pipe(
        catchError((error: AxiosError) => {
          if (error.status === HttpStatus.UNAUTHORIZED)
            throw new UnauthorizedException();

          this.logger.error(`Error: ${error}`);
          throw new InternalServerErrorException(error);
        }),
      ),
    );
    return data;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(this.passwordSalt));
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  private async getEmployeeData(email: string) {
    const employeeData = await this.employeeModel.findOne({ email }).exec();
    if (!employeeData)
      throw new InternalServerErrorException('Employee not found');
    return employeeData;
  }

  private async uploadImage(image: Buffer, id: string) {
    await this.s3Client.putObject({
      Bucket: 'survivor',
      Key: `employees/${id}.jpg`,
      Body: image,
      ACL: 'public-read',
      ContentType: 'image/jpeg',
    }).promise();
  }
}
