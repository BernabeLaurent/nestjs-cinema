import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookingProvider } from './create-booking.provider';

describe('CreateBookingProvider', () => {
  let provider: CreateBookingProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateBookingProvider],
    }).compile();

    provider = module.get(CreateBookingProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
