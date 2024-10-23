import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Customer } from "src/app/customers/schemas/customer.schema";
import { CompatibilityResponse } from "./dto/response.dto";
import { CompatibilityQuery } from "./dto/query.dto";

@Injectable()
export class AstroService {
  constructor() {}

  @InjectModel(Customer.name) private readonly customerModel: Model<Customer>;

  async getCompatibility(params: CompatibilityQuery): Promise<CompatibilityResponse> {
    const { customerRefId, customerTargetId } = params;
    if (customerRefId === customerTargetId)
      throw new BadRequestException('The two clients must be different');

    // Get astrological signs of the two clients
    const refClientSign = await this.getCustomerSign(customerRefId);
    const targetClientSign = await this.getCustomerSign(customerTargetId);

    // Get the sum of the ASCII values of the characters in the astrological signs
    const sum1 = this.sumOfLetters(refClientSign);
    const sum2 = this.sumOfLetters(targetClientSign);

    const compatibility = 100 - (Math.abs(sum1 - sum2) % 100);
    return { compatibility };
  }

  private async getCustomerSign(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer)
      throw new NotFoundException('Customer not found');
    return customer.astrologicalSign;
  }

  private sumOfLetters(word: string): number {
    let sum = 0;
    for (let i = 0; i < word.length; i++) {
      sum += word.charCodeAt(i);
    }
    return sum;
  }
}
