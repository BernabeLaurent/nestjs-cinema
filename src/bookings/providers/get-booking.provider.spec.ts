import { Test, TestingModule } from '@nestjs/testing';
import { GetBookingProvider } from './get-booking.provider';

describe('GetBookingProvider', () => {
  let provider: GetBookingProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetBookingProvider],
    }).compile();

    provider = module.get<GetBookingProvider>(GetBookingProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
