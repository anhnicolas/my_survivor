import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schemas';
import { Model } from 'mongoose';
import { PaymentQuery } from './dto/query.dto';

@Injectable()
export class PaymentsService {
  constructor() {}

  @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>;

  async getAllPayments(@Query() params: PaymentQuery): Promise<Payment[]> {
    const payments = await this.paymentModel.find({ ...params }).exec();
    return payments;
  }
}
