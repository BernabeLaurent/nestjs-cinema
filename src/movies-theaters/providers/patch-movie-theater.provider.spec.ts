import { Test, TestingModule } from '@nestjs/testing';
import { PatchMovieTheaterProvider } from './patch-movie-theater.provider';

describe('PatchMovieTheaterProvider', () => {
  let provider: PatchMovieTheaterProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatchMovieTheaterProvider],
    }).compile();

    provider = module.get<PatchMovieTheaterProvider>(PatchMovieTheaterProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
