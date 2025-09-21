import { PartialType } from '@nestjs/swagger';
import { CreateSessionCinemaDto } from './create-session-cinema.dto';

export class PatchSessionCinemaDto extends PartialType(
  CreateSessionCinemaDto,
) {}
