// src/movies/movies.service.ts
import { Inject, Injectable } from '@nestjs/common';

import { MoviesProviderToken } from './movies.config';
import { MoviesProvider, Movie } from './interfaces/movies-provider.interface';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { Languages } from '../common/enums/languages.enum';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MoviesProviderToken)
    private readonly provider: MoviesProvider,
  ) {}

  async search(query: string): Promise<Movie[]> {
    return await this.provider.searchMovies(query);
  }

  async getDetails(id: string): Promise<Movie> {
    return await this.provider.getMovieDetails(id);
  }

  async getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]> {
    return await this.provider.getUpcomingMovies(region, language, page);
  }
}
