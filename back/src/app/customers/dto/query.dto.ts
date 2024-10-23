import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CustomerQuery {
  @ApiProperty({ description: 'The client id reference', example: '5f8f1b8f1c9d440000d7ddae', required: true })
  @IsString()
  customerId: string;
}
