import { PartialType } from '@nestjs/swagger';
import { CreateTheaterDto } from './create-theater.dto';

export class PatchTheaterDto extends PartialType(CreateTheaterDto) {}
