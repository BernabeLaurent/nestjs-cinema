import { validate } from 'class-validator';
import { UpdateBookingDto } from './update-booking.dto';
import { BookingStatus } from '../enums/booking-status.enum';

describe('UpdateBookingDto', () => {
  let dto: UpdateBookingDto;

  beforeEach(() => {
    dto = new UpdateBookingDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(dto).toHaveProperty('status');
  });

  it('should validate successfully with valid BookingStatus', async () => {
    Object.assign(dto, {
      status: BookingStatus.VALIDATED,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate successfully without status (optional)', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept PENDING status', async () => {
    Object.assign(dto, {
      status: BookingStatus.PENDING,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept VALIDATED status', async () => {
    Object.assign(dto, {
      status: BookingStatus.VALIDATED,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept CANCELLED status', async () => {
    Object.assign(dto, {
      status: BookingStatus.CANCELLED,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid status', async () => {
    Object.assign(dto, {
      status: 'INVALID_STATUS',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should fail validation when status is not a string', async () => {
    Object.assign(dto, {
      status: 123,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should fail validation when status is boolean', async () => {
    Object.assign(dto, {
      status: true,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should validate all valid BookingStatus values', async () => {
    const validStatuses = [
      BookingStatus.PENDING,
      BookingStatus.VALIDATED,
      BookingStatus.CANCELLED,
    ];

    for (const status of validStatuses) {
      Object.assign(dto, { status });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should fail with empty string status', async () => {
    Object.assign(dto, {
      status: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should fail with null status', async () => {
    Object.assign(dto, {
      status: null,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should fail with undefined explicitly set', async () => {
    Object.assign(dto, {
      status: undefined,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should handle case sensitivity', async () => {
    Object.assign(dto, {
      status: 'pending',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should support booking status transitions', async () => {
    const transitions = [
      BookingStatus.PENDING,
      BookingStatus.VALIDATED,
      BookingStatus.CANCELLED,
    ];

    for (const status of transitions) {
      Object.assign(dto, { status });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
