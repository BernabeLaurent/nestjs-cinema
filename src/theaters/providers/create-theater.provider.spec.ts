import { Test, TestingModule } from '@nestjs/testing';
import { CreateTheaterProvider } from './create-theater.provider';

describe('CreateTheaterProvider', () => {
  let provider: CreateTheaterProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateTheaterProvider],
    }).compile();

    provider = module.get(CreateTheaterProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
