import { Test, TestingModule } from '@nestjs/testing';
import { SearchMoviesProvider } from './search-movies.provider';

describe('SearchMoviesProvider', () => {
  let provider: SearchMoviesProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchMoviesProvider],
    }).compile();

    provider = module.get(SearchMoviesProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
