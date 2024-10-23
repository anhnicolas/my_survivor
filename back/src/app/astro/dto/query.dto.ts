import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompatibilityQuery {
  @ApiProperty({ description: 'The client id reference', example: '5f8f1b8f1c9d440000d7ddae', required: true })
  @IsString()
  customerRefId: string;

  @ApiProperty({ description: 'The client id to compare with', example: '5f8f1b8f1c9d440000d7ddae', required: true })
  @IsString()
  customerTargetId: string;
}
