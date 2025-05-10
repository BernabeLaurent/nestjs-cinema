import { RegionsIso } from '../../common/enums/regions-iso.enum';
import { Languages } from '../../common/enums/languages.enum';
import { Movie } from '../movie.entity';
import { Cast } from '../cast.entity';

export interface MoviesProvider {
  searchExternalMovies(query: string): Promise<Movie[]>;

  getUpcomingMovies(
    region?: RegionsIso,
    language?: Languages,
    page?: number,
  ): Promise<Movie[]>;

  getMovieDetails(id: number): Promise<Movie>;

  getCastMovie(movieExternalId: number, movieId?: number): Promise<Cast[]>;
}
