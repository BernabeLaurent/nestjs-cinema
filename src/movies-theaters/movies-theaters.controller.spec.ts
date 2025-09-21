import { Test, TestingModule } from '@nestjs/testing';
import { MoviesTheatersController } from './movies-theaters.controller';
import { MoviesTheatersService } from './movies-theaters.service';

describe('MoviesTheatersController', () => {
  let controller: MoviesTheatersController;

  const mockMoviesTheatersService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesTheatersController],
      providers: [
        {
          provide: MoviesTheatersService,
          useValue: mockMoviesTheatersService,
        },
      ],
    }).compile();

    controller = module.get(MoviesTheatersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
