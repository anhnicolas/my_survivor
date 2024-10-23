import { ApiProperty } from "@nestjs/swagger";

export class PaymentResponse {
  @ApiProperty({ description: 'The payment id', example: '5f8f1b8f1c9d440000d7ddae' })
  _id: string;

  @ApiProperty({ description: 'The payment customer id', example: '5f8f1b8f1c9d440000d7ddae' })
  customerId: string;

  // @ApiProperty({ description: 'The payment customer id ref', example: 1 })
  // customerIdRef: number;

  @ApiProperty({ description: 'The payment date', example: '2020-10-20' })
  date: string;

  @ApiProperty({ description: 'The payment method', example: 'CB' })
  paymentMethod: string;

  @ApiProperty({ description: 'The payment amount', example: 100 })
  amount: number;

  @ApiProperty({ description: 'The payment comment', example: 'Payment for the last invoice' })
  comment: string;

  @ApiProperty({ description: 'The payment creation date', example: '2020-10-20' })
  createdAt: string;

  @ApiProperty({ description: 'The payment update date', example: '2020-10-20' })
  updatedAt: string;
}