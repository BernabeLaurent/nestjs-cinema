import { ImageType } from './images-types.enum';

describe('ImageType Enum', () => {
  it('should be defined', () => {
    expect(ImageType).toBeDefined();
  });

  it('should have POSTER value', () => {
    expect(ImageType.POSTER).toBeDefined();
    expect(ImageType.POSTER).toBe(0);
  });

  it('should have BACKDROP value', () => {
    expect(ImageType.BACKDROP).toBeDefined();
    expect(ImageType.BACKDROP).toBe(1);
  });

  it('should have ACTOR value', () => {
    expect(ImageType.ACTOR).toBeDefined();
    expect(ImageType.ACTOR).toBe(2);
  });

  it('should contain all expected image types', () => {
    const expectedTypes = [0, 1, 2];
    const enumValues = Object.values(ImageType).filter(
      (value) => typeof value === 'number',
    );

    expect(enumValues).toEqual(expectedTypes);
    expect(enumValues).toHaveLength(3);
  });

  it('should have correct keys', () => {
    const expectedKeys = ['POSTER', 'BACKDROP', 'ACTOR'];
    const enumKeys = Object.keys(ImageType).filter((key) => isNaN(Number(key)));

    expect(enumKeys).toEqual(expectedKeys);
    expect(enumKeys).toHaveLength(3);
  });

  it('should be able to iterate over enum values', () => {
    const numericValues = Object.values(ImageType).filter(
      (value) => typeof value === 'number',
    );

    numericValues.forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });

  it('should support image type workflow', () => {
    expect(ImageType.POSTER).toBeDefined();
    expect(ImageType.BACKDROP).toBeDefined();
    expect(ImageType.ACTOR).toBeDefined();
  });

  it('should be usable in switch statements', () => {
    const getImageTypeName = (imageType: ImageType) => {
      switch (imageType) {
        case ImageType.POSTER:
          return 'poster';
        case ImageType.BACKDROP:
          return 'backdrop';
        case ImageType.ACTOR:
          return 'actor';
        default:
          return 'unknown';
      }
    };

    expect(getImageTypeName(ImageType.POSTER)).toBe('poster');
    expect(getImageTypeName(ImageType.BACKDROP)).toBe('backdrop');
    expect(getImageTypeName(ImageType.ACTOR)).toBe('actor');
  });

  it('should maintain numeric values for comparison', () => {
    expect(ImageType.POSTER).toBe(0);
    expect(ImageType.BACKDROP).toBe(1);
    expect(ImageType.ACTOR).toBe(2);
  });

  it('should support enum value comparison', () => {
    expect(Number(ImageType.POSTER)).toBe(0);
    expect(Number(ImageType.BACKDROP)).toBe(1);
    expect(Number(ImageType.ACTOR)).toBe(2);

    const poster = ImageType.POSTER;
    const backdrop = ImageType.BACKDROP;
    expect(poster).not.toBe(backdrop);
  });

  it('should be serializable to JSON', () => {
    expect(JSON.stringify(ImageType.POSTER)).toBe('0');
    expect(JSON.stringify(ImageType.BACKDROP)).toBe('1');
    expect(JSON.stringify(ImageType.ACTOR)).toBe('2');
  });

  it('should have string keys accessible', () => {
    const enumAsRecord = ImageType as Record<number, string>;
    expect(enumAsRecord[0]).toBe('POSTER');
    expect(enumAsRecord[1]).toBe('BACKDROP');
    expect(enumAsRecord[2]).toBe('ACTOR');
  });

  it('should support reverse mapping', () => {
    const enumAsRecord = ImageType as Record<number, string>;
    expect(enumAsRecord[ImageType.POSTER]).toBe('POSTER');
    expect(enumAsRecord[ImageType.BACKDROP]).toBe('BACKDROP');
    expect(enumAsRecord[ImageType.ACTOR]).toBe('ACTOR');
  });

  it('should handle image type categorization', () => {
    const isMediaImage = (imageType: ImageType) =>
      imageType === ImageType.POSTER || imageType === ImageType.BACKDROP;
    const isPersonImage = (imageType: ImageType) =>
      imageType === ImageType.ACTOR;

    expect(isMediaImage(ImageType.POSTER)).toBe(true);
    expect(isMediaImage(ImageType.BACKDROP)).toBe(true);
    expect(isMediaImage(ImageType.ACTOR)).toBe(false);
    expect(isPersonImage(ImageType.ACTOR)).toBe(true);
    expect(isPersonImage(ImageType.POSTER)).toBe(false);
  });

  it('should have consistent enum structure', () => {
    const keys = Object.keys(ImageType);
    const values = Object.values(ImageType);

    expect(keys).toContain('POSTER');
    expect(keys).toContain('BACKDROP');
    expect(keys).toContain('ACTOR');
    expect(keys).toContain('0');
    expect(keys).toContain('1');
    expect(keys).toContain('2');

    expect(values).toContain('POSTER');
    expect(values).toContain('BACKDROP');
    expect(values).toContain('ACTOR');
    expect(values).toContain(0);
    expect(values).toContain(1);
    expect(values).toContain(2);
  });
});
