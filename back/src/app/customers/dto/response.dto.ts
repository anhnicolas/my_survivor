import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsString } from 'class-validator';

export class CustomersResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  _id: string;

  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsString()
  idCoach: string;

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

  @ApiProperty({ example: '1234 Main St' })
  @IsString()
  address: string;

  @ApiProperty({ example: '01/01/2000' })
  @IsString()
  birthDate: string;

  @ApiProperty({ example: '+33 6 50 68 75 94' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'Scorpio' })
  @IsString()
  astrologicalSign: string;

  @ApiProperty({ description: 'Image Link', example: 'https://domain.fr/employees/id' })
  @IsString()
  image: string;

  @ApiProperty({ description: 'The list of clothes', example: [{ 'idRef': 1, 'type': 'T-shirt', 'image': 'https://domain.fr/employees/id' }] })
  @IsArray()
  clothes: [{
    'idRef': number;
    'type': string;
    'image': string;
  }];
}

export class CustomerCreatedResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  _id: string;
}

export class CustomerAssignedResponse {
  @ApiProperty({ example: '5f8f1b8f1c9d440000d7ddae' })
  @IsMongoId()
  id: string;
}
