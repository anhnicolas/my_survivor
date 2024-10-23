import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedError {
  @ApiProperty({ example: 401, description: 'The HTTP status code.' })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized', description: 'The error message.' })
  message: string;
}
