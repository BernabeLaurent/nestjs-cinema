import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { RoleUser } from '../enums/roles-users.enum';
import { RegionsIso } from '../../common/enums/regions-iso.enum';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  describe('Valid DTO', () => {
    it('should pass validation with valid data', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with optional fields', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';
      dto.googleId = '123456789';
      dto.address = '123 Main St';
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.codeCountry = RegionsIso.FRANCE;
      dto.phoneNumber = '0123456789';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Invalid DTO', () => {
    it('should fail validation with firstName too short', async () => {
      dto.firstName = 'J';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
    });

    it('should fail validation with firstName too long', async () => {
      dto.firstName = 'a'.repeat(65);
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('firstName');
    });

    it('should fail validation with invalid email', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'invalid-email';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with invalid password', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'weak';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail validation with invalid role', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      Object.assign(dto, { roleUser: 'INVALID_ROLE' });
      dto.password = 'Password123!';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('roleUser');
    });

    it('should fail validation with missing required fields', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const properties = errors.map((error) => error.property);
      expect(properties).toContain('firstName');
      expect(properties).toContain('lastName');
      expect(properties).toContain('email');
      expect(properties).toContain('roleUser');
      expect(properties).toContain('password');
    });

    it('should fail validation with city too long', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';
      dto.city = 'a'.repeat(61);

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('city');
    });

    it('should fail validation with phoneNumber too long', async () => {
      dto.firstName = 'John';
      dto.lastName = 'Doe';
      dto.email = 'john.doe@example.com';
      dto.hasDisability = false;
      dto.roleUser = RoleUser.CUSTOMER;
      dto.password = 'Password123!';
      dto.phoneNumber = '0'.repeat(33);

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phoneNumber');
    });
  });
});
