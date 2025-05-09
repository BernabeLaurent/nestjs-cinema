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

  public async upsertMovie(movie: TmdbMovieDto): Promise<Movie> {
    const movieFound = await this.moviesService.getMovieByExternalId(movie.id);
    console.log('movieFound', movieFound);
    console.log('movie', movie);

    if (movieFound) {
      movie.id = movieFound.movieExterneId;
      return await this.moviesService.updateMovie(
        movieFound.id,
        this.tmdbProvider.mapTmdbDtoToMovie(movie),
      );
    } else {
      // Sinon on le crée
      const movieCreated = await this.moviesService.createMovie(
        this.tmdbProvider.mapTmdbDtoToMovie(movie),
      );

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
