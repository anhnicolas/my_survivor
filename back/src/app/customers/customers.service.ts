import { BadRequestException, Body, ConflictException, FileTypeValidator, Injectable, NotFoundException, Param, ParseFilePipe, Req, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';

import { ReqUser } from '../dto/request.user.dto';
import { Customer } from './schemas/customer.schema';
import { Employee } from '../employees/schemas/employee.schema';
import { CustomerQuery } from './dto/query.dto';
import { CustomerAssignBody, CustomerBody } from './dto/body.dto';
import { CustomerAssignedResponse, CustomerCreatedResponse } from './dto/response.dto';

@Injectable()
export class CustomersService {
  private readonly s3Client = new S3({
    region: 'eu-west-1',
    endpoint: new ConfigService().get('AWS_URL'),
    signatureVersion: 'v4',
    s3ForcePathStyle: true,
    accessKeyId: new ConfigService().get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: new ConfigService().get('AWS_SECRET_ACCESS_KEY'),
  });
  constructor() {}

  @InjectModel(Customer.name) private readonly customerModel: Model<Customer>;
  @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>;

  async createCustomer(@Body() customer: CustomerBody, @UploadedFile(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'image/jpeg' }) ]})) imageFile: Express.Multer.File): Promise<CustomerCreatedResponse> {
    const existingCustomer = await this.customerModel.findOne({ email: customer.email });
    if (existingCustomer)
      throw new ConflictException('Customer already exists');

    // Create new customer
    const objectId = new this.customerModel().id;
    const newCustomer = new this.customerModel({
      _id: objectId,
      idCoach: null,
      email: customer.email,
      name: customer.name,
      surname: customer.surname,
      birthDate: customer.birthDate,
      gender: customer.gender,
      description: customer.description,
      astrologicalSign: customer.astrologicalSign,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      image: `${new ConfigService().get('AWS_BUCKET_URL')}/customers/${objectId}.jpg`,
      clothes: [],
    });
    await newCustomer.save();

    // Upload image
    this.uploadImage(imageFile.buffer, newCustomer.id);
    return { _id: newCustomer.id };
  }

  async getCustomers(@Req() req: ReqUser): Promise<Customer[]> {
    const { id, work } = req.user;
    return await this.getRelatedCustomers(id, work);
  }

  async getCustomer(@Param() params: CustomerQuery): Promise<Customer> {
    const customer = await this.customerModel.findById(params.customerId).exec();
    if (!customer)
      throw new NotFoundException('Customer not found');
    return customer;
  }

  async assignCoach(@Param() params: CustomerQuery, @Body() body: CustomerAssignBody): Promise<CustomerAssignedResponse> {
    const customer = await this.customerModel.findById(params.customerId).exec();
    if (!customer)
      throw new NotFoundException('Customer not found');

    // Find the coach if not empty
    const coach = await this.employeeModel.findById(body.coachId).exec();
    if (!coach)
      throw new NotFoundException('Coach not found');
    if (coach.work != 'Coach')
      throw new BadRequestException('Employee is not a coach');

    customer.idCoach = body.coachId;
    await customer.save();
    return { id: body.coachId };
  }

  async updateCustomer(@Param() params: CustomerQuery, @Body() customer: CustomerBody) {
    const existingCustomer = await this.customerModel.findById(params.customerId);
    if (!existingCustomer)
      throw new NotFoundException('Customer not found');

    // this.uploadImage(imageFile.buffer, params.customerId);
    return await this.customerModel.findByIdAndUpdate(params.customerId, customer).exec();
  }

  async deleteCustomer(@Param() params: CustomerQuery) {
    const existingCustomer = await this.customerModel.findById(params.customerId);
    if (!existingCustomer)
      throw new NotFoundException('Customer not found');
    await this.customerModel.findByIdAndDelete(params.customerId);
  }

  private async getRelatedCustomers(id: string, work: string): Promise<Customer[]> {
    const customers = await this.customerModel.find().exec();

    if (work === 'Coach')
      return customers.filter(customer => customer.idCoach && customer.idCoach === id)
    return customers;
  }

  private async uploadImage(image: Buffer, id: string) {
    await this.s3Client.putObject({
      Bucket: 'survivor',
      Key: `customers/${id}.jpg`,
      Body: image,
      ACL: 'public-read',
      ContentType: 'image/jpeg',
    }).promise();
  }
}
