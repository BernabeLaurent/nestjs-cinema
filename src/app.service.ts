import { Injectable } from '@nestjs/common';

import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MoviesModule],
})

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
