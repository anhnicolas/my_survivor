import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class EncounterQuery {
  // @ApiPropertyOptional({ description: 'The customer reference id', example: '123456' })
  // @IsOptional()
  // @IsString()
  // customerIdRef: string;

  @ApiPropertyOptional({ description: 'The customer id', example: '5f8f1b8f1c9d440000d7ddae' })
  @IsOptional()
  @IsString()
  customerId: string;
}