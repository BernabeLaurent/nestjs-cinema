import { Movie } from '../../movie.entity';
import { TmdbMovieDto } from '../dtos/tmdb-movie.dto';
import { TmdbProvider } from './tmdb.provider';
import { MoviesService } from '../../movies.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

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

    if (movieFound) {
      movie.id = movieFound.id;
      return await this.moviesService.updateMovie(movie);
    } else {
      // Sinon on le crée
      return await this.moviesService.createMovie(
        this.tmdbProvider.mapTmdbDtoToMovie(movie),
      );
    }
  }
}
