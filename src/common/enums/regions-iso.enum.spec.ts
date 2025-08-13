import { RegionsIso } from './regions-iso.enum';

describe('RegionsIso Enum', () => {
  it('should be defined', () => {
    expect(RegionsIso).toBeDefined();
  });

  it('should have USA value', () => {
    expect(RegionsIso.USA).toBeDefined();
    expect(RegionsIso.USA).toBe('US');
  });

  it('should have FRANCE value', () => {
    expect(RegionsIso.FRANCE).toBeDefined();
    expect(RegionsIso.FRANCE).toBe('FR');
  });

  it('should contain all expected regions', () => {
    const expectedRegions = ['US', 'FR'];
    const enumValues = Object.values(RegionsIso);

    expect(enumValues).toEqual(expectedRegions);
    expect(enumValues).toHaveLength(2);
  });

  it('should have correct keys', () => {
    const expectedKeys = ['USA', 'FRANCE'];
    const enumKeys = Object.keys(RegionsIso);

    expect(enumKeys).toEqual(expectedKeys);
    expect(enumKeys).toHaveLength(2);
  });

  it('should use ISO 3166-1 alpha-2 country codes', () => {
    expect(RegionsIso.USA).toBe('US');
    expect(RegionsIso.FRANCE).toBe('FR');
  });

  it('should be able to iterate over enum values', () => {
    const regions = Object.values(RegionsIso);

    regions.forEach((region) => {
      expect(typeof region).toBe('string');
      expect(region).toBeTruthy();
      expect(region).toHaveLength(2); // ISO codes are 2 characters
    });
  });

  it('should support region workflow', () => {
    expect(RegionsIso.USA).toBeDefined();
    expect(RegionsIso.FRANCE).toBeDefined();
  });

  it('should be usable in switch statements', () => {
    const getRegionName = (region: RegionsIso) => {
      switch (region) {
        case RegionsIso.USA:
          return 'United States';
        case RegionsIso.FRANCE:
          return 'France';
        default:
          return 'Unknown';
      }
    };

    expect(getRegionName(RegionsIso.USA)).toBe('United States');
    expect(getRegionName(RegionsIso.FRANCE)).toBe('France');
  });

  it('should be serializable to JSON', () => {
    expect(JSON.stringify(RegionsIso.USA)).toBe('"US"');
    expect(JSON.stringify(RegionsIso.FRANCE)).toBe('"FR"');
  });

  it('should support region validation', () => {
    const isValidRegion = (code: string): code is RegionsIso => {
      return Object.values(RegionsIso).includes(code as RegionsIso);
    };

    expect(isValidRegion('US')).toBe(true);
    expect(isValidRegion('FR')).toBe(true);
    expect(isValidRegion('DE')).toBe(false);
    expect(isValidRegion('')).toBe(false);
    expect(isValidRegion('USA')).toBe(false); // Full country name, not ISO code
  });

  it('should have all values as uppercase strings', () => {
    Object.values(RegionsIso).forEach((region) => {
      expect(region).toBe(region.toUpperCase());
      expect(/^[A-Z]{2}$/.test(region)).toBe(true); // Two uppercase letters
    });
  });

  it('should support region comparison', () => {
    const usa = RegionsIso.USA;
    const france = RegionsIso.FRANCE;

    expect(usa).not.toBe(france);
    expect(usa).toBe('US');
    expect(france).toBe('FR');
  });

  it('should work with arrays and collections', () => {
    const supportedRegions = [RegionsIso.USA, RegionsIso.FRANCE];

    expect(supportedRegions).toHaveLength(2);
    expect(supportedRegions).toContain('US');
    expect(supportedRegions).toContain('FR');
  });

  it('should support regional logic', () => {
    const isNorthAmerica = (region: RegionsIso): boolean => {
      return region === RegionsIso.USA;
    };

    const isEurope = (region: RegionsIso): boolean => {
      return region === RegionsIso.FRANCE;
    };

    expect(isNorthAmerica(RegionsIso.USA)).toBe(true);
    expect(isNorthAmerica(RegionsIso.FRANCE)).toBe(false);
    expect(isEurope(RegionsIso.FRANCE)).toBe(true);
    expect(isEurope(RegionsIso.USA)).toBe(false);
  });

  it('should maintain consistent format', () => {
    Object.values(RegionsIso).forEach((region) => {
      expect(typeof region).toBe('string');
      expect(region).toHaveLength(2);
      expect(region).toMatch(/^[A-Z]{2}$/);
    });
  });

  it('should be extensible for additional regions', () => {
    // Test that the enum structure supports adding more regions
    const regionCount = Object.keys(RegionsIso).length;
    expect(regionCount).toBe(2);

    // Verify structure is consistent for potential additions
    Object.entries(RegionsIso).forEach(([key, value]) => {
      expect(typeof key).toBe('string');
      expect(typeof value).toBe('string');
      expect(key.length).toBeGreaterThan(0);
      expect(value).toHaveLength(2);
    });
  });
});
