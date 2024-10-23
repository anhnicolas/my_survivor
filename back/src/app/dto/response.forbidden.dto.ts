import { ApiProperty } from "@nestjs/swagger";

export class ForbiddenError {
  @ApiProperty({ example: 403, description: 'The HTTP status code.' })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden', description: 'The error message.' })
  message: string;
}
