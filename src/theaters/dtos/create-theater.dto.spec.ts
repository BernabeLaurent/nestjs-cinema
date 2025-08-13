import { validate } from 'class-validator';
import { CreateTheaterDto } from './create-theater.dto';
import { RegionsIso } from '../../common/enums/regions-iso.enum';

describe('CreateTheaterDto', () => {
  let dto: CreateTheaterDto;

  beforeEach(() => {
    dto = new CreateTheaterDto();
  });

  describe('name', () => {
    it('should be valid with correct name', async () => {
      dto.name = 'Test Theater';
      dto.codeCountry = RegionsIso.FRANCE;
      dto.address = '123 Test Street';
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.phoneNumber = '+33123456789';
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';

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

    it('should fail when name is empty', async () => {
      dto.name = '';

      const errors = await validate(dto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should fail when name is not a string', async () => {
      const invalidDto = Object.assign(new CreateTheaterDto(), { name: 123 });

      const errors = await validate(invalidDto);
      const nameErrors = errors.filter((error) => error.property === 'name');
      expect(nameErrors.length).toBeGreaterThan(0);
    });
  });

  describe('codeCountry', () => {
    it('should be valid with valid RegionsIso enum', async () => {
      dto.codeCountry = RegionsIso.FRANCE;
      dto.name = 'Test Theater';
      dto.address = '123 Test Street';
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.phoneNumber = '+33123456789';
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';

      const errors = await validate(dto);
      const codeCountryErrors = errors.filter(
        (error) => error.property === 'codeCountry',
      );
      expect(codeCountryErrors).toHaveLength(0);
    });

    it('should fail with invalid enum value', async () => {
      const invalidDto = Object.assign(new CreateTheaterDto(), {
        codeCountry: 'INVALID_COUNTRY',
      });

      const errors = await validate(invalidDto);
      const codeCountryErrors = errors.filter(
        (error) => error.property === 'codeCountry',
      );
      expect(codeCountryErrors.length).toBeGreaterThan(0);
    });
  });

  describe('city', () => {
    it('should be valid with correct city name', async () => {
      dto.city = 'Paris';
      dto.name = 'Test Theater';
      dto.codeCountry = RegionsIso.FRANCE;
      dto.address = '123 Test Street';
      dto.zipCode = 75001;
      dto.phoneNumber = '+33123456789';
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';

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

    it('should fail when city is empty', async () => {
      dto.city = '';

      const errors = await validate(dto);
      const cityErrors = errors.filter((error) => error.property === 'city');
      expect(cityErrors.length).toBeGreaterThan(0);
    });
  });

  describe('zipCode', () => {
    it('should be valid with correct zipCode', async () => {
      dto.zipCode = 75001;
      dto.name = 'Test Theater';
      dto.codeCountry = RegionsIso.FRANCE;
      dto.address = '123 Test Street';
      dto.city = 'Paris';
      dto.phoneNumber = '+33123456789';
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';

      const errors = await validate(dto);
      const zipCodeErrors = errors.filter(
        (error) => error.property === 'zipCode',
      );
      expect(zipCodeErrors).toHaveLength(0);
    });

    it('should fail when zipCode is not a number', async () => {
      const invalidDto = Object.assign(new CreateTheaterDto(), {
        zipCode: '75001',
      });

      const errors = await validate(invalidDto);
      const zipCodeErrors = errors.filter(
        (error) => error.property === 'zipCode',
      );
      expect(zipCodeErrors.length).toBeGreaterThan(0);
    });
  });

  describe('phoneNumber', () => {
    it('should be valid with correct phone number', async () => {
      dto.phoneNumber = '+33123456789';
      dto.name = 'Test Theater';
      dto.codeCountry = RegionsIso.FRANCE;
      dto.address = '123 Test Street';
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';

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

    it('should fail when phoneNumber is empty', async () => {
      dto.phoneNumber = '';

      const errors = await validate(dto);
      const phoneErrors = errors.filter(
        (error) => error.property === 'phoneNumber',
      );
      expect(phoneErrors.length).toBeGreaterThan(0);
    });
  });

  describe('openingTime and closingTime', () => {
    it('should be valid with correct time format', async () => {
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';
      dto.name = 'Test Theater';
      dto.codeCountry = RegionsIso.FRANCE;
      dto.address = '123 Test Street';
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.phoneNumber = '+33123456789';

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
      dto.closingTime = '8:0';

      const errors = await validate(dto);
      const closingTimeErrors = errors.filter(
        (error) => error.property === 'closingTime',
      );
      expect(closingTimeErrors.length).toBeGreaterThan(0);
    });

    it('should fail when openingTime is empty', async () => {
      dto.openingTime = '';

      const errors = await validate(dto);
      const openingTimeErrors = errors.filter(
        (error) => error.property === 'openingTime',
      );
      expect(openingTimeErrors.length).toBeGreaterThan(0);
    });

    it('should fail when closingTime is empty', async () => {
      dto.closingTime = '';

      const errors = await validate(dto);
      const closingTimeErrors = errors.filter(
        (error) => error.property === 'closingTime',
      );
      expect(closingTimeErrors.length).toBeGreaterThan(0);
    });
  });

  describe('address', () => {
    it('should be valid with correct address', async () => {
      dto.address = '123 Test Street, Paris';
      dto.name = 'Test Theater';
      dto.codeCountry = RegionsIso.FRANCE;
      dto.city = 'Paris';
      dto.zipCode = 75001;
      dto.phoneNumber = '+33123456789';
      dto.openingTime = '08:00';
      dto.closingTime = '23:00';

      const errors = await validate(dto);
      const addressErrors = errors.filter(
        (error) => error.property === 'address',
      );
      expect(addressErrors).toHaveLength(0);
    });

    it('should fail when address is empty', async () => {
      dto.address = '';

      const errors = await validate(dto);
      const addressErrors = errors.filter(
        (error) => error.property === 'address',
      );
      expect(addressErrors.length).toBeGreaterThan(0);
    });

    it('should fail when address is not a string', async () => {
      const invalidDto = Object.assign(new CreateTheaterDto(), {
        address: 123,
      });

      const errors = await validate(invalidDto);
      const addressErrors = errors.filter(
        (error) => error.property === 'address',
      );
      expect(addressErrors.length).toBeGreaterThan(0);
    });
  });
});
