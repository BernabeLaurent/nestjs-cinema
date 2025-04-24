import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies.service';
import { Inject, Injectable } from '@nestjs/common';
import { TmdbProvider } from '../source/providers/tmdb.provider';
import { ConfigType } from '@nestjs/config';
import cronFetchMoviesConfig from '../config/cron.config';

@Injectable()
export class MoviesCron {
  constructor(
    private readonly movieService: MoviesService,
    private readonly tmdbProvider: TmdbProvider,
    @Inject(cronFetchMoviesConfig.KEY)
    private readonly cronFetchMoviesConfiguration: ConfigType<
      typeof cronFetchMoviesConfig
    >,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async refreshIncomingMovies() {
    // Vérification si CRON est activé
    if (!this.cronFetchMoviesConfiguration.enableCronFetchMovies) {
      return;
    }
    const movies = await this.movieService.getUpcomingMovies();

    // Enregistrement ou update si déjà présent
    for (const movie of movies) {
      const movieFound = await this.movieService.getMovieByExternalId(movie.id);

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
