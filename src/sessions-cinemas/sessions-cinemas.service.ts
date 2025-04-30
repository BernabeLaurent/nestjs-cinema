import { Injectable } from '@nestjs/common';
import { CreateSessionCinemaDto } from './dtos/create-session-cinema.dto';
import { CreateSessionCinemaProvider } from './providers/create-session-cinema.provider';
import { PatchSessionCinemaProvider } from './providers/patch-session-cinema.provider';
import { PatchSessionCinemaDto } from './dtos/patch-session-cinema.dto';

@Injectable()
export class SessionsCinemasService {
  constructor(
    private readonly createSessionCinemaProvider: CreateSessionCinemaProvider,
    private readonly patchSessionCinemaProvider: PatchSessionCinemaProvider,
  ) {}

  public async createSessionCinema(
    createSessionCinemaDto: CreateSessionCinemaDto,
  ) {
    return await this.createSessionCinemaProvider.create(
      createSessionCinemaDto,
    );
  }

  public async updateSessionCinema(
    patchSessionCinemaDto: PatchSessionCinemaDto,
  ) {
    return await this.patchSessionCinemaProvider.update(patchSessionCinemaDto);
  }
}
