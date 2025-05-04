import { Test, TestingModule } from '@nestjs/testing';
import { GenerateTokenValidationBookingDetailProvider } from './generate-token-validation-booking-detail.provider';

describe('GenerateTokenValidationBookingDetailProvider', () => {
  let provider: GenerateTokenValidationBookingDetailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateTokenValidationBookingDetailProvider],
    }).compile();

    provider = module.get<GenerateTokenValidationBookingDetailProvider>(GenerateTokenValidationBookingDetailProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
