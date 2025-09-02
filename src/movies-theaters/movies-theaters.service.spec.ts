import { Test, TestingModule } from '@nestjs/testing';
import { MoviesTheatersService } from './movies-theaters.service';

describe('MoviesTheatersService', () => {
  let service: MoviesTheatersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesTheatersService],
    }).compile();

    service = module.get(MoviesTheatersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
