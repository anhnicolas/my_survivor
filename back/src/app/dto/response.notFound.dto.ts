import { ApiProperty } from "@nestjs/swagger";

export class NotFoundError {
  @ApiProperty({ type: Number, example: 404, description: 'The HTTP status code.' })
  statusCode: number;

  @ApiProperty({ example: 'Not Found', description: 'The error message.' })
  message: string;
}
