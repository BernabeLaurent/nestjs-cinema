// src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { getMovieProvider } from './movies.config';
import { TmdbProvider } from './source/providers/tmdb.provider';
import { ConfigModule } from '@nestjs/config';
import tmdbConfig from './config/tmdb.config';
import { MoviesCron } from './crons/movies.cron';
import { FindOneMovieByExternalIdProvider } from './providers/find-one-movie-by-external-id.provider';
import { Movie } from './movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forFeature(tmdbConfig),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    getMovieProvider(),
    TmdbProvider,
    MoviesCron,
    FindOneMovieByExternalIdProvider,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
