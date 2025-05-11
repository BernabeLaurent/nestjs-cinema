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
import { CreateMovieProvider } from './source/providers/create-movie.provider';
import { MovieReview } from './movie-review.entity';
import { CreateMovieReviewProvider } from './providers/create-movie-review.provider';
import { UsersModule } from '../users/users.module';
import { ValidateMovieReviewProvider } from './providers/validate-movie-review.provider';
import { Cast } from './cast.entity';
import { CreateCastProvider } from './source/providers/create-cast.provider';
import { SearchMoviesProvider } from './providers/search-movies.provider';
import { Theater } from '../theaters/theater.entity';
import { ImagesModule } from '../common/images/images.module';

@Module({
  imports: [
    ConfigModule.forFeature(tmdbConfig),
    TypeOrmModule.forFeature([Movie, MovieReview, Cast, Theater]),
    UsersModule,
    ImagesModule,
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    getMovieProvider(),
    TmdbProvider,
    MoviesCron,
    FindOneMovieByExternalIdProvider,
    CreateMovieProvider,
    CreateMovieReviewProvider,
    ValidateMovieReviewProvider,
    CreateCastProvider,
    SearchMoviesProvider,
  ],
  exports: [MoviesService, CreateMovieProvider],
})
export class MoviesModule {}
