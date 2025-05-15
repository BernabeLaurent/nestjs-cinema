import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import tmdbConfig from './movies/config/tmdb.config';
import { MoviesModule } from './movies/movies.module';
import appConfig from './config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TheatersModule } from './theaters/theaters.module';
import { UsersModule } from './users/users.module';
import databaseConfig from './config/database.config';
import cronFetchMoviesConfig from './movies/config/cron.config';
import { AuthModule } from './auth/auth.module';
import { PaginationProvider } from './common/pagination/providers/pagination.provider';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { RolesGuard } from './auth/guards/access-token/roles.guard';
import { NotificationsModule } from './notifications/notifications.module';
import { MoviesTheatersModule } from './movies-theaters/movies-theaters.module';
import { SessionsCinemasModule } from './sessions-cinemas/sessions-cinemas.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookingTokenGuard } from './auth/guards/access-token/booking-token-guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ImagesModule } from './common/images/images.module';
import emailConfig from './notifications/config/email.config';
import jwtConfig from './auth/config/jwt.config';

// Ajout de modules de configuration pour rendre le fichier plus lisible
import { DatabaseModule } from './config/database.module';
import { EmailModule } from './config/email.module';
import { AppCacheModule } from './config/cache.module';
import { SecurityModule } from './config/security.module';
import { StaticModule } from './config/static.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        tmdbConfig,
        appConfig,
        databaseConfig,
        cronFetchMoviesConfig,
        emailConfig,
        jwtConfig,
      ],
    }),

    // Modules de configuration
    DatabaseModule,
    EmailModule,
    AppCacheModule,
    SecurityModule,
    StaticModule,

    // Modules fonctionnels
    ScheduleModule.forRoot(),
    MoviesModule,
    TheatersModule,
    UsersModule,
    AuthModule,
    NotificationsModule,
    MoviesTheatersModule,
    SessionsCinemasModule,
    BookingsModule,
    ImagesModule,
  ],
  providers: [
    AppService,
    PaginationProvider,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // Pour le rendre global
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AccessTokenGuard,
    BookingTokenGuard,
  ],
})
export class AppModule {}
