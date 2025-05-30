// src/movies/movies.service.ts
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cast } from './cast.entity';
import { SearchMoviesProvider } from './providers/search-movies.provider';
import { SearchMoviesDto } from './source/dtos/search-movies.dto';
import { Theater } from '../theaters/theater.entity';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Cast)
    private readonly castsRepository: Repository<Cast>,
    private readonly searchMoviesProvider: SearchMoviesProvider,
  ) {}

  private readonly logger = new Logger(MoviesService.name, {
    timestamp: true,
  });

  public async searchExternal(query: string): Promise<Movie[]> {
    this.logger.log('searchExternal');
    return await this.provider.searchExternalMovies(query);
  }

  public async search(searchMoviesDto: SearchMoviesDto): Promise<
    {
      movie: Movie;
      theaters: {
        theater: Theater;
        sessions: {
          date: string;
          sessions: SessionCinema[];
        }[];
      }[];
    }[]
  > {
    this.logger.log('search');
    return await this.searchMoviesProvider.search(searchMoviesDto);
  }

  public async getCast(
    movieExternalId: number,
    movieId?: number,
  ): Promise<Cast[]> {
    this.logger.log('getCast');
    return await this.provider.getCastMovie(movieExternalId, movieId);
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

  public async getMovieById(id: number): Promise<Movie> {
    this.logger.log('getMovieById');

    const cacheKey = `movie_${id}`;
    const cachedMovie = await this.cacheManager.get<Movie>(cacheKey);

    if (cachedMovie) {
      return cachedMovie;
    }

    let movie: Movie | null;

    try {
      movie = await this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.reviews', 'reviews')
        .leftJoinAndSelect('movie.cast', 'cast')
        .where('movie.id = :id', { id })
        .getOne();

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    await this.cacheManager.set(cacheKey, movie, 3600000); // Cache for 1 hour
    return movie;
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

  public async createCast(createCastDto: Partial<Cast>): Promise<Cast> {
    this.logger.log('createCast');
    const cast = this.castsRepository.create(createCastDto);
    try {
      // return the cast
      return await this.castsRepository.save(cast);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async updateMovie(movieId: number, patchMovieDto: PatchMovieDto) {
    this.logger.log(`Starting updateMovie for movieId: ${movieId}`);
    let movie: Movie | null;

    try {
      this.logger.debug('Fetching movie from database');
      movie = await this.moviesRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.reviews', 'reviews')
        .leftJoinAndSelect('movie.cast', 'cast')
        .where('movie.id = :id', { id: movieId })
        .getOne();
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    if (!movie) {
      this.logger.error(`Movie not found with ID: ${movieId}`);
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
    movie.backdropPath = patchMovieDto.backdropPath ?? movie.backdropPath;
    movie.posterPath =
      patchMovieDto.posterPath !== undefined
        ? patchMovieDto.posterPath
        : movie.posterPath;

    this.logger.debug(`Updated movie data: ${JSON.stringify(movie)}`);

    // save the post and return it
    try {
      this.logger.debug('Saving updated movie to database');
      await this.moviesRepository.save(movie);
      this.logger.debug('Invalidating cache');
      await this.cacheManager.del(`movie_${movie.id}`); // Invalidate le cache
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    this.logger.log(`Successfully updated movie with ID: ${movieId}`);
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
    const cacheKey = `movies_reviews_${movieId}`;
    const cachedMovieReviews =
      await this.cacheManager.get<MovieReview[]>(cacheKey);

    if (cachedMovieReviews) {
      return cachedMovieReviews;
    }

    let movieReviews: MovieReview[] | null;

    try {
      movieReviews = await this.movieReviewRepository.find({
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
    await this.cacheManager.set(cacheKey, movieReviews, 3600000); // Cache for 1 hour

    return movieReviews;
  }
}
