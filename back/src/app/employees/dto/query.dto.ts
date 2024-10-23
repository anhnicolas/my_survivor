import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches } from 'class-validator';
import { ALL_ROLES } from 'src/app/auth/roles/constants';

export class EmployeeQuery {
  @ApiProperty({ description: 'The employee id reference', example: '5f8f1b8f1c9d440000d7ddae', required: true })
  @IsString()
  employeeId: string;
}

export class EmployeeFilter {
  @ApiPropertyOptional({ example: 'john.doe@soul-connection.fr' })
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  surname: string;

  @ApiPropertyOptional({ enum: ['Male', 'Female', 'Other']})
  @IsOptional()
  @IsIn(['Male', 'Female', 'Other'])
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
