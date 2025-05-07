import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import tmdbConfig from './movies/config/tmdb.config';
import { MoviesModule } from './movies/movies.module';
import appConfig from './config/app.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './auth/guards/access-token/roles.guard';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MoviesTheatersModule } from './movies-theaters/movies-theaters.module';
import { SessionsCinemasModule } from './sessions-cinemas/sessions-cinemas.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookingTokenGuard } from './auth/guards/access-token/booking-token-guard';

@Module({
  imports: [
    // Pour envoyer des emails
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // ou smtp.gmail.com
        port: 587,
        auth: {
          user: 'bernabe.laurent@gmail.com',
          pass: 'MerguezParty83!!',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@example.com>',
      },
      template: {
        dir: join(__dirname, 'notifications', 'templates'),
        adapter: new HandlebarsAdapter(), // si tu veux faire des templates HTML
        options: {
          strict: true,
        },
      },
    }),
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
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),

    MoviesModule,
    ScheduleModule.forRoot(),
    TheatersModule,
    UsersModule,
    AuthModule,
    NotificationsModule,
    MoviesTheatersModule,
    SessionsCinemasModule,
    BookingsModule,
  ],
  controllers: [AppController],
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
    AccessTokenGuard,
    BookingTokenGuard,
  ],
})
export class AppModule {}
