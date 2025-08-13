import { BookingStatus } from './booking-status.enum';

describe('BookingStatus Enum', () => {
  it('should be defined', () => {
    expect(BookingStatus).toBeDefined();
  });

  it('should have correct values', () => {
    expect(BookingStatus.PENDING).toBe('PENDING');
    expect(BookingStatus.VALIDATED).toBe('VALIDATED');
    expect(BookingStatus.CANCELLED).toBe('CANCELLED');
  });

  it('should contain all expected statuses', () => {
    const expectedStatuses = ['PENDING', 'VALIDATED', 'CANCELLED'];
    const enumValues = Object.values(BookingStatus);

    expect(enumValues).toEqual(expectedStatuses);
    expect(enumValues).toHaveLength(3);
  });

  it('should have correct keys', () => {
    const expectedKeys = ['PENDING', 'VALIDATED', 'CANCELLED'];
    const enumKeys = Object.keys(BookingStatus);

    expect(enumKeys).toEqual(expectedKeys);
    expect(enumKeys).toHaveLength(3);
  });

  it('should be able to iterate over enum values', () => {
    const statuses = Object.values(BookingStatus);

    statuses.forEach((status) => {
      expect(typeof status).toBe('string');
      expect(status).toBeTruthy();
    });
  });

  it('should support booking workflow states', () => {
    expect(BookingStatus.PENDING).toBeDefined();
    expect(BookingStatus.VALIDATED).toBeDefined();
    expect(BookingStatus.CANCELLED).toBeDefined();
  });

  it('should be usable in switch statements', () => {
    const testStatus = (status: BookingStatus) => {
      switch (status) {
        case BookingStatus.PENDING:
          return 'waiting';
        case BookingStatus.VALIDATED:
          return 'confirmed';
        case BookingStatus.CANCELLED:
          return 'cancelled';
        default:
          return 'unknown';
      }
    };

    expect(testStatus(BookingStatus.PENDING)).toBe('waiting');
    expect(testStatus(BookingStatus.VALIDATED)).toBe('confirmed');
    expect(testStatus(BookingStatus.CANCELLED)).toBe('cancelled');
  });

  it('should maintain string values for serialization', () => {
    expect(JSON.stringify(BookingStatus.PENDING)).toBe('"PENDING"');
    expect(JSON.stringify(BookingStatus.VALIDATED)).toBe('"VALIDATED"');
    expect(JSON.stringify(BookingStatus.CANCELLED)).toBe('"CANCELLED"');
  });
});
