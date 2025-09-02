import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class GoogleTokenDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000) // Reasonable token length limit
  token: string;
}
