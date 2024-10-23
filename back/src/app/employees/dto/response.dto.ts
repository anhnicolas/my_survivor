import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class EmployeeResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  _id: string;

  @ApiProperty({ example: 'john.doe@soul-connection.fr' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  surname: string;

  @ApiProperty({ example: 'Male' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 'CTO' })
  @IsString()
  work: string;

  @ApiProperty({ example: '1983-09-14' })
  @IsString()
  birthDate: string;

  @ApiProperty({ description: 'Image Link', example: 'https://domain.fr/employees/id' })
  @IsString()
  image: string;
}

export class EmployeeCreatedResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  _id: string;
}

export class LoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' })
  access_token: string;
}
