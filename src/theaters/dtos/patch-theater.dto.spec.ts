import { validate } from 'class-validator';
import { PatchTheaterDto } from './patch-theater.dto';
import { RegionsIso } from '../../common/enums/regions-iso.enum';

describe('PatchTheaterDto', () => {
  let dto: PatchTheaterDto;

  beforeEach(() => {
    dto = new PatchTheaterDto();
  });

  it('should be valid when all fields are optional and empty', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe('name (optional)', () => {
    it('should be valid with correct name', async () => {
      dto.name = 'Updated Theater';

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      expect(nameErrors).toHaveLength(0);
    });

    it('should fail when name is too short', async () => {
      dto.name = 'ABC';

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should fail when name is too long', async () => {
      dto.name = 'A'.repeat(251);

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should be valid when name is undefined', async () => {
      dto.name = undefined;

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      expect(nameErrors).toHaveLength(0);
    });
  });

  describe('codeCountry (optional)', () => {
    it('should be valid with valid RegionsIso enum', async () => {
      dto.codeCountry = RegionsIso.FRANCE;

      const errors = await validate(dto);
      const codeCountryErrors = errors.filter(
        (error) => error.property === 'codeCountry',
      );
      expect(codeCountryErrors).toHaveLength(0);
    });

    it('should fail with invalid enum value', async () => {
      const invalidDto = Object.assign(new PatchTheaterDto(), {
        codeCountry: 'INVALID_COUNTRY',
      });

      const errors = await validate(invalidDto);
      const codeCountryErrors = errors.filter(
        (error) => error.property === 'codeCountry',
      );
      expect(codeCountryErrors.length).toBeGreaterThan(0);
    });

    it('should be valid when codeCountry is undefined', async () => {
      dto.codeCountry = undefined;

      const errors = await validate(dto);
      const codeCountryErrors = errors.filter(
        (error) => error.property === 'codeCountry',
      );
      expect(codeCountryErrors).toHaveLength(0);
    });
  });

  describe('city (optional)', () => {
    it('should be valid with correct city name', async () => {
      dto.city = 'Lyon';

      const errors = await validate(dto);
      const cityErrors = errors.filter((error) => error.property === 'city');
      expect(cityErrors).toHaveLength(0);
    });

    it('should fail when city is too long', async () => {
      dto.city = 'A'.repeat(61);

      const errors = await validate(dto);
      const cityErrors = errors.filter((error) => error.property === 'city');
      expect(cityErrors.length).toBeGreaterThan(0);
    });

    it('should be valid when city is undefined', async () => {
      dto.city = undefined;

      const errors = await validate(dto);
      const cityErrors = errors.filter((error) => error.property === 'city');
      expect(cityErrors).toHaveLength(0);
    });
  });

  describe('zipCode (optional)', () => {
    it('should be valid with correct zipCode', async () => {
      dto.zipCode = 69000;

      const errors = await validate(dto);
      const zipCodeErrors = errors.filter(
        (error) => error.property === 'zipCode',
      );
      expect(zipCodeErrors).toHaveLength(0);
    });

    it('should fail when zipCode is not a number', async () => {
      const invalidDto = Object.assign(new PatchTheaterDto(), {
        zipCode: '69000',
      });

      const errors = await validate(invalidDto);
      const zipCodeErrors = errors.filter(
        (error) => error.property === 'zipCode',
      );
      expect(zipCodeErrors.length).toBeGreaterThan(0);
    });

    it('should be valid when zipCode is undefined', async () => {
      dto.zipCode = undefined;

      const errors = await validate(dto);
      const zipCodeErrors = errors.filter(
        (error) => error.property === 'zipCode',
      );
      expect(zipCodeErrors).toHaveLength(0);
    });
  });

  describe('phoneNumber (optional)', () => {
    it('should be valid with correct phone number', async () => {
      dto.phoneNumber = '+33987654321';

      const errors = await validate(dto);
      const phoneErrors = errors.filter(
        (error) => error.property === 'phoneNumber',
      );
      expect(phoneErrors).toHaveLength(0);
    });

    it('should fail when phoneNumber is too long', async () => {
      dto.phoneNumber = '+33' + '1'.repeat(30);

      const errors = await validate(dto);
      const phoneErrors = errors.filter(
        (error) => error.property === 'phoneNumber',
      );
      expect(phoneErrors.length).toBeGreaterThan(0);
    });

    it('should be valid when phoneNumber is undefined', async () => {
      dto.phoneNumber = undefined;

      const errors = await validate(dto);
      const phoneErrors = errors.filter(
        (error) => error.property === 'phoneNumber',
      );
      expect(phoneErrors).toHaveLength(0);
    });
  });

  describe('openingTime and closingTime (optional)', () => {
    it('should be valid with correct time format', async () => {
      dto.openingTime = '09:00';
      dto.closingTime = '22:00';

      const errors = await validate(dto);
      const timeErrors = errors.filter(
        (error) =>
          error.property === 'openingTime' || error.property === 'closingTime',
      );
      expect(timeErrors).toHaveLength(0);
    });

    it('should fail with invalid time format for openingTime', async () => {
      dto.openingTime = '25:00';

      const errors = await validate(dto);
      const openingTimeErrors = errors.filter(
        (error) => error.property === 'openingTime',
      );
      expect(openingTimeErrors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid time format for closingTime', async () => {
      dto.closingTime = '9:0';

      const errors = await validate(dto);
      const closingTimeErrors = errors.filter(
        (error) => error.property === 'closingTime',
      );
      expect(closingTimeErrors.length).toBeGreaterThan(0);
    });

    it('should be valid when openingTime is undefined', async () => {
      dto.openingTime = undefined;

      const errors = await validate(dto);
      const openingTimeErrors = errors.filter(
        (error) => error.property === 'openingTime',
      );
      expect(openingTimeErrors).toHaveLength(0);
    });

    it('should be valid when closingTime is undefined', async () => {
      dto.closingTime = undefined;

      const errors = await validate(dto);
      const closingTimeErrors = errors.filter(
        (error) => error.property === 'closingTime',
      );
      expect(closingTimeErrors).toHaveLength(0);
    });
  });

  describe('address (optional)', () => {
    it('should be valid with correct address', async () => {
      dto.address = '456 Updated Street, Lyon';

      const errors = await validate(dto);
      const addressErrors = errors.filter(
        (error) => error.property === 'address',
      );
      expect(addressErrors).toHaveLength(0);
    });

    it('should be valid when address is undefined', async () => {
      dto.address = undefined;

      const errors = await validate(dto);
      const addressErrors = errors.filter(
        (error) => error.property === 'address',
      );
      expect(addressErrors).toHaveLength(0);
    });

    it('should fail when address is not a string', async () => {
      const invalidDto = Object.assign(new PatchTheaterDto(), { address: 123 });

      const errors = await validate(invalidDto);
      const addressErrors = errors.filter(
        (error) => error.property === 'address',
      );
      expect(addressErrors.length).toBeGreaterThan(0);
    });
  });

  describe('partial updates', () => {
    it('should be valid with only name provided', async () => {
      dto.name = 'Only Name Updated';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should be valid with multiple fields provided', async () => {
      dto.name = 'Updated Theater';
      dto.city = 'Marseille';
      dto.zipCode = 13000;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate each field independently', async () => {
      dto.name = 'AB'; // Too short
      dto.city = 'Valid City';
      dto.zipCode = 13000;

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      const cityErrors = errors.filter((error) => error.property === 'city');
      const zipCodeErrors = errors.filter(
        (error) => error.property === 'zipCode',
      );

      expect(nameErrors.length).toBeGreaterThan(0);
      expect(cityErrors).toHaveLength(0);
      expect(zipCodeErrors).toHaveLength(0);
    });
  });
});
