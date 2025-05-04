import { forwardRef, Module } from '@nestjs/common';
import { SessionsCinemasService } from './sessions-cinemas.service';
import { SessionsCinemasController } from './sessions-cinemas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionCinema } from './session-cinema.entity';
import { CreateSessionCinemaProvider } from './providers/create-session-cinema.provider';
import { MoviesTheatersModule } from '../movies-theaters/movies-theaters.module';
import { PatchSessionCinemaProvider } from './providers/patch-session-cinema.provider';
import { MoviesModule } from '../movies/movies.module';
import { GetSessionCinemaProvider } from './providers/get-session-cinema.provider';
import { Price } from './prices.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionCinema, Price]),
    MoviesTheatersModule,
    forwardRef(() => MoviesModule),
  ],
  providers: [
    SessionsCinemasService,
    CreateSessionCinemaProvider,
    PatchSessionCinemaProvider,
    GetSessionCinemaProvider,
  ],
  controllers: [SessionsCinemasController],
  exports: [SessionsCinemasService],
})
export class SessionsCinemasModule {}
