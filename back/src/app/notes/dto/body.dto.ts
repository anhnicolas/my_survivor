import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class NotesUploadBody {
  @ApiProperty({ description: 'The coach id reference', example: '5f8f1b8f1c9d440000d7ddae' })
  @IsString()
  @IsNotEmpty()
  customerId: ObjectId;
}