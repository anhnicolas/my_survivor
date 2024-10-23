import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class ReqUser extends Request {
  @ApiProperty()
  @IsObject()
  user: {
    "email": string,
    "work": string,
    "id": string,
    "iat": number,
    "exp": number
  }
}
