import { Module } from '@nestjs/common';
import { MoviesTheatersService } from './movies-theaters.service';
import { MoviesTheatersController } from './movies-theaters.controller';
import { FindMoviesTheatersByTheaterIdProvider } from './providers/find-movies-theaters-by-theater-id.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieTheater } from './movie-theater.entity';
import { CreateMovieTheaterProvider } from './providers/create-movie-theater.provider';
import { TheatersModule } from '../theaters/theaters.module';
import { PatchMovieTheaterProvider } from './providers/patch-movie-theater.provider';

@Module({
  imports: [TypeOrmModule.forFeature([MovieTheater]), TheatersModule],
  providers: [
    MoviesTheatersService,
    FindMoviesTheatersByTheaterIdProvider,
    CreateMovieTheaterProvider,
    PatchMovieTheaterProvider,
  ],
  controllers: [MoviesTheatersController],
  exports: [MoviesTheatersService],
})
export class MoviesTheatersModule {}
