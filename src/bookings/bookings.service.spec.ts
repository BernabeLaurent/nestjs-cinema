import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { CreateBookingProvider } from './providers/create-booking.provider';
import { UpdateBookingProvider } from './providers/update-booking.provider';
import { ValidateBookingProvider } from './providers/validate-booking.provider';
import { CancelBookingProvider } from './providers/cancel-booking.provider';
import { GetBookingProvider } from './providers/get-booking.provider';
import { ValidateBookingDetailProvider } from './providers/validate-booking-detail.provider';

describe('BookingsService', () => {
  let service: BookingsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _repository: Repository<Booking>;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    manager: {
      getRepository: jest.fn(),
    },
  };

  const mockCreateBookingProvider = {
    create: jest.fn(),
  };

  const mockUpdateBookingProvider = {
    update: jest.fn(),
  };

  const mockValidateBookingProvider = {
    validate: jest.fn(),
  };

  const mockCancelBookingProvider = {
    cancel: jest.fn(),
  };

  const mockGetBookingProvider = {
    getById: jest.fn(),
    getAll: jest.fn(),
    getByUser: jest.fn(),
    getByMovieTheather: jest.fn(),
    getBySessionCinema: jest.fn(),
    getBookingsDetailsByBooking: jest.fn(),
  };

  const mockValidateBookingDetailProvider = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: CreateBookingProvider,
          useValue: mockCreateBookingProvider,
        },
        {
          provide: UpdateBookingProvider,
          useValue: mockUpdateBookingProvider,
        },
        {
          provide: ValidateBookingProvider,
          useValue: mockValidateBookingProvider,
        },
        {
          provide: CancelBookingProvider,
          useValue: mockCancelBookingProvider,
        },
        {
          provide: GetBookingProvider,
          useValue: mockGetBookingProvider,
        },
        {
          provide: ValidateBookingDetailProvider,
          useValue: mockValidateBookingDetailProvider,
        },
      ],
    }).compile();

    service = module.get(BookingsService);
    _repository = module.get(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
