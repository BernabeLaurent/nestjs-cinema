import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { LogsService } from './common/logs/logs.service';
import { MongoLogger } from './common/logs/mongo-logger';
import { join } from 'path';
import { NextFunction, Request, Response } from 'express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'fatal', 'debug', 'log'],
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Pour éviter qu'une valeur inexistante dans le dto se rajoute à la request du controller
      forbidNonWhitelisted: true, // Bloque la requête si une valeur inexistante dans le dto est présente dans la request du controller
      transform: true, // Transforme les valeurs des paramètres en fonction de leur type défini dans le dto
      transformOptions: {
        enableImplicitConversion: true, // Transforme les valeurs des paramètres en fonction de leur type défini dans le dto
      },
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  const portNestjs: number = configService.get('appConfig.nestjsPort') || 3000;
  const portAngular: number =
    configService.get('appConfig.angularPort') || 4200;

  const apiUrl: string =
    configService.get('appConfig.apiUrl') || 'http://localhost:' + portNestjs;
  const apiVersion = configService.get<string>('API_VERSION') || '1.0.0';
  Logger.log(`API URL: ${apiUrl}`);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('API Description Cinéma')
    .setTermsOfService('')
    .setLicense(
      'MIT Licence',
      'https://github.com/BernabeLaurent/nestjs-cinema',
    )
    .setVersion(apiVersion)
    .addServer(apiUrl)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //enable cors
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      apiUrl,
      'http://localhost:' + portNestjs,
      'http://127.0.0.1:' + portNestjs,
      'http://localhost:' + portAngular, // Pour angular
      'http://127.0.0.1:' + portAngular, // Pour angular avec IP
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600, // Cache les préférences CORS pendant 1 heure
  });

  // Pour que la doc COMPODOC soit accessible
  app.use(
    '/documentation',
    express.static(join(__dirname, '..', 'documentation')),
  );

  // Middleware pour rediriger documentation vers /documentation/index.html si nécessaire
  app.use(
    '/documentation',
    (req: Request, res: Response, next: NextFunction) => {
      if (req.path === '/' || req.path === '') {
        res.redirect('/documentation/index.html');
      } else {
        next();
      }
    },
  );

  app.use(compression());

  // ⏱️ Timeout global en millisecondes
  app.useGlobalInterceptors(new TimeoutInterceptor());

  // Protection contre les attaques XSS et autres
  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' }, // Protection contre le clickjacking
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true, // Protection contre le MIME type sniffing
      originAgentCluster: true,
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true, // Protection contre XSS
    }),
  );

  // Pour charger ma surcharge de Logger avec mongodb
  const logService = app.get(LogsService);
  const mongoLogger = new MongoLogger(logService);

  app.useLogger(mongoLogger);

  await app.listen(portNestjs, '0.0.0.0', () => {});
}

bootstrap().catch((error) => {
  console.error("Erreur lors du démarrage de l'application :", error);
});
