import { Test, TestingModule } from '@nestjs/testing';
import { GetSessionCinemaProvider } from './get-session-cinema.provider';

describe('GetSessionCinemaProvider', () => {
  let provider: GetSessionCinemaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetSessionCinemaProvider],
    }).compile();

    provider = module.get(GetSessionCinemaProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
