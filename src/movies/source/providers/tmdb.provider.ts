import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import tmdbConfig from '../../config/tmdb.config';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { ConfigType } from '@nestjs/config';

import {
  MoviesProvider,
  Movie,
} from '../../interfaces/movies-provider.interface';

@Injectable()
export class TmdbProvider implements MoviesProvider {
  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly tmdbConfiguration: ConfigType<typeof tmdbConfig>, // Assuming you have a JWT configuration for token generation
  ) {}

  async searchMovies(query: string): Promise<Movie[]> {
    const url = `${this.tmdbConfiguration.baseUrl}/search/movie?language=fr-FR`;

    const { data } = await axios.get(url, {
      params: {
        query: encodeURIComponent(query),
      },
      headers: {
        Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
        'accept-Type': 'application/json',
      },
    });
    return data.results.map((m: TmdbMovieDto) => ({
      title: m.title,
      year: m.release_date?.split('-')[0] ?? '',
      description: m.overview,
    }));
  }

  async getMovieDetails(id: string): Promise<Movie> {
    const url = `${this.tmdbConfiguration.baseUrl}/movie/${id}?language=fr-FR`;
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
        'accept-Type': 'application/json',
      },
    });
    const m: TmdbMovieDto = data;

    return {
      title: m.title,
      year: m.release_date?.split('-')[0] ?? '',
      description: m.overview,
    };
  }
}
