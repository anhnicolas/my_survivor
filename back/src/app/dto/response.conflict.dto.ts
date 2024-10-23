import { ApiProperty } from "@nestjs/swagger";

export class ConflictError {
  @ApiProperty({ example: 409, description: 'The HTTP status code.' })
  statusCode: number;

  @ApiProperty({ example: 'Conflict', description: 'The error message.' })
  message: string;
}
