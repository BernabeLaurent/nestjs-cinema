import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTheaterDto {
  @ApiProperty({
    description: 'Title',
    example: 'Pathé Grand Ciel',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: RegionsIso,
    description: 'Code country',
    example: RegionsIso.FRANCE,
  })
  @IsEnum(RegionsIso)
  @IsNotEmpty()
  codeCountry: RegionsIso;

  @ApiProperty({
    description: 'Address',
    example: '320 Avenue de la République, 75011 Paris',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'city',
    example: 'Paris',
  })
  @MaxLength(60)
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'ZipCode',
    example: '83140',
  })
  @IsNumber()
  zipCode: number;

  @ApiProperty({
    description: 'Telephone Code',
    example: '33',
  })
  @IsNumber()
  telephoneCode: number;

  @ApiProperty({
    description: 'phoneNumber',
    example: '0494206308',
  })
  @MaxLength(32)
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'openingTime',
    example: '08:00',
    type: String,
    pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'openingTime doit être au format HH:MM (ex: 18:30)',
  })
  openingTime: string;

  @ApiProperty({
    description: 'closingTime',
    example: '00:00',
    type: String,
    pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'closingTime doit être au format HH:MM (ex: 18:30)',
  })
  closingTime: string;
}
