import { Test, TestingModule } from '@nestjs/testing';
import { EmailProvider } from './email.provider';

describe('EmailProvider', () => {
  let provider: EmailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailProvider],
    }).compile();

    provider = module.get<EmailProvider>(EmailProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
