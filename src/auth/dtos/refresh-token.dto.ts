import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: any }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @ApiProperty({
    description: 'Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInJvbGUiOiJDVVNUT01FUiIsImVtYWlsIjoibG9sb0BleGFtcGxlLmNvbSIsImlhdCI6MTc0NTc0MTEwNywiZXhwIjoxNzQ1NzQ0NzA3LCJhdWQiOiJsb2NhbGhvc3Q6MzMzMyIsImlzcyI6ImxvY2FsaG9zdDozMzMzIn0.a9fS6PqE883os1rrnDun5QRWHk45sWZ05gjOcxh6GOg',
  })
  refreshToken: string;
}
