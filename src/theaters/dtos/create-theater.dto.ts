import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateTheaterDto {
  @ApiProperty({
    description: 'Nom du cinéma',
    example: 'Pathé Grand Ciel',
    minLength: 2,
    maxLength: 250,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(2)
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
    description: 'Code postal',
    example: 83140,
    minimum: 1000,
    maximum: 99999,
  })
  @IsInt()
  @Min(1000)
  @Max(99999)
  zipCode: number;

  @ApiProperty({
    description: 'phoneNumber',
    example: '+330494206308',
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
