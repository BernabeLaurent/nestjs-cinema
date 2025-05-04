import { Test, TestingModule } from '@nestjs/testing';
import { ValidateBookingDetailProvider } from './validate-booking-detail.provider';

describe('ValidateBookingDetailProvider', () => {
  let provider: ValidateBookingDetailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateBookingDetailProvider],
    }).compile();

    provider = module.get<ValidateBookingDetailProvider>(
      ValidateBookingDetailProvider,
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
