import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies.service';
import { Injectable } from '@nestjs/common';
import { TmdbProvider } from '../source/providers/tmdb.provider';

@Injectable()
export class MoviesCron {
  constructor(
    private readonly movieService: MoviesService,
    private readonly tmdbProvider: TmdbProvider,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshIncomingMovies() {
    const movies = await this.movieService.getUpcomingMovies();

    // Enregistrement ou update si déjà présent
    for (const movie of movies) {
      const movieFound = await this.movieService.getMovieByExternalId(
        movie.id,
      );

      if (movieFound) {
        movie.id = movieFound.id;
        await this.movieService.updateMovie(movie);
      } else {
        // insert
        await this.movieService.createMovie(
          this.tmdbProvider.mapTmdbDtoToMovie(movie),
        );
      }
    }
  }
}
