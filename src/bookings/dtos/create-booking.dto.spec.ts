import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateBookingDto } from './create-booking.dto';

describe('CreateBookingDto', () => {
  let dto: CreateBookingDto;

  beforeEach(() => {
    dto = new CreateBookingDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(dto).toHaveProperty('userId');
    expect(dto).toHaveProperty('sessionCinemaId');
    expect(dto).toHaveProperty('numberSeats');
    expect(dto).toHaveProperty('numberSeatsDisabled');
    expect(dto).toHaveProperty('totalPrice');
    expect(dto).toHaveProperty('reservedSeats');
  });

  it('should validate successfully with valid data', async () => {
    const validData = {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }, { seatNumber: 2 }],
    };

    const validDto = plainToClass(CreateBookingDto, validData);
    const errors = await validate(validDto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when userId is missing', async () => {
    Object.assign(dto, {
      sessionCinemaId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userId');
  });

  it('should fail validation when sessionCinemaId is missing', async () => {
    Object.assign(dto, {
      userId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('sessionCinemaId');
  });

  it('should fail validation when numberSeats is missing', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 1,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('numberSeats');
  });

  it('should fail validation when numberSeatsDisabled is missing', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 2,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('numberSeatsDisabled');
  });

  it('should fail validation when totalPrice is missing', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('totalPrice');
  });

  it('should fail validation when reservedSeats is missing', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('reservedSeats');
  });

  it('should fail validation when userId is not a number', async () => {
    Object.assign(dto, {
      userId: 'not-a-number',
      sessionCinemaId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userId');
  });

  it('should fail validation when sessionCinemaId is not a number', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 'not-a-number',
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('sessionCinemaId');
  });

  it('should fail validation when numberSeats is not a number', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 'not-a-number',
      numberSeatsDisabled: 0,
      totalPrice: 20.9,
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('numberSeats');
  });

  it('should fail validation when totalPrice is not a number', async () => {
    Object.assign(dto, {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 2,
      numberSeatsDisabled: 0,
      totalPrice: 'not-a-number',
      reservedSeats: [{ seatNumber: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('totalPrice');
  });

  it('should handle valid reservedSeats array', async () => {
    const validData = {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 3,
      numberSeatsDisabled: 0,
      totalPrice: 31.35,
      reservedSeats: [{ seatNumber: 1 }, { seatNumber: 2 }, { seatNumber: 3 }],
    };

    const validDto = plainToClass(CreateBookingDto, validData);
    const errors = await validate(validDto);
    expect(errors).toHaveLength(0);
  });

  it('should accept zero disabled seats', async () => {
    const validData = {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 1,
      numberSeatsDisabled: 0,
      totalPrice: 10.45,
      reservedSeats: [{ seatNumber: 1 }],
    };

    const validDto = plainToClass(CreateBookingDto, validData);
    const errors = await validate(validDto);
    expect(errors).toHaveLength(0);
  });

  it('should accept multiple disabled seats', async () => {
    const validData = {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 3,
      numberSeatsDisabled: 2,
      totalPrice: 25.0,
      reservedSeats: [{ seatNumber: 1 }, { seatNumber: 2 }, { seatNumber: 3 }],
    };

    const validDto = plainToClass(CreateBookingDto, validData);
    const errors = await validate(validDto);
    expect(errors).toHaveLength(0);
  });

  it('should accept decimal totalPrice', async () => {
    const validData = {
      userId: 1,
      sessionCinemaId: 1,
      numberSeats: 1,
      numberSeatsDisabled: 0,
      totalPrice: 12.75,
      reservedSeats: [{ seatNumber: 1 }],
    };

    const validDto = plainToClass(CreateBookingDto, validData);
    const errors = await validate(validDto);
    expect(errors).toHaveLength(0);
  });
});
