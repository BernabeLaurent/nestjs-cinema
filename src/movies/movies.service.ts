// src/movies/movies.service.ts
import {
  Inject,
  Injectable,
  BadRequestException,
  RequestTimeoutException,
  ConflictException,
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

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MoviesProviderToken)
    private readonly provider: MoviesProvider,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly findOneMovieByExternalIdProvider: FindOneMovieByExternalIdProvider,
    private readonly createMovieReviewProvider: CreateMovieReviewProvider,
  ) {}

  public async search(query: string): Promise<Movie[]> {
    return await this.provider.searchMovies(query);
  }

  public async getDetails(id: number): Promise<Movie> {
    return await this.provider.getMovieDetails(id);
  }

  public async getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]> {
    return await this.provider.getUpcomingMovies(region, language, page);
  }

  public async getMovieById(id: number): Promise<Movie | null> {
    try {
      return await this.moviesRepository.findOneBy({ id: id });
    } catch (error) {
      throw new Error('Could not find user with this googleId', {
        cause: error,
      });
    }
  }

  public async getMovieByExternalId(id: number): Promise<Movie | null> {
    return await this.findOneMovieByExternalIdProvider.findOneByExternalId(id);
  }

  public async createMovie(createMovieDto: Partial<CreateMovieDto>) {
    const movie = this.moviesRepository.create(createMovieDto);
    try {
      // return the post
      return await this.moviesRepository.save(movie);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async updateMovie(patchMovieDto: PatchMovieDto) {
    let movie: Movie | null;

    try {
      movie = await this.moviesRepository.findOneBy({ id: patchMovieDto.id });
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
    return await this.createMovieReviewProvider.create(createMovieReviewDto);
  }
}
