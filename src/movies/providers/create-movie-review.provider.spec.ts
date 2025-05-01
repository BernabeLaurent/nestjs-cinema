import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieReviewProvider } from './create-movie-review.provider';

describe('CreateMovieReviewProvider', () => {
  let provider: CreateMovieReviewProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateMovieReviewProvider],
    }).compile();

    provider = module.get<CreateMovieReviewProvider>(CreateMovieReviewProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
