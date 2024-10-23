import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class TipsResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  id: string;

  @ApiProperty({ example: 'How to seduce a girl?' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Show her your best dance moves' })
  @IsString()
  description: string;
}
