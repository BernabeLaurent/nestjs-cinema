import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import tmdbConfig from '../../config/tmdb.config';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { ConfigType } from '@nestjs/config';

import {
  MoviesProvider,
  Movie,
} from '../../interfaces/movies-provider.interface';
import { Languages } from '../../../common/enums/languages.enum';
import { RegionsIso } from '../../../common/enums/regions-iso.enum';

@Injectable()
export class TmdbProvider implements MoviesProvider {
  private readonly defaultLanguage: Languages;

  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly tmdbConfiguration: ConfigType<typeof tmdbConfig>, // Assuming you have a JWT configuration for token generation
  ) {
    this.defaultLanguage = this.tmdbConfiguration.defaultLanguage as Languages;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const url = `${this.tmdbConfiguration.baseUrl}/search/movie?language=${this.defaultLanguage}`;

    try {
      const { data }: { data: { results: TmdbMovieDto[] } } = await axios.get(
        url,
        {
          params: {
            query: encodeURIComponent(query),
          },
          headers: {
            Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
            'accept-Type': 'application/json',
          },
        },
      );

      if (!data) {
        throw new Error(
          "Aucune donnée reçue de TMDB. Vérifiez la connexion ou l'API.",
        );
      }

      return data.results.map((m: TmdbMovieDto) => ({
        title: m.title,
        year: m.release_date?.split('-')[0] ?? '',
        description: m.overview,
      }));
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getMovieDetails(id: string): Promise<Movie> {
    const url = `${this.tmdbConfiguration.baseUrl}/movie/${id}?language=${this.defaultLanguage}`;
    try {
      const { data }: { data: TmdbMovieDto } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
          'accept-Type': 'application/json',
        },
      });

      if (!data) {
        throw new Error(
          "Aucune donnée reçue de TMDB. Vérifiez la connexion ou l'API.",
        );
      }

      return {
        title: data.title,
        year: data.release_date?.split('-')[0] ?? '',
        description: data.overview,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]> {
    const url = `${this.tmdbConfiguration.baseUrl}/movie/upcoming`;

    page = page || this.tmdbConfiguration.defaultPage;
    language = language || this.defaultLanguage;
    region = region || (this.tmdbConfiguration.defaultCountry as RegionsIso);

    try {
      const { data }: { data: { results: TmdbMovieDto[] } } = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
            'accept-Type': 'application/json',
          },
          params: {
            page, // Par page
            language, // Par code langue
            region, // Par pays
          },
        },
      );
      console.log('data', data);

      if (!data) {
        throw new Error('Pb de connexion avec TMDB');
      }

      return data.results.map((m: TmdbMovieDto) => ({
        title: m.title,
        year: m.release_date?.split('-')[0] ?? '',
        description: m.overview,
      }));
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
