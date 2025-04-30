import { Module } from '@nestjs/common';
import { SessionsCinemasService } from './sessions-cinemas.service';
import { SessionsCinemasController } from './sessions-cinemas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionCinema } from './session-cinema.entity';
import { CreateSessionCinemaProvider } from './providers/create-session-cinema.provider';
import { MoviesTheatersModule } from '../movies-theaters/movies-theaters.module';
import { PatchSessionCinemaProvider } from './providers/patch-session-cinema.provider';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionCinema]),
    MoviesTheatersModule,
    MoviesModule,
  ],
  providers: [
    SessionsCinemasService,
    CreateSessionCinemaProvider,
    PatchSessionCinemaProvider,
  ],
  controllers: [SessionsCinemasController],
})
export class SessionsCinemasModule {}
