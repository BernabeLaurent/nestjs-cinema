import { IsString, IsOptional, IsInt, Min } from 'class-validator';
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
}
