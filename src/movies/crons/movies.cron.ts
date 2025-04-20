import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from '../movies.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesCron {
  constructor(private readonly movieService: MoviesService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async refreshIncomingMovies() {
    const movies = await this.movieService.getUpcomingMovies();

    // todo ajouter enregistrement ou update si déjà présent
    for (const movie of movies) {
      console.log(movie);
    }
  }
}
