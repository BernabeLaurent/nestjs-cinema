import { validate } from 'class-validator';
import { PatchUserDto } from './patch-user.dto';
import { RoleUser } from '../enums/roles-users.enum';
import { RegionsIso } from '../../common/enums/regions-iso.enum';

describe('PatchUserDto', () => {
  let dto: PatchUserDto;

  beforeEach(() => {
    dto = new PatchUserDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should extend CreateUserDto', () => {
    expect(dto).toHaveProperty('firstName');
    expect(dto).toHaveProperty('lastName');
    expect(dto).toHaveProperty('email');
    expect(dto).toHaveProperty('hasDisability');
    expect(dto).toHaveProperty('roleUser');
    expect(dto).toHaveProperty('password');
  });

  describe('Valid DTO - Partial Updates', () => {
    it('should pass validation with partial data - firstName only', async () => {
      dto.firstName = 'John';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - email only', async () => {
      dto.email = 'john.doe@example.com';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data - role only', async () => {
      dto.roleUser = RoleUser.ADMIN;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with multiple optional fields', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.address = '123 Main St';
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.codeCountry = RegionsIso.FRANCE;
      dto.phoneNumber = '0123456789';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty DTO (all fields optional)', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with firstName too short', async () => {
      dto.firstName = 'J';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
    });

    it('should fail validation with invalid email', async () => {
      dto.email = 'invalid-email';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with invalid password', async () => {
      dto.password = 'weak';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with invalid role', async () => {
      Object.assign(dto, { roleUser: 'INVALID_ROLE' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('roleUser');
    });

    it('should fail validation with city too long', async () => {
      dto.city = 'a'.repeat(61);

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('city');
    });
  });
});
