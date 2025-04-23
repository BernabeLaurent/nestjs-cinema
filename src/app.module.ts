import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmdbProvider } from './movies/source/providers/tmdb.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import tmdbConfig from './movies/config/tmdb.config';
import { MoviesModule } from './movies/movies.module';
import appConfig from './config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { MoviesCron } from './movies/crons/movies.cron';
import { getMovieProvider } from './movies/movies.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import cronFetchMoviesConfig from './movies/config/cron.config';

@Module({
  imports: [
    // SETTINGS UP DATABASE CONNECTION
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [tmdbConfig, appConfig, databaseConfig, cronFetchMoviesConfig],
    }),
    MoviesModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, TmdbProvider, getMovieProvider(), MoviesCron],
})
export class AppModule {}
