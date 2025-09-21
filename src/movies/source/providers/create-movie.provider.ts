import { Movie } from '../../movie.entity';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { TmdbProvider } from './tmdb.provider';
import { MoviesService } from '../../movies.service';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CreateMovieProvider {
  constructor(
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
    @Inject(forwardRef(() => TmdbProvider))
    private readonly tmdbProvider: TmdbProvider,
  ) {}

  public async upsertMovie(movie: TmdbMovieDto): Promise<Movie | null> {
    const mappedMovie = this.tmdbProvider.mapTmdbDtoToMovie(movie);

    // Si le mapping retourne null (langue non supportée), on ignore le film
    if (!mappedMovie) {
      return null;
    }

    const movieFound = await this.moviesService.getMovieByExternalId(movie.id);

    if (movieFound) {
      movie.id = movieFound.movieExterneId;
      return await this.moviesService.updateMovie(movieFound.id, mappedMovie);
    } else {
      // Sinon on le crée
      const movieCreated = await this.moviesService.createMovie(mappedMovie);

      // On insére le cast
      try {
        await this.moviesService.getCast(
          movieCreated.movieExterneId,
          movieCreated.id,
        );
      } catch (error) {
        throw new UnauthorizedException(error);
      }

      return movieCreated;
    }
  }
}
