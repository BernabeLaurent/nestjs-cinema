import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmdbProvider } from './movies/source/providers/tmdb.provider';
import { ConfigModule } from '@nestjs/config';
import tmdbConfig from './movies/config/tmdb.config';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [tmdbConfig],
    }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService, TmdbProvider],
})
export class AppModule {}
