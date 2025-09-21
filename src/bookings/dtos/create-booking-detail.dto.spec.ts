import { validate } from 'class-validator';
import { CreateBookingDetailDto } from './create-booking-detail.dto';

describe('CreateBookingDetailDto', () => {
  let dto: CreateBookingDetailDto;

  beforeEach(() => {
    dto = new CreateBookingDetailDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(dto).toHaveProperty('seatNumber');
    expect(dto).toHaveProperty('isValidated');
  });

  it('should validate successfully with valid seatNumber', async () => {
    Object.assign(dto, {
      seatNumber: 1,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate successfully with seatNumber and isValidated', async () => {
    Object.assign(dto, {
      seatNumber: 5,
      isValidated: true,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when seatNumber is missing', async () => {
    Object.assign(dto, {
      isValidated: false,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('seatNumber');
  });

  it('should fail validation when seatNumber is not a number', async () => {
    Object.assign(dto, {
      seatNumber: 'not-a-number',
      isValidated: true,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('seatNumber');
  });

  it('should fail validation when isValidated is not a boolean', async () => {
    Object.assign(dto, {
      seatNumber: 1,
      isValidated: 'not-a-boolean',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('isValidated');
  });

  it('should accept isValidated as true', async () => {
    Object.assign(dto, {
      seatNumber: 10,
      isValidated: true,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept isValidated as false', async () => {
    Object.assign(dto, {
      seatNumber: 15,
      isValidated: false,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should work without isValidated property (optional)', async () => {
    Object.assign(dto, {
      seatNumber: 25,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should handle different seat numbers', async () => {
    const seatNumbers = [1, 5, 10, 25, 50, 100];

    for (const seatNumber of seatNumbers) {
      Object.assign(dto, { seatNumber });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should fail validation with zero as seat number', async () => {
    Object.assign(dto, {
      seatNumber: 0,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('seatNumber');
  });

  it('should fail validation with negative seat numbers', async () => {
    Object.assign(dto, {
      seatNumber: -1,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('seatNumber');
  });

  it('should fail validation with decimal seat numbers', async () => {
    Object.assign(dto, {
      seatNumber: 1.5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('seatNumber');
  });

  it('should validate with both properties set correctly', async () => {
    const testCases = [
      { seatNumber: 1, isValidated: true },
      { seatNumber: 2, isValidated: false },
      { seatNumber: 10, isValidated: true },
      { seatNumber: 50, isValidated: false },
    ];

    for (const testCase of testCases) {
      Object.assign(dto, testCase);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
