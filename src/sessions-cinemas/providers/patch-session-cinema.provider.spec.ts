import { Test, TestingModule } from '@nestjs/testing';
import { PatchSessionCinemaProvider } from './patch-session-cinema.provider';

describe('PatchSessionCinemaProvider', () => {
  let provider: PatchSessionCinemaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatchSessionCinemaProvider],
    }).compile();

    provider = module.get<PatchSessionCinemaProvider>(PatchSessionCinemaProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
