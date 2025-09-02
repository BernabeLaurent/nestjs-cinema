import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserProvider } from './update-user.provider';

describe('UpdateUserProvider', () => {
  let provider: UpdateUserProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateUserProvider],
    }).compile();

    provider = module.get(UpdateUserProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
