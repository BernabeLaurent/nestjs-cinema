import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import tmdbConfig from '../../config/tmdb.config';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { ConfigType } from '@nestjs/config';

import { MoviesProvider } from '../../interfaces/movies-provider.interface';
import { Languages } from '../../../common/enums/languages.enum';
import { RegionsIso } from '../../../common/enums/regions-iso.enum';
import { UpcomingMoviesInterface } from '../../interfaces/upcoming-movies.interface';
import { CreateMovieDto } from '../../dtos/create-movie.dto';
import { CreateMovieProvider } from './create-movie.provider';
import { Movie } from '../../movie.entity';

@Injectable()
export class TmdbProvider implements MoviesProvider {
  private readonly defaultLanguage: Languages;

  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly tmdbConfiguration: ConfigType<typeof tmdbConfig>, // Assuming you have a JWT configuration for token generation
    private readonly createMovieProvider: CreateMovieProvider,
  ) {
    this.defaultLanguage = this.tmdbConfiguration.defaultLanguage as Languages;
  }

  public mapTmdbDtoToMovie(dto: TmdbMovieDto): Partial<CreateMovieDto> {
    return {
      movieExterneId: dto.id,
      title: dto.title,
      originalTitle: dto.original_title,
      description: dto.overview,
      originalDescription: dto.overview,
      tagline: dto.tagline,
      originalTagline: dto.tagline,
      isAdult: dto.adult,
      averageRatingExterne: dto.vote_average,
      releaseDate: new Date(dto.release_date),
      startDate: new Date(dto.release_date),
      endDate: new Date(dto.release_date),
      runtime: dto.runtime,
      originalLanguage: dto.original_language as Languages,
    };
  }

  public async searchMovies(query: string): Promise<Movie[]> {
    const url = `${this.tmdbConfiguration.baseUrl}/search/movie?language=${this.defaultLanguage}`;
    const allMovies: Movie[] = [];

    try {
      const response = await axios.get(url, {
        params: {
          query: encodeURIComponent(query),
        },
        headers: {
          Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
          'accept-Type': 'application/json',
        },
      });

      if (!response) {
        throw new Error(
          "Aucune donnée reçue de TMDB. Vérifiez la connexion ou l'API.",
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { results }: UpcomingMoviesInterface = response.data;

      const movie = await Promise.all(
        results.map(async (m: TmdbMovieDto) => {
          try {
            return await this.createMovieProvider.upsertMovie(m);
          } catch (error) {
            throw new UnauthorizedException(error);
          }
        }),
      );
      allMovies.push(...movie);

      return allMovies;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  public async getMovieDetails(id: number): Promise<Movie> {
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

      return await this.createMovieProvider.upsertMovie(data);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  public async getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]> {
    const allMovies: Movie[] = [];
    let totalPages: number = 1;

    const url = `${this.tmdbConfiguration.baseUrl}/movie/upcoming`;

    page = page || this.tmdbConfiguration.defaultPage;
    language = language || this.defaultLanguage;
    region = region || (this.tmdbConfiguration.defaultCountry as RegionsIso);

    try {
      do {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.tmdbConfiguration.apiKey}`,
            'accept-Type': 'application/json',
          },
          params: {
            page, // Par page
            language, // Par code langue
            region, // Par pays
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { results, total_pages }: UpcomingMoviesInterface = response.data;
        const movie = await Promise.all(
          results.map(async (m: TmdbMovieDto) => {
            try {
              return await this.createMovieProvider.upsertMovie(m);
            } catch (error) {
              throw new UnauthorizedException(error);
            }
          }),
        );
        allMovies.push(...movie);
        totalPages = total_pages;
        page++;
      } while (page <= totalPages);

      return allMovies;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
