import { TmdbMovieDto } from '../source/dtos/tmdb-movie.dto';

export interface UpcomingMoviesInterface {
  results: TmdbMovieDto[];
  total_pages: number;
}
