import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { Languages } from '../../common/enums/languages.enum';
import { Movie } from '../movie.entity';

export interface MoviesProvider {
  searchMovies(query: string): Promise<Movie[]>;

  getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]>;

  getMovieDetails(id: number): Promise<Movie>;
}
