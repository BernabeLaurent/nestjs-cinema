import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Pour éviter qu'une valeur inexistante dans le dto se rajoute à la request du controller
      forbidNonWhitelisted: true, // Bloque la requête si une valeur inexistante dans le dto est présente dans la request du controller
      transform: true, // Transforme les valeurs des paramètres en fonction de leur type défini dans le dto
      transformOptions: {
        enableImplicitConversion: true, // Transforme les valeurs des paramètres en fonction de leur type défini dans le dto
      },
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('API Description Cinéma')
    .setTermsOfService('')
    .setLicense(
      'MIT Licence',
      'https://github.com/BernabeLaurent/nestjs-cinema',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //enable cors
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
