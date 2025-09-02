import { Test, TestingModule } from '@nestjs/testing';
import { CreateSessionCinemaProvider } from './create-session-cinema.provider';

describe('CreateSessionCinemaProvider', () => {
  let provider: CreateSessionCinemaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateSessionCinemaProvider],
    }).compile();

    provider = module.get(CreateSessionCinemaProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
