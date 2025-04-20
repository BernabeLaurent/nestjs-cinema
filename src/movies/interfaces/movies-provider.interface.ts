import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { Languages } from '../../common/enums/languages.enum';

export interface Movie {
  title: string;
  year: string;
  description: string;
}

export interface MoviesProvider {
  searchMovies(query: string): Promise<Movie[]>;

  getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]>;

  getMovieDetails(id: string): Promise<Movie>;
}
