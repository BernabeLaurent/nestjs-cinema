import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { ApiProperty } from '@nestjs/swagger';
import { RoleUser } from '../enums/roles-users.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'FirstName',
    example: 'Jean',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'LastName',
    example: 'François',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'test@example.com',
    description: 'Email',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'GoogleId',
    example: '134560',
  })
  @IsOptional()
  googleId?: string;

  @ApiProperty({
    example: false,
    description: 'Personne handicapée',
    default: false,
  })
  @IsBoolean()
  hasDisability: boolean;

  @ApiProperty({
    enum: RoleUser,
    description: 'RoleUser',
    example: RoleUser.CUSTOMER,
  })
  @IsEnum(RoleUser)
  @IsNotEmpty()
  roleUser: RoleUser;

  @ApiProperty({
    description: 'Address',
    example: '320 Avenue de la République, 75011 Paris',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'city',
    example: 'Paris',
  })
  @MaxLength(60)
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'ZipCode',
    example: '83140',
  })
  @IsNumber()
  @IsOptional()
  zipCode?: number;

  @ApiProperty({
    enum: RegionsIso,
    description: 'Code country',
    example: RegionsIso.FRANCE,
  })
  @IsEnum(RegionsIso)
  @IsOptional()
  codeCountry?: RegionsIso;

  @ApiProperty({
    description: 'phoneNumber',
    example: '0494206308',
  })
  @MaxLength(32)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'password',
    example: 'L123456789&121',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;
}
