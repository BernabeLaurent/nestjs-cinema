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
    return await this.movieService.getUpcomingMovies();
  }
}
