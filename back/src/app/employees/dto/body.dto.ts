import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

import { ALL_ROLES } from 'src/app/auth/roles/constants';

export class EmployeeBody {
  @ApiProperty({ example: 'john.doe@soul-connection.fr' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  surname: string;

  @ApiProperty({ enum: ['Male', 'Female']})
  @IsIn(['Male', 'Female'])
  @IsString()
  gender: string;

  @ApiProperty({ enum: ALL_ROLES })
  @IsIn(ALL_ROLES)
  @IsString()
  work: string;

  @ApiProperty({ example: '1983-09-14', format: 'YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in the format YYYY-MM-DD' })
  @IsString()
  birthDate: string;
}

export class EmployeePatchBody {
  @ApiPropertyOptional({ example: 'john.doe@soul-connection.fr' })
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional({ example: 'password' })
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  surname: string;

  @ApiPropertyOptional({ enum: ['Male', 'Female']})
  @IsOptional()
  @IsIn(['Male', 'Female'])
  @IsString()
  gender: string;

  @ApiPropertyOptional({ enum: ALL_ROLES })
  @IsOptional()
  @IsIn(ALL_ROLES)
  @IsString()
  work: string;

  @ApiPropertyOptional({ example: '1983-09-14', format: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in the format YYYY-MM-DD' })
  @IsString()
  birthDate: string;
}

export class LoginBody {
  @ApiProperty({ example: 'jean-eudes.martin@soul-connection.fr', required: true })
  @IsString()
  email: string;

  @ApiProperty({ example: '1234', required: true })
  @IsString()
  password: string;
}
