import { Test, TestingModule } from '@nestjs/testing';
import { MoviesModule } from './movies.module';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';

describe('MoviesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [MoviesModule],
    })
      .overrideProvider('MovieRepository')
      .useValue({})
      .overrideProvider('MovieReviewRepository')
      .useValue({})
      .overrideProvider('CastRepository')
      .useValue({})
      .overrideProvider('TheaterRepository')
      .useValue({})
      .overrideProvider('UsersService')
      .useValue({})
      .overrideProvider('ImagesService')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide MoviesService', () => {
    const service = module.get<MoviesService>(MoviesService);
    expect(service).toBeDefined();
  });

  it('should provide MoviesController', () => {
    const controller = module.get<MoviesController>(MoviesController);
    expect(controller).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
