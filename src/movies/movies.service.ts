// src/movies/movies.service.ts
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable, Logger,
  RequestTimeoutException,
} from '@nestjs/common';

import { MoviesProviderToken } from './movies.config';
import { MoviesProvider } from './interfaces/movies-provider.interface';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { Languages } from '../common/enums/languages.enum';

import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { FindOneMovieByExternalIdProvider } from './providers/find-one-movie-by-external-id.provider';
import { PatchMovieDto } from './dtos/patch-movie.dto';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewMovieDto } from './dtos/create-review-movie.dto';
import { CreateMovieReviewProvider } from './providers/create-movie-review.provider';
import { ValidateMovieReviewProvider } from './providers/validate-movie-review.provider';
import { ValidateReviewMovieDto } from './dtos/validate-review-movie.dto';
import { MovieReview } from './movie-review.entity';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MoviesProviderToken)
    private readonly provider: MoviesProvider,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly findOneMovieByExternalIdProvider: FindOneMovieByExternalIdProvider,
    private readonly createMovieReviewProvider: CreateMovieReviewProvider,
    private readonly validateMovieReviewProvider: ValidateMovieReviewProvider,
    @InjectRepository(MovieReview)
    private readonly movieReviewRepository: Repository<MovieReview>,
  ) {}

  private readonly logger = new Logger(MoviesService.name, {
    timestamp: true,
  });

  public async search(query: string): Promise<Movie[]> {
    this.logger.log('search');
    return await this.provider.searchMovies(query);
  }

  public async getDetails(id: number): Promise<Movie> {
    this.logger.log('getDetails');
    return await this.provider.getMovieDetails(id);
  }

  public async getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]> {
    this.logger.log('validateBooking');
    return await this.provider.getUpcomingMovies(region, language, page);
  }

  public async getMovieById(id: number): Promise<Movie | null> {
    this.logger.log('getMovieById');
    try {
      return await this.moviesRepository.findOne({
        where: { id: id },
        relations: ['reviews', 'reviews.user'],
      });
    } catch (error) {
      throw new Error('Could not find user with this googleId', {
        cause: error,
      });
    }
  }

  public async getMovieByExternalId(id: number): Promise<Movie | null> {
    this.logger.log('getMovieByExternalId');
    return await this.findOneMovieByExternalIdProvider.findOneByExternalId(id);
  }

  public async createMovie(createMovieDto: Partial<CreateMovieDto>) {
    this.logger.log('createMovie');
    const movie = this.moviesRepository.create(createMovieDto);
    try {
      // return the post
      return await this.moviesRepository.save(movie);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async updateMovie(movieId: number, patchMovieDto: PatchMovieDto) {
    this.logger.log('updateMovie');
    let movie: Movie | null;

    try {
      movie = await this.moviesRepository.findOneBy({ id: movieId });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    if (!movie) {
      throw new BadRequestException('Movie not found WITH THIS ID');
    }

    // Update the properties of the post
    movie.averageRatingExterne =
      patchMovieDto.averageRatingExterne ?? movie.averageRatingExterne;
    movie.description = patchMovieDto.description ?? movie.description;
    movie.originalDescription =
      patchMovieDto.originalDescription ?? movie.originalDescription;
    movie.tagline = patchMovieDto.tagline ?? movie.tagline;
    movie.originalTagline =
      patchMovieDto.originalTagline ?? movie.originalTagline;
    movie.runtime = patchMovieDto.runtime ?? movie.runtime;

    // save the post and return it
    try {
      await this.moviesRepository.update(movie.id, movie);
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    return movie;
  }

  public async createMovieReview(createMovieReviewDto: CreateReviewMovieDto) {
    this.logger.log('createMovieReview');
    return await this.createMovieReviewProvider.create(createMovieReviewDto);
  }

  public validateMovieReview(
    reviewId: number,
    validateReviewMovieDto: ValidateReviewMovieDto,
  ) {
    this.logger.log('validateMovieReview');
    return this.validateMovieReviewProvider.validate(
      reviewId,
      validateReviewMovieDto,
    );
  }

  public async getMovieReview(movieId: number, userId: number) {
    this.logger.log('getMovieReview');
    try {
      const review = await this.movieReviewRepository.findOne({
        where: {
          movie: { id: movieId },
          user: { id: userId },
        },
        relations: ['movie', 'user'],
      });

      if (!review) {
        throw new BadRequestException(
          'Movie review not found for this user and movie',
        );
      }

      return review;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
  }

  public async getMovieReviews(movieId: number) {
    this.logger.log('getMovieReviews');
    try {
      return await this.movieReviewRepository.find({
        where: {
          movie: { id: movieId },
        },
        relations: ['movie', 'user'],
        order: {
          createDate: 'DESC',
        },
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
  }
}
