import { ApiProperty } from "@nestjs/swagger";

export class InternalError {
  @ApiProperty({ example: 500, description: 'The HTTP status code.'})
  statusCode: number;

  @ApiProperty({ example: 'Internal Server Error', description: 'The error message.' })
  message: string;
}
