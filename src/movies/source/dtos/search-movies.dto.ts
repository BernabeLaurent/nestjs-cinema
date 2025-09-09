import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchMoviesDto {
  @ApiProperty({
    description: 'Nom du film à rechercher (obligatoire)',
    example: 'Avengers',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Theater ID (optionnel)',
    example: 1,
    type: 'number',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  theaterId?: number;

  @ApiPropertyOptional({
    description: 'Recherche admin (ignore les filtres de date)',
    example: false,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  adminSearch?: boolean;
}
