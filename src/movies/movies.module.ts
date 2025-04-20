// src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { getMovieProvider } from './movies.config';
import { TmdbProvider } from './source/providers/tmdb.provider';
import { ConfigModule } from '@nestjs/config';
import tmdbConfig from './config/tmdb.config';
import { MoviesCron } from './crons/movies.cron';

@Module({
  imports: [ConfigModule.forFeature(tmdbConfig)],
  controllers: [MoviesController],
  providers: [MoviesService, getMovieProvider(), TmdbProvider, MoviesCron],
})
export class MoviesModule {}
