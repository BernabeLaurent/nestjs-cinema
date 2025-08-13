import { Test, TestingModule } from '@nestjs/testing';
import { BookingsModule } from './bookings.module';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { CreateBookingProvider } from './providers/create-booking.provider';
import { GetBookingProvider } from './providers/get-booking.provider';
import { QrCodeService } from './qr-code.service';
import { ValidateBookingDetailProvider } from './providers/validate-booking-detail.provider';
import { UpdateBookingProvider } from './providers/update-booking.provider';
import { CancelBookingProvider } from './providers/cancel-booking.provider';
import { ValidateBookingProvider } from './providers/validate-booking.provider';

describe('BookingsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BookingsModule],
    })
      .overrideProvider('BookingRepository')
      .useValue({})
      .overrideProvider('BookingDetailRepository')
      .useValue({})
      .overrideProvider('UsersService')
      .useValue({})
      .overrideProvider('SessionsCinemasService')
      .useValue({})
      .overrideProvider('MoviesTheatersService')
      .useValue({})
      .overrideProvider('AuthService')
      .useValue({})
      .overrideProvider('JwtService')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide BookingsService', () => {
    const service = module.get<BookingsService>(BookingsService);
    expect(service).toBeDefined();
  });

  it('should provide BookingsController', () => {
    const controller = module.get<BookingsController>(BookingsController);
    expect(controller).toBeDefined();
  });

  it('should provide CreateBookingProvider', () => {
    const provider = module.get<CreateBookingProvider>(CreateBookingProvider);
    expect(provider).toBeDefined();
  });

  it('should provide GetBookingProvider', () => {
    const provider = module.get<GetBookingProvider>(GetBookingProvider);
    expect(provider).toBeDefined();
  });

  it('should provide QrCodeService', () => {
    const service = module.get<QrCodeService>(QrCodeService);
    expect(service).toBeDefined();
  });

  it('should provide ValidateBookingDetailProvider', () => {
    const provider = module.get<ValidateBookingDetailProvider>(
      ValidateBookingDetailProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide UpdateBookingProvider', () => {
    const provider = module.get<UpdateBookingProvider>(UpdateBookingProvider);
    expect(provider).toBeDefined();
  });

  it('should provide CancelBookingProvider', () => {
    const provider = module.get<CancelBookingProvider>(CancelBookingProvider);
    expect(provider).toBeDefined();
  });

  it('should provide ValidateBookingProvider', () => {
    const provider = module.get<ValidateBookingProvider>(
      ValidateBookingProvider,
    );
    expect(provider).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
