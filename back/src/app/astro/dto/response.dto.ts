import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CompatibilityResponse {
  @ApiProperty({ description: 'The percentage of compatibility between the two clients', example: 50 })
  @IsInt()
  compatibility: number;
}
