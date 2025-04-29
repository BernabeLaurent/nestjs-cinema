import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieTheaterProvider } from './create-movie-theater.provider';

describe('CreateMovieTheaterProvider', () => {
  let provider: CreateMovieTheaterProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateMovieTheaterProvider],
    }).compile();

    provider = module.get<CreateMovieTheaterProvider>(CreateMovieTheaterProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
