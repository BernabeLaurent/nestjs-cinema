import { Test, TestingModule } from '@nestjs/testing';
import { MoviesTheatersController } from './movies-theaters.controller';

describe('MoviesTheatersController', () => {
  let controller: MoviesTheatersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesTheatersController],
    }).compile();

    controller = module.get(MoviesTheatersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
