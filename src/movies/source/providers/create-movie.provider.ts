import { Movie } from '../../movie.entity';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { TmdbProvider } from './tmdb.provider';
import { MoviesService } from '../../movies.service';

export class CreateMovieProvider {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly tmdbProvider: TmdbProvider,
  ) {}

  public async upsertMovie(movie: TmdbMovieDto): Promise<Movie> {
    // Pour chaque film recherché, on vérifie son détail
    // let movieTmdb: TmdbMovieDto | null = null;
    // try {
    //   movieTmdb = await this.tmdbProvider.getMovieDetails(movie.id);
    // } catch (error) {
    //   throw new UnauthorizedException(error);
    // }
    // console.log('ici ', movieTmdb);
    // if (!movieTmdb) {
    //   throw new Error('Movie details could not be retrieved.');
    // }
    console.log('movie ', movie);
    const movieFound = await this.moviesService.getMovieByExternalId(movie.id);

    if (movieFound) {
      return await this.moviesService.updateMovie(movie);
    } else {
      // Sinon on le crée
      return await this.moviesService.createMovie(
        this.tmdbProvider.mapTmdbDtoToMovie(movie),
      );
    }
  }
}
