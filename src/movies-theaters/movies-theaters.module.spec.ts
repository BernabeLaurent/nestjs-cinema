import { Test, TestingModule } from '@nestjs/testing';
import { MoviesTheatersModule } from './movies-theaters.module';
import { MoviesTheatersService } from './movies-theaters.service';
import { MoviesTheatersController } from './movies-theaters.controller';
import { FindMoviesTheatersByTheaterIdProvider } from './providers/find-movies-theaters-by-theater-id.provider';
import { CreateMovieTheaterProvider } from './providers/create-movie-theater.provider';
import { PatchMovieTheaterProvider } from './providers/patch-movie-theater.provider';

describe('MoviesTheatersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MoviesTheatersModule],
    })
      .overrideProvider('MovieTheaterRepository')
      .useValue({})
      .overrideProvider('TheatersService')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide MoviesTheatersService', () => {
    const service = module.get(MoviesTheatersService);
    expect(service).toBeDefined();
  });

  it('should provide MoviesTheatersController', () => {
    const controller = module.get<MoviesTheatersController>(
      MoviesTheatersController,
    );
    expect(controller).toBeDefined();
  });

  it('should provide FindMoviesTheatersByTheaterIdProvider', () => {
    const provider = module.get<FindMoviesTheatersByTheaterIdProvider>(
      FindMoviesTheatersByTheaterIdProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide CreateMovieTheaterProvider', () => {
    const provider = module.get<CreateMovieTheaterProvider>(
      CreateMovieTheaterProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide PatchMovieTheaterProvider', () => {
    const provider = module.get<PatchMovieTheaterProvider>(
      PatchMovieTheaterProvider,
    );
    expect(provider).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
