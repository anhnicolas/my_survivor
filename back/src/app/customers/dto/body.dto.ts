import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, Matches } from "class-validator";

export class CustomerBody {
  @ApiProperty({ example: 'john.doe@soul-connection.fr' })
  @IsString()
  email: string;

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

  @ApiProperty({ example: '1983-09-14', format: 'YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in the format YYYY-MM-DD' })
  @IsString()
  birthDate: string;

  @ApiProperty({ example: 'So fresh to be here!' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Scorpio' })
  @IsString()
  astrologicalSign: string;

  @ApiProperty({ example: '+33 6 50 68 75 94' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '1234 Main St' })
  @IsString()
  address: string;
}

export class CustomerAssignBody {
  @ApiProperty({ description: 'The coach id reference', example: '5f8f1b8f1c9d440000d7ddae' })
  @IsString()
  @IsNotEmpty()
  coachId: string;
}