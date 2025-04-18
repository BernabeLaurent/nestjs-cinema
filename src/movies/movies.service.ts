// src/movies/movies.service.ts
import { Inject, Injectable } from '@nestjs/common';

import { MoviesProviderToken } from './movies.config';
import { MoviesProvider, Movie } from './interfaces/movies-provider.interface';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MoviesProviderToken)
    private readonly provider: MoviesProvider,
  ) {}

  search(query: string): Promise<Movie[]> {
    return this.provider.searchMovies(query);
  }

  getDetails(id: string): Promise<Movie> {
    return this.provider.getMovieDetails(id);
  }
}
