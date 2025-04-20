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
  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly tmdbConfiguration: ConfigType<typeof tmdbConfig>, // Assuming you have a JWT configuration for token generation
  ) {}

  async searchMovies(query: string): Promise<Movie[]> {
    const url = `${this.tmdbConfiguration.baseUrl}/search/movie?language=fr-FR`;

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
    const url = `${this.tmdbConfiguration.baseUrl}/movie/${id}?language=fr-FR`;
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

  async getUpcomingMovies(query: string): Promise<Movie[]> {
    const url = `${this.tmdbConfiguration.baseUrl}/movie/upcoming/?language=fr-FR`;
    const parsedQuery = JSON.parse(query) as {
      page?: number;
      language?: Languages;
      region?: RegionsIso;
    };
    let {
      page,
      language,
      region,
    }: { page?: number; language?: Languages; region?: RegionsIso } =
      parsedQuery;

    page = page || this.tmdbConfiguration.defaultPage;
    language =
      language || (this.tmdbConfiguration.defaultLanguage as Languages);
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
            page: page, // Par page
            language: language, // Par code langue
            region: region, // Par pays
          },
        },
      );

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
