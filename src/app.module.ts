import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmdbProvider } from './movies/source/providers/tmdb.provider';
import { ConfigModule } from '@nestjs/config';
import tmdbConfig from './movies/config/tmdb.config';
import { MoviesModule } from './movies/movies.module';
import appConfig from './config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { MoviesCron } from './movies/crons/movies.cron';
import { MoviesService } from './movies/movies.service';
import { getMovieProvider } from './movies/movies.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [tmdbConfig, appConfig],
    }),
    MoviesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TmdbProvider,
    getMovieProvider(),
    MoviesService,
    MoviesCron,
  ],
})
export class AppModule {}
