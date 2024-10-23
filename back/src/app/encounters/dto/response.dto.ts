import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class EncounterResponse {
  @ApiProperty({ description: 'The encounter id', example: '5f8f1b8f1c9d440000d7ddae' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'The encounter customer id', example: '5f8f1b8f1c9d440000d7ddae' })
  @IsString()
  customerId: string;

  // @ApiProperty({ description: 'The encounter customer id reference', example: '1235' })
  // @IsNumber()
  // customerIdRef: number;

  @ApiProperty({ description: 'The encounter date', example: '2020-10-20', format: 'YYYY-MM-DD' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'The encounter rate', example: '3' })
  @IsNumber()
  rate: number;

  @ApiProperty({ description: 'The encounter source', example: 'web' })
  @IsString()
  source: string;

  @ApiProperty({ description: 'The encounter creation date', example: '2020-10-20T13:00:00.000Z', format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })
  @IsString()
  createdAt: string;

  @ApiProperty({ description: 'The encounter update date', example: '2020-10-20T13:00:00.000Z', format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' })
  @IsString()
  updatedAt: string;
}