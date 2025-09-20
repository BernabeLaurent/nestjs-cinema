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

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Système de Gestion de Cinéma')
    .setDescription(`
    ## Description
    API RESTful complète pour un système de gestion de cinéma développé avec NestJS.

    ## Fonctionnalités
    - 🎬 **Gestion des films** : Ajout, modification, suppression et recherche de films
    - 🎭 **Gestion des salles** : Configuration des salles et des places
    - 📅 **Séances de cinéma** : Programmation et gestion des horaires
    - 🎟️ **Réservations** : Système complet de réservation en ligne
    - 👥 **Utilisateurs** : Inscription, authentification et gestion des profils
    - 🔔 **Notifications** : Système d'alertes et de confirmations

    ## Authentification
    Cette API utilise l'authentification JWT. Pour accéder aux endpoints protégés, vous devez :
    1. Créer un compte ou vous connecter via \`/auth/login\`
    2. Utiliser le token JWT retourné dans le header \`Authorization: Bearer <token>\`

    ## Formats de Réponse
    Toutes les réponses suivent le format standardisé :
    \`\`\`json
    {
      "data": [...],
      "apiVersion": "1.0.0",
      "timestamp": "2024-03-20T10:30:00Z"
    }
    \`\`\`

    ## Support
    - Documentation technique : [api.bernabe.codes/documentation](https://api.bernabe.codes/documentation)
    - Repository GitHub : [github.com/BernabeLaurent/nestjs-cinema](https://github.com/BernabeLaurent/nestjs-cinema)
    `)
    .setTermsOfService('https://github.com/BernabeLaurent/nestjs-cinema/blob/main/LICENSE')
    .setContact(
      'Support Technique',
      'https://github.com/BernabeLaurent/nestjs-cinema/issues',
      'support@bernabe.codes'
    )
    .setLicense(
      'Licence MIT',
      'https://github.com/BernabeLaurent/nestjs-cinema/blob/main/LICENSE',
    )
    .setVersion(apiVersion)
    .addServer(apiUrl, 'Serveur de Production')
    .addServer('http://localhost:3000', 'Serveur de Développement')
    .addTag('Authentification', 'Endpoints pour la connexion et la gestion des tokens')
    .addTag('Films', 'Gestion des films et de leurs métadonnées')
    .addTag('Salles', 'Configuration et gestion des salles de cinéma')
    .addTag('Séances', 'Programmation et gestion des séances de cinéma')
    .addTag('Réservations', 'Système de réservation et gestion des places')
    .addTag('Utilisateurs', 'Gestion des comptes utilisateurs et profils')
    .addTag('Notifications', 'Système de notifications et alertes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT obtenu via /auth/login',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Activation de CORS
  const defaultOrigins = [
    apiUrl,
    'http://localhost:' + portNestjs,
    'http://127.0.0.1:' + portNestjs,
    'http://localhost:' + portAngular, // Pour angular
    'http://127.0.0.1:' + portAngular, // Pour angular avec IP
  ];
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? [...process.env.ALLOWED_ORIGINS.split(','), ...defaultOrigins]
    : defaultOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      console.log('Request from origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow request
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    // origin: allowedOrigins,
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
  const validPolicies = ['same-origin', 'same-site', 'cross-origin'] as const;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const policy = validPolicies.includes(process.env.POLICY as any)
    ? (process.env.POLICY as 'same-origin' | 'same-site' | 'cross-origin')
    : 'cross-origin';

  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy },
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
