import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class EventsResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  id: ObjectId;

  @ApiProperty({ example: 'Beach' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Speed Dating' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Grand Place, Lille' })
  @IsString()
  locationName: string;

  @ApiProperty({ example: '3.0636' })
  @IsString()
  locationX: string;

  @ApiProperty({ example: '50.6366' })
  @IsString()
  locationY: string;

  @ApiProperty({ example: '2024-07-03' })
  @IsString()
  date: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  maxParticipants: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  duration: number;

  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  employeeId: ObjectId;

  // @ApiProperty({ example: 5 })
  // @IsNumber()
  // employeeIdRef: number;
}
