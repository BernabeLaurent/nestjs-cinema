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
import { CastDto } from '../dtos/cast.dto';
import { Cast } from '../../cast.entity';
import { CreateCastProvider } from './create-cast.provider';
import { ImagesService } from '../../../common/images/images.service';
import { ImageType } from '../../../common/enums/images-types.enum';

@Injectable()
export class TmdbProvider implements MoviesProvider {
  private readonly defaultLanguage: Languages;

  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly tmdbConfiguration: ConfigType<typeof tmdbConfig>, // Assuming you have a JWT configuration for token generation
    private readonly createMovieProvider: CreateMovieProvider,
    private readonly createCastProvider: CreateCastProvider,
    private readonly imagesServices: ImagesService,
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
      backdropPath: dto.backdrop_path,
      posterPath: dto.poster_path,
    };
  }

  public mapTmdbCastDtoToCast(dto: CastDto): Partial<Cast> {
    return {
      character: dto.character,
      name: dto.name,
      originalName: dto.original_name,
      profilePath: dto.profile_path,
      adult: dto.adult,
      gender: dto.gender,
      order: dto.order,
      movieId: dto.movieId,
      castId: dto.cast_id,
    };
  }

  public async getCastMovie(
    movieExternalId: number,
    movieId?: number,
  ): Promise<Cast[]> {
    // Si pas de movieId, on récupére le film sur tmdb
    if (!movieId) {
      const movie = await this.getMovieDetails(movieExternalId);
      movieId = movie.id;
    }

    const url = `${this.tmdbConfiguration.baseUrl}/movie/${movieExternalId}/credits`;
    try {
      const { data }: { data: CastDto[] } = await axios.get(url, {
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

      const castList: CastDto[] = await Promise.all(
        (data['cast'] as CastDto[]).map(async (m: CastDto) => {
          m.movieId = movieId;
          if (m.profile_path) {
            m.profile_path =
              await this.imagesServices.asyncDownloadImageFromUrl(
                ImageType.ACTOR,
                `${this.tmdbConfiguration.imageUrl}${m.profile_path}`,
                m.profile_path,
              );
          }
          return m;
        }),
      );

      const casting: Cast[] = [];

      // Pour chaque cast, on l'ajoute à la base de données
      for (const cast of castList) {
        const createdCast = await this.createCastProvider.upsertCast(cast);
        casting.push(createdCast);
      }

      return casting;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  public async searchExternalMovies(query: string): Promise<Movie[]> {
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
            return await this.getMovieDetails(m.id);
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

      // On construit l'url des images
      if (data.backdrop_path) {
        data.backdrop_path =
          await this.imagesServices.asyncDownloadImageFromUrl(
            ImageType.BACKDROP,
            `${this.tmdbConfiguration.imageUrl}${data.backdrop_path}`,
            data.backdrop_path,
          );
      }
      if (data.poster_path) {
        data.poster_path = await this.imagesServices.asyncDownloadImageFromUrl(
          ImageType.POSTER,
          `${this.tmdbConfiguration.imageUrl}${data.poster_path}`,
          data.poster_path,
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
              return await this.getMovieDetails(m.id);
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
