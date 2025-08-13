import { validate } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

describe('PaginationQueryDto', () => {
  it('should be defined', () => {
    const dto = new PaginationQueryDto();
    expect(dto).toBeDefined();
  });

  it('should have default values', () => {
    const dto = new PaginationQueryDto();
    expect(dto.limit).toBe(10);
    expect(dto.page).toBe(1);
  });

  it('should allow valid limit values', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 20;
    dto.page = 2;

    const validationErrors = await validate(dto);
    expect(validationErrors).toHaveLength(0);
  });

  it('should allow undefined limit and page (optional)', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = undefined;
    dto.page = undefined;

    const validationErrors = await validate(dto);
    expect(validationErrors).toHaveLength(0);
  });

  it('should reject negative limit', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = -5;

    const validationErrors = await validate(dto);
    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].property).toBe('limit');
    expect(validationErrors[0].constraints).toHaveProperty('isPositive');
  });

  it('should reject zero limit', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 0;

    const validationErrors = await validate(dto);
    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].property).toBe('limit');
    expect(validationErrors[0].constraints).toHaveProperty('isPositive');
  });

  it('should reject negative page', async () => {
    const dto = new PaginationQueryDto();
    dto.page = -1;

    const validationErrors = await validate(dto);
    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].property).toBe('page');
    expect(validationErrors[0].constraints).toHaveProperty('isPositive');
  });

  it('should reject zero page', async () => {
    const dto = new PaginationQueryDto();
    dto.page = 0;

    const validationErrors = await validate(dto);
    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].property).toBe('page');
    expect(validationErrors[0].constraints).toHaveProperty('isPositive');
  });

  it('should accept positive numbers', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 50;
    dto.page = 3;

    const validationErrors = await validate(dto);
    expect(validationErrors).toHaveLength(0);
  });

  it('should handle large numbers', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = 1000;
    dto.page = 999;

    const validationErrors = await validate(dto);
    expect(validationErrors).toHaveLength(0);
  });

  it('should validate both properties independently', async () => {
    const dto1 = new PaginationQueryDto();
    dto1.limit = -1;
    dto1.page = 1;

    const validationErrors1 = await validate(dto1);
    expect(validationErrors1).toHaveLength(1);
    expect(validationErrors1[0].property).toBe('limit');

    const dto2 = new PaginationQueryDto();
    dto2.limit = 10;
    dto2.page = -1;

    const validationErrors2 = await validate(dto2);
    expect(validationErrors2).toHaveLength(1);
    expect(validationErrors2[0].property).toBe('page');
  });

  it('should validate both properties when both are invalid', async () => {
    const dto = new PaginationQueryDto();
    dto.limit = -5;
    dto.page = -2;

    const validationErrors = await validate(dto);
    expect(validationErrors).toHaveLength(2);

    const limitError = validationErrors.find(
      (error) => error.property === 'limit',
    );
    const pageError = validationErrors.find(
      (error) => error.property === 'page',
    );

    expect(limitError).toBeDefined();
    expect(pageError).toBeDefined();
  });

  it('should have IsOptional and IsPositive decorators working correctly', async () => {
    // Test optional behavior
    const dto1 = new PaginationQueryDto();
    const validationErrors1 = await validate(dto1);
    expect(validationErrors1).toHaveLength(0);

    // Test positive validation
    const dto2 = new PaginationQueryDto();
    dto2.limit = 1;
    dto2.page = 1;
    const validationErrors2 = await validate(dto2);
    expect(validationErrors2).toHaveLength(0);

    // Test invalid positive values
    const dto3 = new PaginationQueryDto();
    dto3.limit = 0.5; // Should be rejected as not positive integer
    const validationErrors3 = await validate(dto3);
    expect(validationErrors3.length).toBeGreaterThan(0);
  });
});
