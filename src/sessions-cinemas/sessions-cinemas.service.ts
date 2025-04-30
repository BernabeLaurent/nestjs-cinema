import { Injectable } from '@nestjs/common';
import { CreateSessionCinemaDto } from './dtos/create-session-cinema.dto';
import { CreateSessionCinemaProvider } from './providers/create-session-cinema.provider';
import { PatchSessionCinemaProvider } from './providers/patch-session-cinema.provider';
import { PatchSessionCinemaDto } from './dtos/patch-session-cinema.dto';
import { GetSessionCinemaProvider } from './providers/get-session-cinema.provider';
import { SessionCinema } from './session-cinema.entity';

@Injectable()
export class SessionsCinemasService {
  constructor(
    private readonly createSessionCinemaProvider: CreateSessionCinemaProvider,
    private readonly patchSessionCinemaProvider: PatchSessionCinemaProvider,
    private readonly getSessionCinemaProvider: GetSessionCinemaProvider,
  ) {}

  public async getSessionCinemaById(id: number) {
    return await this.getSessionCinemaProvider.findById(id);
  }

  public async getSessionsCinemaByMovieId(
    id: number,
  ): Promise<SessionCinema[] | []> {
    return await this.getSessionCinemaProvider.findAllByMovieId(id);
  }

  public async getSessionsCinemaByMovieTheaterId(
    id: number,
  ): Promise<SessionCinema[] | []> {
    return await this.getSessionCinemaProvider.findAllByMovieTheaterId(id);
  }

  public async getSessionsCinemaByTheaterId(
    id: number,
  ): Promise<SessionCinema[] | []> {
    return await this.getSessionCinemaProvider.findAllByTheaterId(id);
  }

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
