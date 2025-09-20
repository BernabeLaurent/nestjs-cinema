import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        // Pour rajouter une mise en cache des fichiers partagés
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an en millisecondes
        immutable: true, // le navigateur sait que le fichier ne changera pas
      },
    }),
  ],
})
export class StaticModule {}
