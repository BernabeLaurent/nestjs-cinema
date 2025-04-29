import { Test, TestingModule } from '@nestjs/testing';
import { FindMoviesTheatersByTheaterIdProvider } from './find-movies-theaters-by-theater-id.provider';

describe('FindMoviesTheatersByTheaterIdProvider', () => {
  let provider: FindMoviesTheatersByTheaterIdProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindMoviesTheatersByTheaterIdProvider],
    }).compile();

    provider = module.get<FindMoviesTheatersByTheaterIdProvider>(FindMoviesTheatersByTheaterIdProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
