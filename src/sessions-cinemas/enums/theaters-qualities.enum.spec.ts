import { TheaterQuality } from './theaters-qualities.enum';

describe('TheaterQuality Enum', () => {
  it('should be defined', () => {
    expect(TheaterQuality).toBeDefined();
  });

  it('should have correct values', () => {
    expect(TheaterQuality.SD).toBe('SD');
    expect(TheaterQuality.HD).toBe('HD');
    expect(TheaterQuality.FULL_HD).toBe('FULL_HD');
    expect(TheaterQuality.UHD_4K).toBe('UHD_4K');
    expect(TheaterQuality.UHD_8K).toBe('UHD_8K');
    expect(TheaterQuality.IMAX).toBe('IMAX');
    expect(TheaterQuality.DOLBY_CINEMA).toBe('DOLBY_CINEMA');
    expect(TheaterQuality.THREE_D).toBe('3D');
  });

  it('should contain all expected qualities', () => {
    const expectedQualities = [
      'SD',
      'HD',
      'FULL_HD',
      'UHD_4K',
      'UHD_8K',
      'IMAX',
      'DOLBY_CINEMA',
      '3D',
    ];
    const enumValues = Object.values(TheaterQuality);

    expect(enumValues).toEqual(expectedQualities);
    expect(enumValues).toHaveLength(8);
  });

  it('should have correct keys', () => {
    const expectedKeys = [
      'SD',
      'HD',
      'FULL_HD',
      'UHD_4K',
      'UHD_8K',
      'IMAX',
      'DOLBY_CINEMA',
      'THREE_D',
    ];
    const enumKeys = Object.keys(TheaterQuality);

    expect(enumKeys).toEqual(expectedKeys);
    expect(enumKeys).toHaveLength(8);
  });

  it('should be able to iterate over enum values', () => {
    const qualities = Object.values(TheaterQuality);

    qualities.forEach((quality) => {
      expect(typeof quality).toBe('string');
      expect(quality).toBeTruthy();
    });
  });

  it('should support standard definition qualities', () => {
    expect(TheaterQuality.SD).toBeDefined();
    expect(TheaterQuality.HD).toBeDefined();
    expect(TheaterQuality.FULL_HD).toBeDefined();
  });

  it('should support ultra high definition qualities', () => {
    expect(TheaterQuality.UHD_4K).toBeDefined();
    expect(TheaterQuality.UHD_8K).toBeDefined();
  });

  it('should support premium cinema experiences', () => {
    expect(TheaterQuality.IMAX).toBeDefined();
    expect(TheaterQuality.DOLBY_CINEMA).toBeDefined();
    expect(TheaterQuality.THREE_D).toBeDefined();
  });
});
