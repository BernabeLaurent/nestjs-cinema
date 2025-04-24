import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { Languages } from '../../common/enums/languages.enum';
import { TmdbMovieDto } from '../source/dtos/tmdb-movie.dto';

export interface MoviesProvider {
  searchMovies(query: string): Promise<TmdbMovieDto[]>;

  getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<TmdbMovieDto[]>;

  getMovieDetails(id: number): Promise<TmdbMovieDto>;
}
